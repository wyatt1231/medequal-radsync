export const calculateBmi = (height: number, weight: number): string => {
  const conv_height = height / 100;

  const bmi = weight / (conv_height * conv_height);

  if (isNaN(bmi)) {
    return "";
  } else {
    return bmi.toFixed(2);
  }
};
