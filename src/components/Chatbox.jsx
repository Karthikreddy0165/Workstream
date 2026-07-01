import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useDataContext } from "@/context/dataContext";

export default function ChatBox({ taskId }) {
  const [comments, setComments] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { userData } = useDataContext();
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const fetchComments = async () => {
    if (!taskId) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`);
      if (res.ok) {
        const json = await res.json();
        setComments(json.data || []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
    
    // Poll comments every 5 seconds for basic real-time updates
    const interval = setInterval(fetchComments, 5000);
    return () => clearInterval(interval);
  }, [taskId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !taskId || !userData?.id) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: inputMessage.trim(),
          userId: userData.id,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setComments((prev) => [...prev, json.data]);
        setInputMessage("");
      }
    } catch (err) {
      console.error("Error sending comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-2xl h-full flex flex-col overflow-hidden shadow-sm transition-all duration-200
      dark:bg-slate-900/40 dark:border-slate-800/80
      light:bg-white light:border-slate-200">
      
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-2.5
        dark:bg-slate-950/60 dark:border-slate-850
        light:bg-slate-50 light:border-slate-150">
        <MessageSquare className="text-blue-500 w-5 h-5" />
        <div>
          <h2 className="text-sm font-bold tracking-wide dark:text-slate-200 light:text-slate-800">Discussion Stream</h2>
          <p className="text-[10px] dark:text-slate-500 light:text-slate-450">Collaboration trail for this issue.</p>
        </div>
      </div>

      {/* Message Feed */}
      <div 
        ref={scrollRef}
        className="flex-grow p-4 overflow-y-auto space-y-4 max-h-[400px] min-h-[300px] custom-scrollbar"
      >
        {comments.length > 0 ? (
          comments.map((comment) => {
            const isMe = comment.userId === userData?.id;
            return (
              <div 
                key={comment.id} 
                className={`flex flex-col max-w-[85%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                {/* Username & Role label */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-450 dark:text-slate-500">
                  <span className="font-semibold dark:text-slate-350 light:text-slate-650">
                    {comment.user?.name || "Anonymous"}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold border dark:bg-slate-950 dark:border-slate-850 dark:text-slate-400 light:bg-slate-100 light:border-slate-200 light:text-slate-500">
                    {comment.user?.role || "DEVELOPER"}
                  </span>
                </div>

                {/* Comment Content bubble */}
                <div className={`p-3 rounded-xl border text-sm shadow-sm leading-relaxed ${
                  isMe 
                    ? "bg-blue-600 text-white border-blue-500 rounded-tr-none" 
                    : "dark:bg-slate-950/50 dark:border-slate-800 dark:text-slate-200 light:bg-slate-50 light:border-slate-200 light:text-slate-800 rounded-tl-none"
                }`}>
                  <p>{comment.content}</p>
                </div>

                {/* Timestamp */}
                <span className="text-[9px] text-slate-500 mt-1 px-1.5">
                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-20 text-slate-400 dark:text-slate-500">
            <MessageSquare className="w-8 h-8 mb-2 opacity-50 text-slate-400 dark:text-slate-600" />
            <p className="text-xs">No comments yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Input panel */}
      <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-slate-800/80 light:border-slate-200/80 dark:bg-slate-950/40 light:bg-slate-50/50">
        <div className="flex items-center gap-2 border rounded-xl p-1.5 transition-all
          dark:bg-slate-950 dark:border-slate-850 focus-within:ring-2 focus-within:ring-blue-500/40
          light:bg-white light:border-slate-200 focus-within:ring-1 focus-within:ring-blue-500">
          <input
            type="text"
            placeholder="Write a comment..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            className="flex-grow bg-transparent border-none py-2 px-3 text-sm focus:outline-none disabled:opacity-50
              dark:text-slate-200 dark:placeholder-slate-600
              light:text-slate-800 light:placeholder-slate-400"
          />
          <button 
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}