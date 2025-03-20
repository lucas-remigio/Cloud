"use client";

import React, { useState, useEffect, useRef } from "react";
import { Message, MessageCreation, MessageResponse } from "./message_types";
import { backend_url, websocket_url } from "./connections";

function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [creating, setCreating] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetch(`${backend_url}/api/messages`)
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
  }, []);

  const createMessage = () => {
    setCreating(true);
    fetch(`${backend_url}/api/messages`, {
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
        return response.json();
      })
      .then((data: MessageCreation) => {
        setMessages([data.message, ...messages]);
        // The creation returns the created message so we can just add it to the list of messages
        setCreating(false);
        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(JSON.stringify(data.message));
        }
      })
      .catch((err) => {
        setError(err);
        setCreating(false);
      });
  };

  // Connect to the WebSocket server
  useEffect(() => {
    socketRef.current = new WebSocket(websocket_url);

    socketRef.current.addEventListener("open", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current.addEventListener("message", (event) => {
      try {
        // Assuming the server sends a JSON encoded message
        console.log(event);
        console.log("Received WS message: ", event.data);
        const receivedMessage: Message = JSON.parse(event.data);
        console.log("Received WS message: ", receivedMessage);
        // Update state: Add the new message if it doesn't already exist
        setMessages((prevMessages) => {
          if (prevMessages.find((m) => m._id === receivedMessage._id)) {
            return prevMessages;
          }
          return [receivedMessage, ...prevMessages];
        });
      } catch (err) {
        console.error("Error parsing WS message", err);
      }
    });

    return () => {
      socketRef.current?.close();
    };
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
    <div className="min-h-screen bg-gray-100">
      {/* Topbar with Generate Button */}
      <div className="bg-white shadow">
        <div className="max-w-3xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex justify-center">
          <button
            onClick={createMessage}
            disabled={creating}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300">
            {creating ? "Generating..." : "Generate New Message"}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
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
    </div>
  );
}

export default MessageList;
