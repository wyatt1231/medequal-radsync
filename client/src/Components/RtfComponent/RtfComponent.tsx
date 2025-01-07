import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Box, IconButton, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill"; // Import ReactQuill component
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import { v4 } from "uuid";

import RtfComponentUi from "./RtfComponentUi";

const setUpQuill = function SetupQuill() {
  var DirectionAttribute: any = Quill.import("attributors/attribute/direction");
  Quill.register(DirectionAttribute, true);

  var BackgroundClass: any = Quill.import("attributors/class/background");
  Quill.register(BackgroundClass, true);
  var ColorClass: any = Quill.import("attributors/class/color");
  Quill.register(ColorClass, true);
  var DirectionClass: any = Quill.import("attributors/class/direction");
  Quill.register(DirectionClass, true);
  var FontClass: any = Quill.import("attributors/class/font");
  Quill.register(FontClass, true);
  var SizeClass: any = Quill.import("attributors/class/size");
  Quill.register(SizeClass, true);

  var Block: any = Quill.import(`blots/block`);
  Block.tagName = `p`;
  Quill.register(Block);

  var SizeStyle: any = Quill.import("attributors/style/size");
  const fontSizeArr = ["8pt", "9pt", "10pt", "11pt", "12pt"];
  SizeStyle.whitelist = fontSizeArr;
  Quill.register(SizeStyle, true);
};

setUpQuill();

export const formats = ["bold", "italic", "underline", "size"];

// Type for the value of the editor
type RtfComponentProps = {
  value: string;
  label?: string;
  read_only?: boolean;
  height?: string;
  onChange: (value: string) => void;
  font_size?: string;
  set_font_size?: React.Dispatch<React.SetStateAction<string>>;
};

const RtfComponent: React.FC<RtfComponentProps> = ({ value, onChange, read_only, height, font_size, set_font_size, ...props }) => {
  const ref_editor = useRef(null);
  const ref_container = useRef(null);

  const [toolbar_id, set_toolbar_id] = useState(`rtf-toolbar-${v4()}`);

  const [is_full_screen, set_is_full_screen] = useState(false);

  const onClickFullScreen = (): void => {
    if (is_full_screen) {
      set_is_full_screen(false);
      document
        .exitFullscreen()
        .then(() => console.log("Exited fullscreen"))
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

  const onSetFontSize = (value) => {
    const font_size = value;
    set_font_size(font_size);
    if (ref_editor.current) {
      const quill = ref_editor.current.getEditor();
      quill.formatText(0, quill.getLength(), "size", font_size);
    }
  };

  // Handle change in the Quill editor content
  const handleChange = (content: string) => {
    onChange(content);
  };

  // Optional: You can define Quill configurations here

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
    onSetFontSize(font_size);
  }, [font_size, value]);

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
            <TextField
              select
              size="small"
              fullWidth
              variant="standard"
              value={font_size}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
              }}
              InputProps={{
                readOnly: read_only,
              }}
              // disabled={read_only}
              style={{
                width: 60,
              }}
              onChange={(e) => {
                onSetFontSize(e.target.value);
              }}
            >
              <MenuItem value={"8pt"}>
                <span>8px</span>
              </MenuItem>
              <MenuItem value={"9pt"}>
                <span>9px</span>
              </MenuItem>
              <MenuItem value={"10pt"}>
                <span>10px</span>
              </MenuItem>
              <MenuItem value={"11pt"}>
                <span>11px</span>
              </MenuItem>
              <MenuItem value={"12pt"}>
                <span>12px</span>
              </MenuItem>
            </TextField>
          </span>
          <span className="ql-formats">
            <IconButton title={is_full_screen ? "Exit Full Screen" : "Enter Full Screen"} onClick={onClickFullScreen} size={"small"}>
              {is_full_screen ? <FullscreenExitIcon fontSize="small" color="primary" /> : <FullscreenIcon fontSize="small" color="primary" />}
            </IconButton>
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
          modules={{
            toolbar: {
              container: `#` + toolbar_id,
            },
          }} // Apply the toolbar configuration
          formats={formats}
        />
      </div>
    </RtfComponentUi>
  );
};

export default RtfComponent;
