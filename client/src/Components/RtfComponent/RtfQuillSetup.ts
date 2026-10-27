import { Quill } from "react-quill";

// Formats the editor round-trips with the legacy VB.NET RichTextBox RTF (see api/Utils/Rtf). Each one maps to an
// inline style or blot the API's EditorHtmlReader understands; anything else the editor would drop on save.
export const RTF_FORMATS = ["bold", "italic", "underline", "size", "align", "leftindent", "firstindent", "softbreak", "mark"];

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
  Attributor: { Style: StyleAttributorClass; Attribute: StyleAttributorClass };
  Scope: { BLOCK: number };
}

/** Character format of a blank line's paragraph mark, carried as data-mark="b i ul fs23" (see api EditorHtmlReader). */
export interface MarkFormat {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  size: string;
}

export const parseMark = (value: string): MarkFormat | null => {
  const tokens = (value || "").split(" ");
  const fontSize = tokens.map((t) => /^fs(\d+)$/.exec(t)).find((m) => m !== null);
  if (!fontSize) return null;
  return {
    bold: tokens.includes("b"),
    italic: tokens.includes("i"),
    underline: tokens.includes("ul"),
    size: `${parseInt(fontSize[1], 10) / 2}pt`,
  };
};

interface DeltaOperation {
  insert?: string | object;
  attributes?: Record<string, string | boolean>;
}

interface DeltaLike {
  ops: DeltaOperation[];
  length(): number;
  compose(other: DeltaLike): DeltaLike;
  retain(length: number, attributes?: Record<string, string | boolean>): DeltaLike;
}

interface DeltaClass {
  new (ops?: DeltaOperation[]): DeltaLike;
}

const POINTS_PER_UNIT: Record<string, number> = { pt: 1, px: 0.75, in: 72, cm: 72 / 2.54, mm: 72 / 25.4 };
const BLOCK_TAGS = ["P", "DIV", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE"];

const toPoints = (css: string): number => {
  const match = /^(-?[\d.]+)(pt|px|in|cm|mm)?$/.exec((css || "").trim());
  if (!match) return 0;
  return Math.round(parseFloat(match[1]) * POINTS_PER_UNIT[match[2] ?? "px"] * 100) / 100;
};

/** The RichTextBox never draws a first line left of the page margin, so a hanging indent stops at the margin. */
export const clampFirstIndent = (leftPoints: number, firstPoints: number): number => Math.max(firstPoints, -leftPoints);

/**
 * Quill's clipboard only keeps a style it finds under its exact name, but Chrome copies a paragraph's left indent as
 * the "margin" shorthand. Read the resolved margin-left / text-indent of each pasted paragraph so a report copied
 * from another study keeps its indents (and hanging "-<tab>" lines keep their dash on screen).
 */
export const keepParagraphIndents = (node: HTMLElement, delta: DeltaLike): DeltaLike => {
  if (!BLOCK_TAGS.includes(node.tagName) || !node.style) return delta;

  const left = Math.max(0, toPoints(node.style.marginLeft));
  const first = clampFirstIndent(left, toPoints(node.style.textIndent));
  if (left === 0 && first === 0) return delta;

  const Delta: DeltaClass = Quill.import("delta");
  return delta.compose(
    new Delta().retain(delta.length(), {
      leftindent: left > 0 ? `${left}pt` : false,
      firstindent: first !== 0 ? `${first}pt` : false,
    })
  );
};

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
  Quill.register(new Parchment.Attributor.Attribute("mark", "data-mark", { scope: Parchment.Scope.BLOCK }), true);

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
