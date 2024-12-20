import { Box, MenuItem, TextField } from "@mui/material";
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
  const editorRef = useRef(null);
  const [toolbar_id, set_toolbar_id] = useState(`rtf-toolbar-${v4()}`);

  const onSetFontSize = (value) => {
    const font_size = value;
    set_font_size(font_size);
    if (editorRef.current) {
      const quill = editorRef.current.getEditor();
      quill.formatText(0, quill.getLength(), "size", font_size);
    }
  };

  // Handle change in the Quill editor content
  const handleChange = (content: string) => {
    onChange(content);
  };

  // Optional: You can define Quill configurations here

  useEffect(() => {
    const editor: any = editorRef?.current?.editor;
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

  return (
    <RtfComponentUi id={props.label} className={`editor-container`}>
      {/* <div id="toolbar"> */}
      <div id={toolbar_id}>
        <Box>
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
        </Box>
      </div>
      <div style={{ height: height ?? `auto`, overflowY: `auto` }}>
        <ReactQuill
          theme="snow"
          ref={editorRef}
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
