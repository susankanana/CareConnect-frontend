import { useState, type FormEvent, useRef, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Send, Loader2, MessageCircle, X } from 'lucide-react';

// Define a type for a chat message
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

/**
 * The core chat interface for the AI Assistant.
 * This component handles the chat logic, message display, and user input.
 * It is designed to be used within a modal or floating container.
 */
const ChatInterface = () => {
  // State for the user's input prompt
  const [prompt, setPrompt] = useState('');

  // State for the chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // State to handle loading status
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the chat history whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handles the submission of the form.
   * Sends the user's prompt to the backend server.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    const userMessage: ChatMessage = { sender: 'user', text: prompt };
    // Optimistically add the user's message to the chat history
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    setLoading(true);
    setPrompt('');

    try {
      // Make a POST request to your backend API route
      const apiResponse = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the user's message in the request body
        body: JSON.stringify({ message: prompt }),
      });

      if (!apiResponse.ok) {
        // Handle server-side errors
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || "Failed to get a response from the backend.");
      }

      // Parse the JSON response from your backend
      const result = await apiResponse.json();
      const aiMessage: ChatMessage = { sender: 'ai', text: result.reply };
      // Add the AI's response to the chat history
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

    } catch (err) {
      console.error(err);
      
      let errorMessage = "Failed to get a response from the AI assistant. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        CareConnect <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-pink-600">AI Assistant</span>
      </h1>

      {/* Chat History Container */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-xl shadow-md ${
                msg.sender === 'user'
                  ? 'bg-teal-100 text-teal-900 rounded-br-none'
                  : 'bg-pink-100 text-pink-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm md:text-base">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] px-4 py-2 rounded-xl shadow-md bg-pink-100 text-pink-900 rounded-bl-none">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-pink-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-pink-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-pink-400 rounded-full"></div>
                </div>
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <textarea
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 resize-none min-h-[50px] text-gray-700"
          placeholder="Ask me anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={1}
        />
        <button
          type="submit"
          className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:transform-none"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 text-white" />
          ) : (
            <Send className="h-6 w-6" />
          )}
        </button>
      </form>
    </div>
  );
};

/**
 * A floating component that toggles the AI assistant chat modal.
 */
const FloatingAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Toaster position="top-right" />
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg text-white bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 z-10" // Lower z-index
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-end justify-end p-4 z-50 transition-opacity duration-300" // Higher z-index
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Container */}
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md h-[70vh] flex flex-col relative transform transition-all duration-300 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button for the modal */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-50" // Ensure the close button is on top
            >
              <X className="h-6 w-6" />
            </button>
            <ChatInterface />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAiAssistant;