import React, { useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill"; // Import ReactQuill component
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
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
  const fontSizeArr = ["8px", "9px", "10px", "11px", "12px"];
  SizeStyle.whitelist = fontSizeArr;
  Quill.register(SizeStyle, true);
};

setUpQuill();

// Type for the value of the editor
type RtfComponentProps = {
  value: string;
  read_only?: boolean;
  height?: string;
  onChange: (value: string) => void;
};

const RtfComponent: React.FC<RtfComponentProps> = ({ value, onChange, read_only, height }) => {
  const editorRef = useRef(null);

  const modules = {
    toolbar: [["bold", "italic", "underline"], [{ size: [`12px`, `11px`, `10px`, "9px", "8px"] }]],
    clipboard: {
      matchVisual: false,
    },
  };

  const handleSelectionChange = (range, source) => {
    if (range && editorRef.current) {
      const quill = editorRef.current.getEditor();
      const formats = quill.getFormat(range.index, range.length);
      const size = formats.size;

      // Get the parent <p> element where the cursor is
      const parent = quill.root.querySelector(":focus")?.closest("p");

      if (parent && size) {
        // Apply font-size directly to the parent <p> instead of creating a <span>
        parent.style.fontSize = size;
      }
    }
  };

  // Handle change in the Quill editor content
  const handleChange = (content: string) => {
    // const htmp_with_default_font_size = StringUtil.encloseTextInSpanWithFontSize(content, `11px`);
    // console.log(`content`, htmp_with_default_font_size);
    onChange(content);
  };

  // Optional: You can define Quill configurations here

  useEffect(() => {
    const editor: any = editorRef.current.editor;

    editor.keyboard.bindings[`9`] = null; //disable tab

    // Clean up when component unmounts
    return () => {
      // Remove the custom key bindings on unmount
    };
  }, []);
  return (
    <RtfComponentUi className="editor-container" style={{ height: height ?? `auto`, overflowY: `auto` }}>
      <ReactQuill
        theme="snow"
        ref={editorRef}
        value={value}
        onChange={handleChange}
        modules={modules} // Apply the toolbar configuration
        placeholder="Write here..."
        readOnly={read_only}
        // onChangeSelection={handleSelectionChange}
      />
    </RtfComponentUi>
  );
};

export default RtfComponent;
