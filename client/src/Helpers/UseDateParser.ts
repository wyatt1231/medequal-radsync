import moment from "moment";

export const displayMySqlDate = (
  date: string,
  replaceEmpty?: string
): string | undefined => {
  const parsedDate = new Date(date);
  if (!moment(parsedDate).isValid) {
    return replaceEmpty;
  }
  return moment(parsedDate).format("MMM. DD, YYYY");
};

export const displayMySqlDateTime = (date: string): string | null => {
  const parsedDate = new Date(date);
  if (!moment(parsedDate).isValid) {
    return null;
  }

  const parsedData = moment(parsedDate).format("MMM. DD, YYYY hh:mm A");

  if (!moment(parsedData).isValid()) {
    return "-";
  }

  return parsedData;
};

export const displayMySqlTime = (time: string): string | null => {
  // const parsedDate = new Date(date);
  // if (!moment(parsedDate).isValid) {
  //   return null;
  // }
  // const parsedData = moment(parsedDate).format("hh:mm A");
  // return parsedData;

  return moment(time, "hh:mm:ss").format("HH:mm a");
};

export const displaySex = (sex: "m" | "f") => {
  if (sex.toLocaleLowerCase() === "m") {
    return "Male";
  }
  if (sex.toLocaleLowerCase() === "f") {
    return "Female";
  }
};

export const dateParseJsToAspDate = (date: Date): any => {
  return moment(new Date(date)).format("LLLL");
};

export const InvalidTimeToDefault = (
  date: Date | null,
  defaultString: string
): string => {
  if (!date) {
    return defaultString;
  }

  const time = moment(date).format("hh:mm A");

  if (time.toLowerCase() === "invalid date") {
    return defaultString;
  }
  return time;
};

export const InvalidDateToDefault = (
  date?: string,
  defaultString?: string
): string => {
  if (!date) {
    return defaultString ?? ``;
  }

  const d = moment(date).format("MMM DD, YYYY");

  if (d.toLowerCase() === "invalid date") {
    return defaultString ?? ``;
  }
  return d;
};

export const InvalidDateTimeToDefault = (
  date?: string,
  defaultString?: string
): string => {
  if (!date) {
    return defaultString ?? ``;
  }

  const d = moment(date).format("MMM DD, YYYY hh:mm A");

  if (d.toLowerCase() === "invalid date") {
    return defaultString ?? ``;
  }
  return d;
};
