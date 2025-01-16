import RangeSlider from 'react-range-slider-input';
import React from 'react';
import "./index.css"

import { type RangeSliderProps } from 'react-range-slider-input';

const Slider: React.FC<RangeSliderProps> = (props) => {
  return (
    // TODO: optimize the data fetching that is currently happening on each value change of the slider
    <RangeSlider id="slider" {...props} />
  )
}

export default Slider
