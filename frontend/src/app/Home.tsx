"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoodResponse } from "./message_types";

const Home: React.FC = () => {
  const [feelings, setFeelings] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeelings(event.target.value);
  };

  const handleSubmit = async () => {
    console.log("User's feelings:", feelings);

    if (!feelings.trim()) {
      setFeedback("Please describe how you're feeling.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/moods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feeling: feelings }),
      });

      setIsLoading(false);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: MoodResponse = await response.json();
      console.log(data);

      setFeedback(data.feedback_message);

      // Store the mood data in localStorage for use in the chat room
      localStorage.setItem("userFeeling", JSON.stringify(data.category));
      localStorage.setItem("feedbackMessage", data.feedback_message);

      const feeling = data.category.name.toLowerCase();

      // Redirect to the specific feeling lobby
      router.push(`/messages/${encodeURIComponent(feeling)}`);
    } catch (error) {
      console.error("Error:", error);
      setFeedback(
        "There was an error processing your request. Please try again."
      );
    }

    setFeelings("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome!</h1>
      <p className="text-lg text-gray-600 mb-8">How are you feeling today?</p>
      <textarea
        value={feelings}
        onChange={handleInputChange}
        rows={4}
        className="w-full text-gray-900 max-w-md p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
        placeholder="Describe your feelings..."
      />
      <button
        disabled={isLoading}
        onClick={handleSubmit}
        className="w-full max-w-md px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300">
        {isLoading ? "Loading..." : "Submit"}
      </button>

      {feedback && <p className="mt-4 text-green-600">{feedback}</p>}

      <div className="mt-4">
        <Link href="/messages">
          <p className="text-blue-500 hover:underline">Go to Messages List</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
