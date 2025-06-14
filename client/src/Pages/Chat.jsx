import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { socket } from "../utils/socket";
import {
  FaSpinner,
  FaRegCommentDots,
  FaUserCircle,
  FaPaperPlane,
  FaArrowLeft,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";

dayjs.extend(relativeTime);

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const areEqual = (prev, next) => {
  if (prev === next) return true;
  if (!prev || !next) return false;
  if (Array.isArray(prev) && Array.isArray(next)) {
    return prev.length === next.length && prev.every((item, i) => areEqual(item, next[i]));
  }
  if (typeof prev === "object" && typeof next === "object") {
    const prevKeys = Object.keys(prev).sort();
    const nextKeys = Object.keys(next).sort();
    return areEqual(prevKeys, nextKeys) && prevKeys.every((key) => areEqual(prev[key], next[key]));
  }
  return prev === next;
};

const SharedPostDisplay = React.memo(({ sharedPost, currentUser }) => {
  if (!sharedPost) return null;

  const originalAuthor = sharedPost.user;
  const sharedBy = sharedPost.sharedBy || currentUser;

  return (
    <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm">Shared by:</span>
          <div className="flex items-center">
            {sharedBy.profileImage ? (
              <img
                src={sharedBy.profileImage}
                alt={sharedBy.fullName}
                className="w-5 h-5 rounded-full mr-1"
              />
            ) : (
              <FaUserCircle className="text-slate-400 mr-1" />
            )}
            <span className="text-slate-200 text-sm font-medium">
              {sharedBy.fullName}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm">Original author:</span>
          <div className="flex items-center">
            {originalAuthor.profileImage ? (
              <img
                src={originalAuthor.profileImage}
                alt={originalAuthor.fullName}
                className="w-5 h-5 rounded-full mr-1"
              />
            ) : (
              <FaUserCircle className="text-slate-400 mr-1" />
            )}
            <span className="text-slate-200 text-sm font-medium">
              {originalAuthor.fullName}
            </span>
          </div>
        </div>
      </div>
      
      {sharedPost.text && (
        <p className="text-slate-100 mb-3 whitespace-pre-line">{sharedPost.text}</p>
      )}
      
      {sharedPost.image && (
        <div className="mt-3">
          <img 
            src={sharedPost.image} 
            alt="Shared post" 
            className="max-w-full max-h-64 rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
});

const MessageList = React.memo(({ messages, userId }) => {
  console.log("MessageList rendered");
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message._id || Math.random()}
          className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[75%] p-3 rounded-lg shadow-md relative ${
              message.senderId === userId
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-slate-700 text-slate-100 rounded-bl-none"
            }`}
          >
            <p className="break-words">{message.content}</p>
            <span className="block text-right text-xs mt-1 opacity-70">
              {dayjs(message.createdAt).format("h:mm A")}
            </span>
            {message.senderId === userId && (
              <div className="absolute bottom-1 right-1 -mr-3 text-xs text-blue-200">
                {message.isRead ? <FaCheckDouble /> : <FaCheck />}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

const ChatList = React.memo(({ chats, onSelectChat, selectedChatId, user, isLoadingChats, chatsError }) => {
  console.log("ChatList rendered");
  const getOtherParticipant = useCallback(
    (chat) => chat?.participants?.find((p) => p._id !== user?._id) || null,
    [user]
  );

  return (
    <div className={`md:w-1/3 w-full bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 shadow-xl flex flex-col ${selectedChatId && "hidden md:flex"}`}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center md:text-left">Chats</h2>
      {chatsError && (
        <div className="bg-red-500/20 text-red-400 p-4 rounded-xl text-sm border border-red-500/30 mb-6">
          {chatsError}
        </div>
      )}
      {isLoadingChats ? (
        <div className="flex justify-center items-center h-full">
          <FaSpinner className="w-10 h-10 text-cyan-400 animate-spin" />
        </div>
      ) : chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
          <FaRegCommentDots className="text-5xl mb-4" />
          <p className="mb-4">You haven't messaged anyone yet — start chatting with fellow developers!</p>
          <Link
            to="/all-users"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/25"
          >
            Find Users
          </Link>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {chats.map((chat) => {
            const otherParticipant = getOtherParticipant(chat);
            const lastMessagePreview = chat.lastMessage?.content
              ? `${chat.lastMessage.senderId === user?._id ? "You: " : ""}${chat.lastMessage.content.substring(0, 30)}${chat.lastMessage.content.length > 30 ? "..." : ""}`
              : "No messages yet";

            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={`flex items-center p-4 rounded-xl mb-3 cursor-pointer border transition-colors duration-200 ${
                  selectedChatId === chat._id
                    ? "bg-slate-700/70 border-cyan-500 shadow-lg"
                    : "bg-slate-700/30 border-slate-700/50 hover:bg-slate-700/50"
                }`}
              >
                {otherParticipant?.profileImage ? (
                  <img
                    src={otherParticipant.profileImage}
                    alt={otherParticipant.fullName || "User"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/48x48/64748b/ffffff?text=${otherParticipant.fullName?.[0] || "?"}`;
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                    <FaUserCircle className="text-white text-lg" />
                  </div>
                )}
                <div className="ml-4 flex-1">
                  <p className="text-white font-semibold">{otherParticipant?.fullName || "Unknown User"}</p>
                  <p className="text-slate-400 text-sm truncate">{lastMessagePreview}</p>
                </div>
                <div className="text-slate-400 text-xs ml-auto flex-shrink-0">
                  {chat.lastMessage?.createdAt && dayjs(chat.lastMessage.createdAt).fromNow()}
                </div>
                {chat.unread > 0 && (
                  <span className="ml-3 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

const ChatWindow = React.memo(
  ({ selectedChat, messages, user, onSendMessage, newMessage, setNewMessage, isLoadingMessages, messagesError, typingUsers, messagesEndRef, sharedPost }) => {
    console.log("ChatWindow rendered");
    const navigate = useNavigate();
    const selectedChatId = selectedChat?._id;
    const getOtherParticipant = useCallback(
      (chat) => chat?.participants?.find((p) => p._id !== user?._id) || null,
      [user]
    );
    
    const otherParticipant = getOtherParticipant(selectedChat);

    const handleMessageChange = useCallback(
      (e) => {
        setNewMessage(e.target.value);
        if (selectedChatId && user?._id) {
          socket.emit("typing", {
            chatId: selectedChatId,
            userId: user._id,
            isTyping: e.target.value.length > 0,
          });
        }
      },
      [selectedChatId, user?._id, setNewMessage]
    );

    const handleMessage = useCallback(() => {
      if (newMessage.trim()) {
        onSendMessage({ preventDefault: () => {} });
      }
    }, [newMessage, onSendMessage]);

    return (
      <div className={`w-full ${selectedChat ? 'md:w-2/3' : ''} bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 shadow-xl flex flex-col h-[calc(100vh-10rem)] md:h-auto`}>
        {selectedChat ? (
          <>
            <div className="flex items-center p-4 border-b border-slate-700 bg-slate-700/60 rounded-t-xl">
              <button 
                onClick={() => navigate('/chat')}
                className="text-white mr-4 p-2 rounded-full hover:bg-slate-600 md:hidden"
                title="Back to Chats"
              >
                <FaArrowLeft size={20} />
              </button>
              {otherParticipant?.profileImage ? (
                <img
                  src={otherParticipant.profileImage}
                  alt={otherParticipant.fullName || "User"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/40x40/64748b/ffffff?text=${otherParticipant?.fullName?.[0] || '?'}`;
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                  <FaUserCircle className="text-white text-lg" />
                </div>
              )}
              <h2 className="text-xl font-semibold text-white ml-3">
                {otherParticipant?.fullName || "Unknown User"}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <FaSpinner className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : messagesError ? (
                <div className="text-red-400 text-center">{messagesError}</div>
              ) : messages.length === 0 ? (
                <div className="text-slate-400 text-center py-10">
                  <SharedPostDisplay sharedPost={sharedPost} currentUser={user} />
                  Start the conversation 👋
                </div>
              ) : (
                <>
                  <SharedPostDisplay sharedPost={sharedPost} currentUser={user} />
                  <MessageList messages={messages} userId={user._id} />
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            {typingUsers[selectedChatId] && Object.entries(typingUsers[selectedChatId] || {}).some(([id, isTyping]) => isTyping && id !== user?._id) && (
              <p className="text-slate-400 text-sm text-center mb-2">
                {otherParticipant?.fullName || "Someone"} is typing...
              </p>
            )}
            <div className="p-4 border-t border-slate-700 bg-slate-700/60 rounded-b-xl">
              <div className="flex items-center space-x-3">
                <textarea
                  value={newMessage}
                  onChange={handleMessageChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleMessage();
                    }
                  }}
                  className="flex-1 p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none h-12 overflow-hidden"
                  placeholder="Type your message..."
                  rows="1"
                />
                <button
                  onClick={handleMessage}
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md"
                  title="Send Message"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <FaRegCommentDots className="text-6xl mb-6 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">Select a chat to start messaging</h3>
            <p className="mb-4">Or find a user to initiate a new conversation.</p>
            <Link
              to="/all-users"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/25"
            >
              Find Users
            </Link>
          </div>
        )}
      </div>
    );
  }
);

const Chat = () => {
  console.log("Chat rendered");
  const { token, loading: authLoading, getChats, getChatMessages: getMessages, user, sendChatMessage } = useAuth();
  const navigate = useNavigate();
  const { chatId: urlChatId } = useParams();
  const location = useLocation();
  const chatFromState = location.state?.chat;
  const [sharedPost, setSharedPost] = useState(null);

  const [chats, setChats] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [chatsError, setChatsError] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState({});

  const messagesEndRef = useRef(null);
  const prevChatIdRef = useRef(null);
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`Chat render count: ${renderCountRef.current}`);
  });

  useEffect(() => {
    if (location.state?.sharedPost) {
      setSharedPost(location.state.sharedPost);
    }
  }, [location.state]);

  const selectedChat = useMemo(() => {
    if (chatFromState) return chatFromState;
    if (urlChatId) return chats.find((chat) => chat._id === urlChatId) || null;
    return null;
  }, [chatFromState, urlChatId, chats]);

  useEffect(() => {
    if (!authLoading && !token) {
      navigate("/login");
      toast.info("Please log in to access messages");
    }
  }, [token, authLoading, navigate]);

  const fetchAllChats = useCallback(async () => {
    if (!token || authLoading) return;
    setIsLoadingChats(true);
    setChatsError("");

    try {
      const result = await getChats();
      if (result.success && Array.isArray(result.chats)) {
        setChats((prev) => {
          if (!areEqual(prev, result.chats)) {
            console.log("Updating chats state");
            localStorage.setItem("cachedChats", JSON.stringify(result.chats));
            return result.chats;
          }
          console.log("Skipping chats update: equal");
          return prev;
        });
      } else {
        setChatsError(result?.message || "Failed to load chats.");
        toast.error("Failed to load chats.");
      }
    } catch (err) {
      setChatsError(err.message || "Failed to load chats");
      toast.error("Failed to load chats.");
    } finally {
      setIsLoadingChats(false);
    }
  }, [authLoading, token, getChats]);

  useEffect(() => {
    const cachedChats = JSON.parse(localStorage.getItem("cachedChats") || "[]");
    if (cachedChats.length) {
      setChats((prev) => {
        if (!areEqual(prev, cachedChats)) {
          console.log("Setting cached chats");
          return cachedChats;
        }
        console.log("Skipping cached chats: equal");
        return prev;
      });
      setIsLoadingChats(false);
    }
    fetchAllChats();
  }, [fetchAllChats]);

  // Fetch messages on mount or chat change
  useEffect(() => {
    const selectedChatId = selectedChat?._id || urlChatId;
    if (!selectedChatId || !token || !user) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const result = await getMessages(selectedChatId);
        if (result.success && Array.isArray(result.messages)) {
          setMessages((prev) => {
            if (!areEqual(prev, result.messages)) {
              console.log("Updating messages state with:", result.messages);
              return result.messages;
            }
            console.log("Skipping messages update: equal");
            return prev;
          });
        } else {
          setMessagesError(result?.message || "Failed to load messages");
          toast.error("Failed to load messages.");
        }
      } catch (err) {
        setMessagesError(err.message || "Failed to load messages");
        toast.error("Failed to load messages.");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
    prevChatIdRef.current = selectedChatId;
  }, [selectedChat, urlChatId, token, user, getMessages]);

  useEffect(() => {
    const selectedChatId = selectedChat?._id || urlChatId;
    if (!selectedChatId) return;

    const prevChatId = prevChatIdRef.current;
    if (prevChatId && prevChatId !== selectedChatId) {
      socket.emit("leave_chat", prevChatId);
      console.log(`Left chat room: ${prevChatId}`);
    }

    socket.emit("join_chat", selectedChatId);
    console.log(`Joined chat room: ${selectedChatId}`);

    return () => {
      socket.emit("leave_chat", selectedChatId);
      console.log(`Cleanup left chat: ${selectedChatId}`);
    };
  }, [selectedChat, urlChatId]);

  useEffect(() => {
    const selectedChatId = selectedChat?._id || urlChatId;
    if (!selectedChatId) return;

    const handleNewMessage = (message) => {
      console.log("Received message event:", message);
      if (message.chatId === selectedChatId) {
        setMessages((prev) => {
          if (!prev.some((msg) => msg._id && msg._id === message._id)) {
            console.log("Adding new message:", message);
            if (message.senderId !== user?._id) {
              socket.emit("read_message", { chatId: message.chatId, messageId: message._id });
            }
            return [...prev, { ...message, _id: message._id || Date.now().toString() }];
          }
          console.log("Skipping duplicate message:", message);
          return prev;
        });
      }
    };

    const debouncedHandleTyping = debounce(({ userId: typingUserId, chatId, isTyping }) => {
      if (chatId === selectedChatId && typingUserId !== user?._id) {
        console.log(`Typing event: ${typingUserId} isTyping=${isTyping}`);
        setTypingUsers((prev) => {
          const newTyping = {
            ...(prev[chatId] || {}),
            [typingUserId]: isTyping,
          };
          if (areEqual(prev[chatId], newTyping)) {
            console.log("Skipping typingUsers update: equal");
            return prev;
          }
          console.log("Updating typingUsers state");
          return { ...prev, [chatId]: newTyping };
        });
      }
    }, 300);

    const handleMessageRead = ({ chatId, messageId, readerId }) => {
      if (chatId === selectedChatId && readerId !== user?._id) {
        setMessages((prev) => {
          const newMessages = prev.map((msg) =>
            msg._id === messageId && msg.senderId === user?._id ? { ...msg, isRead: true } : msg
          );
          if (areEqual(prev, newMessages)) {
            console.log("Skipping messages update for read: equal");
            return prev;
          }
          console.log("Updating messages for read");
          return newMessages;
        });
      }
    };

    socket.on("message", handleNewMessage);
    socket.on("typing", debouncedHandleTyping);
    socket.on("read_message", handleMessageRead);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("typing", debouncedHandleTyping);
      socket.off("read_message", handleMessageRead);
    };
  }, [selectedChat, urlChatId, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMessage.trim() || !selectedChat?._id || !user?._id) {
        toast.warn("Message cannot be empty or chat not selected.");
        return;
      }

      const messagePayload = {
        chatId: selectedChat._id,
        senderId: user._id,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      try {
        const result = await sendChatMessage(selectedChat._id, messagePayload);
        if (result.success) {
          console.log("Message sent successfully, result:", result);
          setNewMessage("");
          socket.emit("typing", { chatId: selectedChat._id, userId: user._id, isTyping: false });
          toast.success("Message sent successfully!");
        } else {
          toast.error(`Failed to send message: ${result.message}`);
        }
      } catch (err) {
        console.error("Error sending message:", err);
        toast.error("Failed to send message. Please try again.");
      }
    },
    [newMessage, selectedChat, user?._id, sendChatMessage]
  );

  const handleSelectChat = useCallback(
    (chat) => {
      if (!areEqual(selectedChat, chat)) {
        console.log(`Selecting chat: ${chat._id}`);
        navigate(`/chat/${chat._id}`, { state: { chat } });
        if (chat._id && user?._id) {
          socket.emit("read_message", { chatId: chat._id });
        }
      }
    },
    [navigate, user?._id, selectedChat]
  );

  const debouncedSelectChat = useMemo(() => debounce(handleSelectChat, 300), [handleSelectChat]);

  if (authLoading || isLoadingChats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <FaSpinner className="w-10 h-10 text-cyan-400 animate-spin" />
        <p className="ml-4 text-white">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row">
      <div className="md:hidden relative overflow-hidden mb-8 rounded-xl shadow-lg w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-3xl"></div>
        <div className="relative text-center py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-slate-300 mt-2">Connect with your network</p>
        </div>
      </div>
      <div className="flex w-full md:space-x-6 h-[calc(100vh-10rem)]">
        <ChatList
          chats={chats}
          onSelectChat={debouncedSelectChat}
          selectedChatId={selectedChat?._id}
          user={user}
          isLoadingChats={isLoadingChats}
          chatsError={chatsError}
        />
        <ChatWindow
          selectedChat={selectedChat}
          messages={messages}
          user={user}
          onSendMessage={handleSendMessage}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          isLoadingMessages={isLoadingMessages}
          messagesError={messagesError}
          typingUsers={typingUsers}
          messagesEndRef={messagesEndRef}
          sharedPost={sharedPost}
        />
      </div>
    </div>
  );
};

export default Chat;