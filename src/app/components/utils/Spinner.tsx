import Image from "next/image";

interface Props {
    size?: number;
}

export default function Spinner({ size }: Props) {
    return (
        <div className="fixed left-1/2 top-1/2 z-[100] translate-x-[-50%] translate-y-[-50%]">
            <Image
                src="/spinner.svg"
                width={size ?? 128}
                height={size ?? 128}
                alt="Loading spinner"
            />
        </div>
    );
}