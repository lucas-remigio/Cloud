"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function FeelingMessages() {
  const params = useParams();
  const feeling = params.feeling as string;
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    // Retrieve the feedback message from localStorage if available
    const storedFeedback = localStorage.getItem("feedbackMessage");
    if (storedFeedback) {
      setFeedbackMessage(storedFeedback);
    }
  }, []);

  // Function to determine the emotion category color
  const getEmotionColor = () => {
    const lowerFeeling = feeling.toLowerCase();

    const lowEnergyNegative = [
      "sad",
      "lonely",
      "depressed",
      "heartbroken",
      "hopeless",
      "burned out",
    ];
    const lowEnergyUnmotivated = [
      "unmotivated",
      "procrastinating",
      "overwhelmed",
      "stuck",
      "doubtful",
      "bored",
    ];
    const highEnergyNegative = ["angry", "anxious", "stressed", "frustrated"];
    const highEnergyPositive = [
      "happy",
      "excited",
      "confident",
      "grateful",
      "inspired",
      "in love",
    ];

    if (lowEnergyNegative.some((emotion) => lowerFeeling.includes(emotion))) {
      return "bg-blue-100 border-blue-500 text-blue-700";
    } else if (
      lowEnergyUnmotivated.some((emotion) => lowerFeeling.includes(emotion))
    ) {
      return "bg-yellow-100 border-yellow-500 text-yellow-700";
    } else if (
      highEnergyNegative.some((emotion) => lowerFeeling.includes(emotion))
    ) {
      return "bg-red-100 border-red-500 text-red-700";
    } else if (
      highEnergyPositive.some((emotion) => lowerFeeling.includes(emotion))
    ) {
      return "bg-green-100 border-green-500 text-green-700";
    }

    return "bg-gray-100 border-gray-500 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className={`p-4 mb-6 rounded-lg border-l-4 ${getEmotionColor()}`}>
        <h1 className="text-2xl font-bold mb-2">
          Feeling: {decodeURIComponent(feeling)}
        </h1>
        {feedbackMessage && <p className="text-lg">{feedbackMessage}</p>}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Placeholder for chat or other interaction features */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-center text-gray-500">
            Chat functionality coming soon...
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/">
          <span className="text-indigo-600 hover:text-indigo-800 transition duration-300">
            ← Back to Home
          </span>
        </Link>

        <Link href="/messages">
          <span className="text-indigo-600 hover:text-indigo-800 transition duration-300">
            View All Message Groups
          </span>
        </Link>
      </div>
    </div>
  );
}
