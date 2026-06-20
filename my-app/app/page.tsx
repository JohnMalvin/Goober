"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Link from "next/link";

export default function Page() {
  const [getMsg, setGetMsg] = useState("");
  const [postMsg, setPostMsg] = useState("");

  // ✅ GET request on load
  useEffect(() => {
    apiRequest("/api/try")
      .then((res) => {
        if (res.ok) {
          setGetMsg(res.data.message);
        } else {
          setGetMsg(res.error);
        }
      });
  }, []);

  // ✅ POST request on button click
  const sendPost = async () => {
    const res = await apiRequest(
      "/api/try",
      "POST",
      {
        name: "John",
        age: 22,
      }
    );

    if (res.ok) {
      setPostMsg(
        res.data.message + " | " + JSON.stringify(res.data.received)
      );
    } else {
      setPostMsg(res.error);
    }
  };

  return (
    <div className="min-h-screen w-[30vw] flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500">
        <div className="bg-white p-10 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Goober!</h1>
        <div className="flex flex-row justify-between">
          <div/>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
          <div/>
        </div>
      </div>
    </div>
  );
}