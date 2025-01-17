// import React from 'react'
import { useTempFilterStore } from "@/store/useTempFilterStore";
import Slider from "../ui/Slider";
import "react-range-slider-input/dist/style.css";
import { formatAmount } from "@/lib/utils";
import { useEffect } from "react";
import { useSearchStore } from "@/store/useSearchStore";
const HotelPriceFilter = () => {
    const { tempMinBudget, tempMaxBudget, setTempMinBudget, setTempMaxBudget } = useTempFilterStore();
    const { minBudget, maxBudget } = useSearchStore.getState();
    const value: [number, number] = [tempMinBudget, tempMaxBudget];
    useEffect(() => {
        setTempMinBudget(minBudget);
        setTempMaxBudget(maxBudget);
    }, [minBudget, maxBudget, setTempMinBudget, setTempMaxBudget]);
    const setValue = (newValues: [number, number]) => {
        const [newMin, newMax] = newValues;
        if (newMin >= newMax) return;
        setTempMinBudget(newMin);
        setTempMaxBudget(newMax);
    };
  return (
    <>
    <div className="font-bold mt-8">Price</div>
            <div className="mt-6">
                <Slider
                    min={0}
                    max={50000}
                    step={100}
                    defaultValue={[500, 10000]}
                    value={value}
                    onInput={setValue}
                    rangeSlideDisabled={true}
                />
            </div> 
            <div className="flex justify-between text-secondary/50 text-sm mt-4">
                <div>{"₹" + formatAmount(tempMinBudget)}</div>
                <div>{"₹" + formatAmount(tempMaxBudget)}</div>
            </div>
    </>
  )
}

export default HotelPriceFilter
