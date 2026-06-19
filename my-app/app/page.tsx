"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

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
    <div className="p-10 space-y-6">
      {/* GET result */}
      <h1 className="text-2xl font-bold">
        GET: {getMsg}
      </h1>

      {/* POST button */}
      <button
        onClick={sendPost}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send POST
      </button>

      {/* POST result */}
      <p className="text-lg">
        POST: {postMsg}
      </p>
    </div>
  );
}