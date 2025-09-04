import { cn } from "@/lib/utils";

type BackdropImageProps = {
    className?: string | "";
}
export default function BackdropImage({
    className = ""
}: BackdropImageProps) {
    return(
        <>
         {/* Color overlay (top 50%) with fading to transparent */}
         <div className={cn("h-full absolute inset-x-0 top-0 from-black/10 to-black/90 pointer-events-none z-10", "gradient-to-t")}/>
         {/* Blur overlay (top 50%) with gradient mask to decrease blur towards bottom */}
         <div
            className="z-10 absolute inset-x-0 top-0 pointer-events-none backdrop-blur-md"
            style={{
                height: "50%",
                WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            }}
            />
        </>
    )
}