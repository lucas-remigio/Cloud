"use client";

import React, { useState, useEffect } from "react";
import { Message, MessageCreation } from "./message_types";

function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/messages")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMessages(data.messages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const createMessage = () => {
    setCreating(true);
    fetch("http://localhost:3000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Include any additional data if required by your API:
      body: JSON.stringify({
        /* add message data here if needed */
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response);
        return response.json();
      })
      .then((data: MessageCreation) => {
        console.log(data);
        setMessages([...messages, data.message]);
        // The creation returns the created message so we can just add it to the list of messages
        setCreating(false);
      })
      .catch((err) => {
        setError(err);
        setCreating(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">
          Loading messages...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-red-500">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
            <p className="mt-2 text-lg text-gray-600">
              Your daily dose of inspiration and motivation.
            </p>
          </div>
          <button
            onClick={createMessage}
            disabled={creating}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300">
            {creating ? "Generating..." : "Generate New Message"}
          </button>
        </div>
        <ul className="space-y-6">
          {messages.map((message) => (
            <li
              key={message._id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-indigo-600">
                {message.title}
              </h2>
              <p className="mt-3 text-gray-700">{message.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MessageList;
