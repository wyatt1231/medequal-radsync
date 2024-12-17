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

const StringUtil = {
  ReplaceNull,
  Ellipses,
};

export default StringUtil;
