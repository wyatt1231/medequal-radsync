import React, { useRef } from "react";
import ReactQuill, { Quill } from "react-quill"; // Import ReactQuill component
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import RtfComponentUi from "./RtfComponentUi";

// const setUpIndent = function setUpIndentStyle() {
//   const Parchment: any = Quill.import("parchment");
//   class IndentAttributor extends Parchment.Attributor {
//     add(node, value) {
//       if (value === 0) {
//         this.remove(node);
//         return true;
//       } else {
//         return super.add(node, `${value}em`);
//       }
//     }
//   }

//   const IndentAttr: any = IndentAttributor;

//   let IndentStyle: any = new IndentAttr("indent", "text-indent", {
//     scope: Parchment.Scope.BLOCK,
//     whitelist: ["1em", "2em", "3em", "4em", "5em", "6em", "7em", "8em", "9em"],
//   });
//   Quill.register(IndentStyle, true);
// };

// const setDefaultMargins = () => {
//   const Block: any = Quill.import("blots/block");
//   class Pblock extends Block {
//     static create(value) {
//       let node = super.create();
//       return node;
//     }
//   }
//   Quill.register(Pblock, true);
// };
// const customHeader = () => {
//   const Block: any = Quill.import("formats/header");
//   class Hblock extends Block {
//     static create(value) {
//       let node = super.create(value);
//       return node;
//     }
//     static formats(node) {
//       return this.tagName.indexOf(node.tagName) + 1;
//     }
//   }
//   Hblock.blotName = "header";
//   Hblock.tagName = ["H1", "H2", "H3", "H4", "H5", "H6"];
//   Quill.register(Hblock, true);
// };

const setUpQuill = function SetupQuill() {
  // configure Quill to use inline styles so the email's format properly
  var DirectionAttribute: any = Quill.import("attributors/attribute/direction");
  Quill.register(DirectionAttribute, true);
  var AlignClass: any = Quill.import("attributors/class/align");
  Quill.register(AlignClass, true);
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
  Block.tagName = `div`;
  Quill.register(Block);

  var AlignStyle: any = Quill.import("attributors/style/align");
  Quill.register(AlignStyle, true);
  var BackgroundStyle: any = Quill.import("attributors/style/background");
  Quill.register(BackgroundStyle, true);

  // var ColorStyle: any = Quill.import("attributors/style/color");
  // Quill.register(ColorStyle, true);

  // var DirectionStyle: any = Quill.import("attributors/style/direction");
  // Quill.register(DirectionStyle, true);

  // var FontStyle: any = Quill.import("attributors/style/font");
  // FontStyle.whitelist = [
  // 	"sans serif",
  // 	"serif",
  // 	"monospace",
  // 	"verdana",
  // 	"calibri",
  // 	"arial",
  // 	"comic sans ms",
  // 	"georgia",
  // 	"impact",
  // 	"segoe print",
  // 	"segoe script",
  // 	"segoe ui",
  // 	"tahoma",
  // 	"times new roman",
  // ];
  // Quill.register(FontStyle, true);

  // var SizeStyle: any = Quill.import("attributors/style/size");
  // const fontSizeArr = ["8px", "9px", "10px", "12px", "14px", "16px", "20px", "24px", "32px", "42px", "54px", "68px", "84px", "98px"];
  // SizeStyle.whitelist = fontSizeArr;
  // Quill.register(SizeStyle, true);
  //   customHeader();
  //   setUpIndent();
  //   setDefaultMargins();
};

setUpQuill();

// Type for the value of the editor
type RtfComponentProps = {
  value: string;
  read_only?: boolean;
  onChange: (value: string) => void;
};

const RtfComponent: React.FC<RtfComponentProps> = ({ value, onChange, read_only }) => {
  const editorRef = useRef<ReactQuill>(null);

  // Handle change in the Quill editor content
  const handleChange = (content: string) => {
    onChange(content);
  };

  // Optional: You can define Quill configurations here
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      ["clean"], // Add the "clear" button
    ],
  };

  return (
    <RtfComponentUi className="editor-container">
      <ReactQuill
        ref={editorRef}
        value={value}
        onChange={handleChange}
        modules={modules} // Apply the toolbar configuration
        placeholder="Write here..."
        readOnly={read_only}
      />
    </RtfComponentUi>
  );
};

export default RtfComponent;
