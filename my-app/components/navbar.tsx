"use client"

import { useState } from "react";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-black flex flex-row w-screen h-[5vh] justify-between absolute sticky top-0 pt-2 pl-2 pb-2">
            <div>
                <img src="../favicon.ico" className="w-5 h-5"/>
            </div>
        </div>
    )
}