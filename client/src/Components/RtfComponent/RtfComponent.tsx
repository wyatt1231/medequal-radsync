import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill component
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import { v4 } from "uuid";

import RtfComponentUi from "./RtfComponentUi";
import {
  DEFAULT_FONT_SIZE,
  FONT_SIZES,
  INDENT_STEP_PT,
  keepFirstLineIndent,
  NEW_REPORT_FONT_SIZE,
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
              const current = parseFloat(line.formats().leftindent ?? "0") || 0;
              const next = Math.max(0, current + step);
              quill.formatLine(quill.getIndex(line), 1, "leftindent", next > 0 ? `${next}pt` : false, "user");
            });
          },
        },
      },
      clipboard: {
        matchers: [[Node.ELEMENT_NODE, keepFirstLineIndent]],
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
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
          </span>

          <span className="ql-formats">
            <button className="ql-align" value="" title="Align left" />
            <button className="ql-align" value="center" title="Center" />
            <button className="ql-align" value="right" title="Align right" />
            <button className="ql-align" value="justify" title="Justify" />
          </span>

          <span className="ql-formats">
            <button className="ql-indent" value="-1" title="Decrease indent" />
            <button className="ql-indent" value="+1" title="Increase indent" />
          </span>

          <span className="ql-formats">
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
          </span>
          <span className="ql-formats">
            <Box display={`grid`} alignItems={`center`} alignContent={`center`} gridAutoFlow={`column`}>
              <IconButton title={is_full_screen ? "Exit Full Screen" : "Enter Full Screen"} onClick={onClickFullScreen} size={"small"}>
                {is_full_screen ? <FullscreenExitIcon fontSize="small" color="primary" /> : <FullscreenIcon fontSize="small" color="primary" />}
              </IconButton>

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
      <div style={{ height: height ?? `auto`, overflowY: `auto` }}>
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
