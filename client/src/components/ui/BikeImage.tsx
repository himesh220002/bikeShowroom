"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

import { cleanImageUrl } from "@/lib/utils/url";

interface BikeImageProps extends Omit<ImageProps, "src" | "onError"> {
    src: string;
    fallbackSrc?: string;
}

export function BikeImage({ src, fallbackSrc, className, alt, ...props }: BikeImageProps) {
    const [imgSrc, setImgSrc] = useState(cleanImageUrl(src));
    const [hasError, setHasError] = useState(false);

    // Update state when src prop changes
    useEffect(() => {
        setImgSrc(cleanImageUrl(src));
        setHasError(false);
    }, [src]);

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
