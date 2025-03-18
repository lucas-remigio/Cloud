"use client";

import React, { useState, useEffect } from "react";

interface Message {
  _id: string;
  title: string;
  body: string;
}

function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your daily dose of inspiration and motivation.
          </p>
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
