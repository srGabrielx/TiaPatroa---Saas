"use client";

import Image from "next/image";
import { useState } from "react";

interface PremiumImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function PremiumImage({ src, alt, className = "" }: PremiumImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 rounded-3xl ${className}`}>
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl" />
            )}
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-opacity duration-500 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setIsLoading(false)}
                onError={() => setHasError(true)}
            />
        </div>
    );
}