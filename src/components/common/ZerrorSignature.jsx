// components/ZerrorSignature.tsx

"use client";

import { zerrorSignature } from "@/lib/signature";
import { useEffect } from "react";

export default function ZerrorSignature() {
    useEffect(() => {
        zerrorSignature();
    }, []);

    return null;
}