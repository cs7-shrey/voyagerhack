import { useState, useEffect } from "react";
import NumberBox from "../ui/NumberBox";
import { useTempFilterStore } from "@/store/useTempFilterStore";
import { useSearchStore } from "@/store/useSearchStore";

const UserRatingFilter = () => {
    const [isZeroSelected, setIsZeroSelected] = useState(true);
    const [isThreeSelected, setIsThreeSelected] = useState(false);
    const [isFourSelected, setIsFourSelected] = useState(false);
    const [isFourPointFiveSelected, setIsFourPointFiveSelected] = useState(false);

    const setAllFalse = () => {
        setIsZeroSelected(false);
        setIsThreeSelected(false);
        setIsFourSelected(false);
        setIsFourPointFiveSelected(false);
    };
    const { tempUserRating, setTempUserRating } = useTempFilterStore();
    useEffect(() => {
        const { userRating } = useSearchStore.getState();
        setTempUserRating(userRating);
    }, [setTempUserRating]);
    useEffect(() => {
        setAllFalse();
        switch (tempUserRating) {
            case 0:
                setIsZeroSelected(true);
                break;
            case 3:
                setIsThreeSelected(true);
                break;
            case 4:
                setIsFourSelected(true);
                break;
            case 4.5:
                setIsFourPointFiveSelected(true);
                break;
        }
    }, [tempUserRating]);
    return (
        <>
            <div className="my-2 font-bold">User Rating</div>
            <div className="flex  justify-between gap-4">
                <NumberBox text="0+" isSelected={isZeroSelected} />
                <NumberBox text="3+" isSelected={isThreeSelected} />
                <NumberBox text="4+" isSelected={isFourSelected} />
                <NumberBox text="4.5+" isSelected={isFourPointFiveSelected} />
            </div>
        </>
    )
}

export default UserRatingFilter
