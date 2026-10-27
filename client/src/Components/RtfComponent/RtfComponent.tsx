import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Box, Button, IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill component
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import { v4 } from "uuid";

import RtfComponentUi from "./RtfComponentUi";
import {
  clampFirstIndent,
  DEFAULT_FONT_SIZE,
  FONT_SIZES,
  INDENT_STEP_PT,
  keepFirstLineIndent,
  keepParagraphIndents,
  NEW_REPORT_FONT_SIZE,
  parseMark,
  registerRtfFormats,
  RTF_FORMATS,
} from "./RtfQuillSetup";

registerRtfFormats();

export interface RtfActionButtons {
  label: string;
  onClick: () => Promise<void>;
}

// Type for the value of the editor
type RtfComponentProps = {
  value: string;
  label?: string;
  read_only?: boolean;
  height?: string;
  onChange?: (value: string) => void;
  actions?: RtfActionButtons[];
};

const RtfComponent: React.FC<RtfComponentProps> = ({ value, onChange, read_only, height, ...props }) => {
  const ref_editor = useRef<ReactQuill>(null);
  const ref_container = useRef(null);

  const [toolbar_id] = useState(`rtf-toolbar-${v4()}`);

  const [is_full_screen, set_is_full_screen] = useState(false);
  const [selection_font_size, set_selection_font_size] = useState(DEFAULT_FONT_SIZE);

  const onClickFullScreen = (): void => {
    if (is_full_screen) {
      set_is_full_screen(false);
      document
        .exitFullscreen()
        .catch((err) => console.error("Error exiting fullscreen:", err));
    } else {
      set_is_full_screen(true);
      if (ref_container.current) {
        if (ref_container.current.requestFullscreen) {
          ref_container.current.requestFullscreen();
        } else if (ref_container.current.mozRequestFullScreen) {
          ref_container.current.mozRequestFullScreen();
        } else if (ref_container.current.webkitRequestFullscreen) {
          ref_container.current.webkitRequestFullscreen();
        } else if (ref_container.current.msRequestFullscreen) {
          ref_container.current.msRequestFullscreen();
        }
      }
    }
  };

  const onSetFontSize = (font_size: string): void => {
    const quill = ref_editor.current?.getEditor();
    if (!quill) return;
    quill.getSelection(true);
    quill.format("size", font_size === DEFAULT_FONT_SIZE ? false : font_size, "user");
    set_selection_font_size(font_size);
  };

  // Handle change in the Quill editor content
  const handleChange = (content: string): void => {
    onChange && onChange(content);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: `#` + toolbar_id,
        handlers: {
          indent: (direction: string): void => {
            const quill = ref_editor.current?.getEditor();
            const range = quill?.getSelection(true);
            if (!quill || !range) return;

            const step = direction === "-1" ? -INDENT_STEP_PT : INDENT_STEP_PT;
            // getLines() visits nothing for a collapsed caret, so fall back to the caret's own line.
            const lines = range.length > 0 ? quill.getLines(range.index, range.length) : [quill.getLine(range.index)[0]];
            lines.forEach((line) => {
              const formats = line.formats();
              const current = parseFloat(formats.leftindent ?? "0") || 0;
              const next = Math.max(0, current + step);
              const first = parseFloat(formats.firstindent ?? "0") || 0;
              const clamped = clampFirstIndent(next, first);
              quill.formatLine(quill.getIndex(line), 1, "leftindent", next > 0 ? `${next}pt` : false, "user");
              if (clamped !== first) quill.formatLine(quill.getIndex(line), 1, "firstindent", clamped !== 0 ? `${clamped}pt` : false, "user");
            });
          },
        },
      },
      clipboard: {
        matchers: [
          [Node.ELEMENT_NODE, keepFirstLineIndent],
          [Node.ELEMENT_NODE, keepParagraphIndents],
        ],
      },
      keyboard: {
        bindings: {
          softbreak: {
            key: 13,
            shiftKey: true,
            handler: (range: { index: number; length: number }): boolean => {
              const quill = ref_editor.current?.getEditor();
              if (!quill) return true;
              // Carry the caret's character format onto the break so text typed after it keeps the same style.
              const { bold, italic, underline, size } = quill.getFormat(range);
              if (range.length > 0) quill.deleteText(range.index, range.length, "user");
              quill.insertEmbed(range.index, "softbreak", true, "user");
              quill.formatText(range.index, 1, { bold, italic, underline, size }, "user");
              quill.setSelection(range.index + 1, 0, "user");
              return false;
            },
          },
        },
      },
    }),
    [toolbar_id]
  );

  useEffect(() => {
    const editor: any = ref_editor?.current?.editor;
    if (!!editor) {
      editor.keyboard.bindings[`9`] = null; //Disable tab
    }

    // Clean up when component unmounts
    return () => {
      // Remove the custom key bindings on unmount
    };
  }, []);

  useEffect(() => {
    const quill = ref_editor.current?.getEditor();
    if (!quill) return;

    const onEditorChange = (): void => {
      const range = quill.getSelection();
      if (!range) return;

      // Like the RichTextBox, typing on a blank line uses that line's paragraph-mark format.
      // Once the line has text the mark is stale; drop it so Enter doesn't copy it onto the next blank line.
      const [line] = quill.getLine(range.index);
      if (!read_only && line && line.length() > 1 && line.formats().mark) {
        quill.formatLine(quill.getIndex(line), 1, "mark", false, "silent");
      }
      const mark = !read_only && range.length === 0 && line && line.length() <= 1 ? parseMark(line.formats().mark) : null;
      if (mark && quill.getFormat(range).size === undefined) {
        if (mark.bold) quill.format("bold", true, "user");
        if (mark.italic) quill.format("italic", true, "user");
        if (mark.underline) quill.format("underline", true, "user");
        quill.format("size", mark.size, "user");
      }

      // A blank report starts in the legacy VB.NET radiology default: bold, 11.5pt.
      if (!read_only && quill.getLength() <= 1 && Object.keys(quill.getFormat(range)).length === 0) {
        quill.format("bold", true, "user");
        quill.format("size", NEW_REPORT_FONT_SIZE, "user");
      }

      const size = quill.getFormat(range).size;
      set_selection_font_size(typeof size === "string" ? size : Array.isArray(size) ? "" : DEFAULT_FONT_SIZE);
    };

    quill.on("editor-change", onEditorChange);
    return () => {
      quill.off("editor-change", onEditorChange);
    };
  }, [read_only]);

  useEffect(() => {
    // Event handler
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        set_is_full_screen(false);
        // set_is_full_screen_imaging(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Tooltips render inside the editor container so they still show while the editor is in fullscreen.
  const tooltip_props = { arrow: true, PopperProps: { container: ref_container.current } };

  const font_size_options = FONT_SIZES.includes(selection_font_size) || !selection_font_size ? FONT_SIZES : [...FONT_SIZES, selection_font_size];

  return (
    <RtfComponentUi id={props.label} className={`editor-container`} ref={ref_container}>
      {/* <div id="toolbar"> */}
      <div id={toolbar_id}>
        <Box
          display={`grid`}
          gridAutoFlow={`column`}
          justifyItems={`end`}
          justifyContent={`end`}
          alignItems={`center`}
          alignContent={`center`}
          gap={`.5em`}
        >
          <span className="ql-formats">
            <Tooltip title="Bold (Ctrl+B)" {...tooltip_props}>
              <button className="ql-bold" />
            </Tooltip>
            <Tooltip title="Italic (Ctrl+I)" {...tooltip_props}>
              <button className="ql-italic" />
            </Tooltip>
            <Tooltip title="Underline (Ctrl+U)" {...tooltip_props}>
              <button className="ql-underline" />
            </Tooltip>
          </span>

          <span className="ql-formats">
            <Tooltip title="Align left" {...tooltip_props}>
              <button className="ql-align" value="" />
            </Tooltip>
            <Tooltip title="Center" {...tooltip_props}>
              <button className="ql-align" value="center" />
            </Tooltip>
            <Tooltip title="Align right" {...tooltip_props}>
              <button className="ql-align" value="right" />
            </Tooltip>
            <Tooltip title="Justify" {...tooltip_props}>
              <button className="ql-align" value="justify" />
            </Tooltip>
          </span>

          <span className="ql-formats">
            <Tooltip title="Decrease indent" {...tooltip_props}>
              <button className="ql-indent" value="-1" />
            </Tooltip>
            <Tooltip title="Increase indent" {...tooltip_props}>
              <button className="ql-indent" value="+1" />
            </Tooltip>
          </span>

          <span className="ql-formats">
            <Tooltip title="Font size" {...tooltip_props}>
            <TextField
              select
              size="small"
              fullWidth
              variant="standard"
              value={selection_font_size}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
                SelectDisplayProps: { "aria-label": "Font size" } as React.HTMLAttributes<HTMLDivElement>,
              }}
              InputProps={{
                readOnly: read_only,
              }}
              style={{
                width: 70,
              }}
              onChange={(e) => {
                onSetFontSize(e.target.value);
              }}
            >
              {font_size_options.map((size) => (
                <MenuItem key={size} value={size}>
                  <span>{size}</span>
                </MenuItem>
              ))}
            </TextField>
            </Tooltip>
          </span>
          <span className="ql-formats">
            <Box display={`grid`} alignItems={`center`} alignContent={`center`} gridAutoFlow={`column`}>
              <Tooltip title={is_full_screen ? "Exit Full Screen" : "Enter Full Screen"} {...tooltip_props}>
                <IconButton onClick={onClickFullScreen} size={"small"}>
                  {is_full_screen ? <FullscreenExitIcon fontSize="small" color="primary" /> : <FullscreenIcon fontSize="small" color="primary" />}
                </IconButton>
              </Tooltip>

              {props.actions?.map((p, i) => (
                <Button
                  key={i}
                  style={{ height: 30, width: `auto` }}
                  fullWidth={true}
                  variant="text"
                  color="primary"
                  onClick={p.onClick}
                  size={"small"}
                >
                  {p.label}
                </Button>
              ))}
            </Box>
          </span>
        </Box>
      </div>
      <div className="rtf-scroll" style={{ height: height ?? `auto`, overflowY: `auto` }}>
        <ReactQuill
          theme="snow"
          ref={ref_editor}
          value={value}
          onChange={handleChange}
          placeholder="Write here..."
          readOnly={read_only}
          modules={modules} // Apply the toolbar configuration
          formats={RTF_FORMATS}
        />
      </div>
    </RtfComponentUi>
  );
};

export default RtfComponent;
