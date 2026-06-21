"use client";
import { ably } from "@/lib/ably";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const router = useRouter();
      useEffect(() => {
        const channel = ably.channels.get("geo");
    
        const handler = (message: any) => {
            console.log("Received changeData:", message.data);
            window.location.href = "/geoguesser";
        };
    
        channel.subscribe("changeData", handler);
    
        return () => {
          channel.unsubscribe("changeData", handler);
        };
      }, []);
    

    return (
        <>
            <p>Hello</p>
        </>
    )
}