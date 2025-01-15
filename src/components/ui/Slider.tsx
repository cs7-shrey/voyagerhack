import RangeSlider from 'react-range-slider-input';
import React from 'react';
import "./index.css"

import { type RangeSliderProps } from 'react-range-slider-input';

const Slider: React.FC<RangeSliderProps> = (props) => {
  return (
    <RangeSlider id="slider" {...props} />
  )
}

export default Slider
