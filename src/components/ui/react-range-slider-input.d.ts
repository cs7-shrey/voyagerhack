declare module 'react-range-slider-input' {
    import { ComponentType } from 'react';

    export interface RangeSliderProps {
        id?: string;
        min?: number;
        max?: number;
        step?: number;
        value?: [number, number];
        defaultValue?: [number, number]
        rangeSlideDisabled?: boolean;
        onInput?: (value: [number, number]) => void;
        // Add other props you use
    }

    const RangeSlider: ComponentType<RangeSliderProps>;
    export default RangeSlider;
}