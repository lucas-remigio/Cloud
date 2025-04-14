"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  EmotionCategory,
  Message,
  MessageCreation,
  MessageResponse,
} from "@/app/message_types";
import { backend_url } from "@/app/connections";

export default function FeelingMessages() {
  const params = useParams();
  const feeling = params.feeling as string;
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [emotionCategory, setEmotionCategory] =
    useState<EmotionCategory | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // Retrieve the feedback message from localStorage if available
    const storedFeedback = localStorage.getItem("feedbackMessage");
    if (storedFeedback) {
      setFeedbackMessage(storedFeedback);
    }
    // Retrieve the user feeling from localStorage
    const storedFeeling = localStorage.getItem("userFeeling");
    if (storedFeeling) {
      try {
        const parsedFeeling = JSON.parse(storedFeeling);
        setEmotionCategory(parsedFeeling);
      } catch (error) {
        console.error("Error parsing stored feeling:", error);
      }
    }

    // Fetch messages based on the feeling
    fetchMessages();
  }, []);

  // Function to determine the emotion category color
  const getEmotionColor = () => {
    if (!emotionCategory) return "bg-gray-100 border-gray-500 text-gray-700";

    const category = emotionCategory.category;
    // Valid category colors: blue, yellow, red, green
    if (["blue", "yellow", "red", "green"].includes(category)) {
      return `bg-${category}-100 border-${category}-500 text-${category}-700`;
    }

    return "bg-gray-100 border-gray-500 text-gray-700";
  };

  const fetchMessages = () => {
    console.log("Fetching messages for feeling:", feeling);
    fetch(`${backend_url}/api/messages/${feeling}`, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: MessageResponse) => {
        const orderedMessages = data.messages.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        setMessages(orderedMessages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const createMessage = () => {
    setCreating(true);
    fetch(`${backend_url}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Include any additional data if required by your API:
      body: JSON.stringify({
        category: emotionCategory?.name,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: MessageCreation) => {
        setMessages([data.message, ...messages]);
        // The creation returns the created message so we can just add it to the list of messages
        setCreating(false);
        // if (
        //   socketRef.current &&
        //   socketRef.current.readyState === WebSocket.OPEN
        // ) {
        //   socketRef.current.send(JSON.stringify(data.message));
        // }
      })
      .catch((err) => {
        setError(err);
        setCreating(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className={`p-4 mb-6 rounded-lg border-l-4 ${getEmotionColor()}`}>
        <h1 className="text-2xl font-bold mb-2">
          Feeling: {decodeURIComponent(feeling)}
        </h1>
        {emotionCategory && (
          <p className="text-sm mb-2">
            Category: {emotionCategory.description}
          </p>
        )}
        {feedbackMessage && <p className="text-lg">{feedbackMessage}</p>}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>Error: {error.message}</p>
          </div>
        )}

        {/* Message generation button */}
        <div className="mb-4">
          <button
            onClick={createMessage}
            disabled={creating || loading}
            className={`w-full py-2 rounded-lg transition-colors ${
              creating || loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}>
            {creating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate New Message"
            )}
          </button>
        </div>

        {/* Message list */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <svg
                className="animate-spin h-8 w-8 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id}
                className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="font-medium">{message.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleString()}
                  </div>
                </div>
                <p className="mt-2">{message.body}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No messages yet. Generate your first message!</p>
            </div>
          )}
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
