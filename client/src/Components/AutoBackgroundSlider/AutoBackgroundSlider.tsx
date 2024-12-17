import clsx from "clsx";
import React, { FC, memo, useCallback, useState } from "react";
import UseInterval from "../../Hooks/UseInterval";
import {
  AutoBackgroundSlideUi,
  AutoBackgroundSliderUi,
} from "./AutoBackgroundSliderUi";
interface AutoBackgroundSliderProps {
  delay: number;
  images: Array<any>;
}

const AutoBackgroundSlider: FC<AutoBackgroundSliderProps> = memo(
  ({ images, delay, children }) => {
    const [curr_bg, set_curr_bg] = useState(0);

    const handleChange = useCallback(() => {
      set_curr_bg(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    UseInterval(handleChange, delay);

    return (
      <AutoBackgroundSliderUi>
        {images.map((imgSrc: any, index: number) => (
          <AutoBackgroundSlideUi
            src={imgSrc}
            key={index}
            // className="slides"
            className={clsx("slides", {
              active: index === curr_bg,
            })}
          >
            {children}
          </AutoBackgroundSlideUi>
        ))}
      </AutoBackgroundSliderUi>
    );
  }
);

export default AutoBackgroundSlider;
