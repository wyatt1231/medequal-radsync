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

function StripHtml(input: string): string {
  if (!!input) {
    return input.replace(/<[^>]*>/g, "");
  }
  return ``;
}

// const HtmlToRtf = (html: string): string => {
//   // Handle font-size conversion for inline styles (e.g., <span style="font-size: 16px;">)
//   const fontSizeRegex = /<span[^>]*style=["'][^"']*font-size:\s*(\d+)px[^"']*["'][^>]*>/gi;
//   html = html.replace(fontSizeRegex, (match, fontSizePx) => {
//     const rtfFontSize = htmlToRtfFontSize(parseInt(fontSizePx));
//     return `\\fs${rtfFontSize} `; // Apply font size RTF format
//   });

//   html = html.replace(/<strong>/g, "\\b ");
//   html = html.replace(/<\/strong>/g, "\\b0 ");

//   // Convert <i> to RTF italic syntax
//   html = html.replace(/<i>(.*?)<\/i>/g, "{\\i $1}");
//   // Convert <u> to RTF underline syntax
//   html = html.replace(/<u>(.*?)<\/u>/g, "{\\ul $1}");

//   // Convert <br> to RTF newline
//   // html = html.replace(/<br\s*\/?>/g, "\\line ");
//   //remove all br
//   html = html.replace(/<br\s*\/?>/g, "");

//   // Convert <p> to RTF paragraph break
//   html = html.replace(/<p>/g, "\\par ");
//   html = html.replace(/<\/p>/g, "");

//   html = html.replace(/&nbsp;/g, " ");

//   //remove all remaining tags
//   html = html.replace(/<\/?[^>]+>/g, "");

//   //remove first par
//   html = html.replace(/\\par/, "");

//   return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fswiss\\fprq2\\fcharset0 Verdana;}}{\\*\\generator Riched20 10.0.22621}\\viewkind4\\uc1\\pard\\f0\\fs20${html}}`;
// };

const HtmlToRtf = (html: string): string => {
  html = html.replace(/<strong>/g, "\\b ");
  html = html.replace(/<\/strong>/g, "\\b0 ");

  console.log(`html`, html);

  // Convert <i> to RTF italic syntax
  // html = html.replace(/<i>(.*?)<\/i>/g, "{\\i $1}");
  html = html.replace(/<em>(.*?)<\/em>/g, "{\\i $1}");
  // Convert <u> to RTF underline syntax
  html = html.replace(/<u>(.*?)<\/u>/g, "{\\ul $1}");

  // Convert <br> to RTF newline
  // html = html.replace(/<br\s*\/?>/g, "\\line ");
  //remove all br
  html = html.replace(/<br\s*\/?>/g, "");

  // Convert <p> to RTF paragraph break
  html = html.replace(/<p>/g, "\\par ");
  html = html.replace(/<\/p>/g, "");

  html = html.replace(/&nbsp;/g, " ");

  //remove all remaining tags
  html = html.replace(/<\/?[^>]+>/g, "");

  //remove first par
  html = html.replace(/\\par/, "");

  return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fswiss\\fprq2\\fcharset0 Verdana;}}{\\*\\generator Riched20 10.0.22621}\\viewkind4\\uc1\\pard\\f0\\fs20${html}}`;
};

// const HtmlToRtf = (html: string): string => {
//   let rtf = html;
//   rtf = rtf.replace(/<br\s*\/?>/g, "");

//   console.log(`html`, rtf);

//   // Handle font-size conversion for inline styles (e.g., <span style="font-size: 16px;">)
//   const fontSizeRegex = /<span[^>]*style=["'][^"']*font-size:\s*(\d+)px[^"']*["'][^>]*>/gi;
//   rtf = rtf.replace(fontSizeRegex, (match, fontSizePx) => {
//     const rtfFontSize = htmlToRtfFontSize(parseInt(fontSizePx));
//     return `{\\fs${rtfFontSize}}`; // Apply font size RTF format
//   });

//   // Replace <strong> with RTF bold ({\b ...})
//   rtf = rtf.replace(/<strong>/g, "{\\b ").replace(/<\/strong>/g, "}");

//   // Replace <em> with RTF italic ({\i ...}) if needed
//   rtf = rtf.replace(/<em>/g, "{\\i ").replace(/<\/em>/g, "}");

//   // Replace <u> with RTF underline ({\ul ...}) if needed
//   rtf = rtf.replace(/<u>/g, "{\\ul ").replace(/<\/u>/g, "}");

//   // Convert <p> to RTF paragraph break ({\par})
//   rtf = rtf.replace(/<p>/g, "{\\par}").replace(/<\/p>/g, "");

//   // Convert non-breaking spaces (&nbsp;) to RTF's non-breaking space ({\u160})
//   rtf = rtf.replace(/&nbsp;/g, "{\\u160}");

//   // Remove any other HTML tags
//   rtf = rtf.replace(/<\/?[^>]+(>|$)/g, "");

//   // Wrap the result in a basic RTF header and footer

//   return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fswiss\\fprq2\\fcharset0 Verdana;}}{\\*\\generator Riched20 10.0.22621}\\viewkind4\\uc1\\pard\\f0\\fs20${rtf}}`;
// };

function htmlToRtfFontSize(htmlFontSizePx) {
  // const pt = htmlFontSizePx * 0.75; // Convert px to pt (1px ≈ 0.75pt)
  // const twips = pt * 20; // Convert pt to twips (1pt = 20twips)
  // return twips;
  return htmlFontSizePx * 2;
}

function encloseTextInSpanWithFontSize(htmlString, fontSize) {
  // Create a temporary container to parse the HTML string
  const tempDiv = document.createElement("p");
  tempDiv.innerHTML = htmlString;

  // Get all <p> elements in the parsed HTML
  const paragraphs = tempDiv.getElementsByTagName("p");

  // Loop through all <p> elements
  Array.from(paragraphs).forEach((p) => {
    // Check if the <p> element already contains a <span> tag
    if (p.getElementsByTagName("span").length === 0) {
      // If no <span> is present, enclose the text in a <span> with the font-size style
      const span = document.createElement("span");
      span.setAttribute("style", `font-size: ${fontSize};`);

      // Move the text content of the <p> into the span
      span.textContent = p.textContent;

      // Replace the <p>'s content with the new span
      p.innerHTML = "";
      p.appendChild(span);
    }
  });

  // Return the modified HTML string
  return tempDiv.innerHTML;
}

const StringUtil = {
  ReplaceNull,
  Ellipses,
  StripHtml,
  HtmlToRtf,
  encloseTextInSpanWithFontSize,
};

export default StringUtil;
