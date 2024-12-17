import moment, { Moment } from "moment";

const ReplaceDateUtil = (
  date: Date | null | string | undefined | Moment,
  replace_str: any
): any => {
  if (!date) {
    return replace_str;
  }

  const d = moment(date).format("MMM. DD, YYYY");

  if (d.toLowerCase() === "invalid date") {
    return replace_str;
  }
  return d;
};

const ReplaceTimeUtil = (
  date: Date | null | string | undefined,
  replace_str: any
): any => {
  if (!date) {
    return replace_str;
  }

  const time = moment(date).format("hh:mm A");

  if (time.toLowerCase() === "invalid date") {
    return replace_str;
  }
  return time;
};

const ReplaceDateTimeUtil = (date: any, replace_str: any): any => {
  if (!date) {
    return replace_str;
  }

  const d = moment(date).format("MMM. DD, YYYY hh:mm A");

  if (d.toLowerCase() === "invalid date") {
    return replace_str;
  }
  return d;
};

const FormatServer = (date?: any) => {
  if (!date) {
    return null;
  }
  if (moment(date).isValid()) {
    return moment(date).format();
  } else {
    return null;
  }
};

const DateUtils = {
  ReplaceDateUtil,
  ReplaceTimeUtil,
  ReplaceDateTimeUtil,
  FormatServer,
};

export default DateUtils;
