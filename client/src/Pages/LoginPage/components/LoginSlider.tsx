import React, { FC, memo } from "react";
import AutoBackgroundSlider from "../../../Components/AutoBackgroundSlider/AutoBackgroundSlider";
import { GetFolderImages } from "../../../Utils/ImgUtil";

interface LoginSliderProps {}

const LoginSlider: FC<LoginSliderProps> = memo(() => {
  const images: Array<any> = GetFolderImages(
    require.context(
      "../../../assets/wallpapers/",
      true,
      /\.(png|jpg|jpe?g|svg|gif)$/
    )
  );
  return (
    <>
      <AutoBackgroundSlider images={images} delay={5000} />
    </>
  );
});

export default LoginSlider;
