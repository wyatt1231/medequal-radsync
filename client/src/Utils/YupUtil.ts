import * as yup from "yup";

const ValidatePassword = (label: any) => {
  const validatedUsername = yup
    .string()
    .label(label)
    .required()
    .matches(
      /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&_*]{6,25}$/,
      `${label} must be 6 to 25 characters long with numbers and/or special characters`
    );
  return validatedUsername;
};

const YupUtil = {
  ValidatePassword,
};

export default YupUtil;
