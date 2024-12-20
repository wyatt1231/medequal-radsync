const ReplaceNull = (originalString: string | undefined, defaultString: any): any => {
  if (!originalString) {
    return defaultString;
  }
  if (typeof originalString === "undefined") {
    return defaultString;
  } else {
    if (!originalString) {
      return "";
    } else {
      return originalString.toString().trim() === "" ? defaultString : originalString;
    }
  }
};

const Ellipses = (str: string | undefined, char_len: number, alt: string): any => {
  if (!str) {
    return alt;
  }

  if (str.length <= char_len) {
    return str;
  }

  return `${str.slice(0, char_len)}...`;
};

function StripHtml(text: string): string {
  if (!!text) {
    text = text.replace(/<[^>]*>/g, "");
    text = text.replace(/&nbsp;/g, " ");

    return text;
  }
  return ``;
}

const GetFontSize = (html: string): string => {
  // Create a temporary DOM element to parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Query for the first element with an inline style containing font-size
  const elementWithFontSize: any = doc.querySelector('[style*="font-size"]');

  if (elementWithFontSize) {
    // Get the inline style and extract the font-size value
    const fontSize: string = elementWithFontSize.style.fontSize;

    return parseInt(fontSize.replaceAll(`pt`, "")) * 2 + ``;
  } else {
    return `22`;
  }
};

function removeSpanAndFontStyle(htmlString) {
  // Create a temporary DOM element to parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Remove font styles from all elements
  const allElements = doc.querySelectorAll("*");
  allElements.forEach((element) => {
    element.removeAttribute("style"); // Removes the inline style attribute completely
  });

  return doc.body.innerHTML;
}

const HtmlToRtf = (html: string): string => {
  const font_size = GetFontSize(html);

  let rtf = removeSpanAndFontStyle(html);

  rtf = rtf.replace(/<strong>/g, "\\b ");
  rtf = rtf.replace(/<\/strong>/g, "\\b0 ");

  // Convert <i> to RTF italic syntax
  rtf = rtf.replace(/<em>(.*?)<\/em>/g, "{\\i $1}");

  // Convert <u> to RTF underline syntax
  rtf = rtf.replace(/<u>(.*?)<\/u>/g, "{\\ul $1}");

  //remove all br
  rtf = rtf.replace(/<br\s*\/?>/g, "");

  // Convert <p> to RTF paragraph break
  rtf = rtf.replace(/<p>/g, "\\par ");
  rtf = rtf.replace(/<\/p>/g, "");

  rtf = rtf.replace(/&nbsp;/g, " ");

  //remove all remaining tags
  rtf = rtf.replace(/<\/?[^>]+>/g, "");

  //remove first par
  rtf = rtf.replace(/\\par/, "");

  return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fswiss\\fprq2\\fcharset0 Arial;}}{\\*\\generator Riched20 10.0.22621}\\viewkind4\\uc1\\pard\\f0\\fs${font_size}${rtf}}`;
};

const StringUtil = {
  ReplaceNull,
  Ellipses,
  StripHtml,
  HtmlToRtf,
};

export default StringUtil;
