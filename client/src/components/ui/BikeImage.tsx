"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface BikeImageProps extends Omit<ImageProps, "src" | "onError"> {
    src: string;
    fallbackSrc?: string;
}

export function BikeImage({ src, fallbackSrc, className, alt, ...props }: BikeImageProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError && fallbackSrc) {
            setImgSrc(fallbackSrc);
            setHasError(true);
        }
    };

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            onError={handleError}
            className={cn(className)}
        />
    );
}
