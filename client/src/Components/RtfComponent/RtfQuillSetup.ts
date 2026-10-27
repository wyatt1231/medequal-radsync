import { Quill } from "react-quill";

// Formats the editor round-trips with the legacy VB.NET RichTextBox RTF (see api/Utils/Rtf). Each one maps to an
// inline style or blot the API's EditorHtmlReader understands; anything else the editor would drop on save.
export const RTF_FORMATS = ["bold", "italic", "underline", "size", "align", "leftindent", "firstindent", "softbreak"];

export const FONT_SIZES = ["8pt", "9pt", "9.5pt", "10pt", "10.5pt", "11pt", "11.5pt", "12pt", "14pt", "16pt", "18pt"];
export const DEFAULT_FONT_SIZE = "11pt";
export const NEW_REPORT_FONT_SIZE = "11.5pt";
export const INDENT_STEP_PT = 36;

interface EmbedBlotClass {
  new (node: Node): object;
  create(value?: boolean): HTMLElement;
  blotName: string;
  tagName: string;
  className: string;
}

interface StyleAttributorClass {
  new (attrName: string, keyName: string, options: { scope: number }): object;
}

interface ParchmentModule {
  Attributor: { Style: StyleAttributorClass };
  Scope: { BLOCK: number };
}

interface DeltaOperation {
  insert?: string | object;
  attributes?: Record<string, string | boolean>;
}

interface DeltaLike {
  ops: DeltaOperation[];
}

interface DeltaClass {
  new (ops: DeltaOperation[]): DeltaLike;
}

/**
 * Quill's clipboard turns any positive text-indent into a leading "\t" when HTML is loaded. Our first-line indent
 * is a real paragraph format (RTF \fi), so drop that synthetic tab; otherwise every load/save adds a tab to the line.
 */
export const keepFirstLineIndent = (node: HTMLElement, delta: DeltaLike): DeltaLike => {
  if (!(parseFloat(node.style?.textIndent || "0") > 0)) return delta;

  const [first, ...rest] = delta.ops;
  if (!first || first.attributes || typeof first.insert !== "string" || !first.insert.startsWith("\t")) return delta;

  const Delta: DeltaClass = Quill.import("delta");
  const remainder = first.insert.substring(1);
  return new Delta(remainder.length > 0 ? [{ insert: remainder }, ...rest] : rest);
};

let isRegistered = false;

export const registerRtfFormats = (): void => {
  if (isRegistered) return;
  isRegistered = true;

  const Block = Quill.import("blots/block");
  Block.tagName = "p";
  Quill.register(Block, true);

  // No whitelist: VB reports use half-point sizes (9.5pt, 11.5pt) that must survive an edit unchanged.
  const SizeStyle = Quill.import("attributors/style/size");
  SizeStyle.whitelist = null;
  Quill.register(SizeStyle, true);

  Quill.register(Quill.import("attributors/style/align"), true);

  const Parchment: ParchmentModule = Quill.import("parchment");
  Quill.register(new Parchment.Attributor.Style("leftindent", "margin-left", { scope: Parchment.Scope.BLOCK }), true);
  Quill.register(new Parchment.Attributor.Style("firstindent", "text-indent", { scope: Parchment.Scope.BLOCK }), true);

  // RTF \line: a line break inside a paragraph (Shift+Enter). Quill's guarded embed keeps the caret usable around it.
  const Embed: EmbedBlotClass = Quill.import("blots/embed");
  class SoftBreak extends Embed {
    public static create(): HTMLElement {
      const node = super.create();
      node.appendChild(document.createElement("br"));
      return node;
    }

    public static value(): boolean {
      return true;
    }
  }
  SoftBreak.blotName = "softbreak";
  SoftBreak.tagName = "span";
  SoftBreak.className = "ql-soft-break";
  Quill.register(SoftBreak, true);
};
