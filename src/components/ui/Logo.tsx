function LetterDiv({ letter }: { letter: string }) {
    return (
        <div className="font-bold font-mono px-1 bg-primary text-secondary rounded-sm">{letter}</div>
    );
}
const Logo = () => {
    return (
        <div className="text-xl font-bold font-mono flex gap-1 items-center">
            <LetterDiv letter="H" />
            <LetterDiv letter="A" />
            <LetterDiv letter="V" />
            <LetterDiv letter="E" />
            <LetterDiv letter="N" />
        </div>
    )
}

export default Logo;
