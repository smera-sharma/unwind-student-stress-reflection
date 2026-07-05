import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { MessageSquare, Send, Trash2, Edit3, Plus, Search, Download, Sparkles, Check, X } from 'lucide-react';

const Luna = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingConvId, setEditingConvId] = useState(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  const messagesEndRef = useRef(null);
  const chatKey = user ? `unwind_chats_${user.email}` : 'unwind_chats_guest';

  // 1. Initial Load of Chat Histories
  useEffect(() => {
    const saved = localStorage.getItem(chatKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveConvId(parsed[0].id);
        }
      } catch (e) {
        console.error("Could not parse conversation history:", e);
      }
    }
  }, [chatKey]);

  // 2. Helper: Sync to LocalStorage
  const syncConversations = (updated) => {
    setConversations(updated);
    localStorage.setItem(chatKey, JSON.stringify(updated));
  };

  // Find active conversation object
  const activeConv = conversations.find(c => c.id === activeConvId);

  // Auto-scroll to bottom ref
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isLoading]);

  // Title generation logic
  const generateTitle = (text) => {
    if (!text) return 'New Conversation';
    const words = text.split(/\s+/).slice(0, 4).join(' ');
    const clean = words.replace(/[^\w\s]/g, '').trim();
    return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'New Conversation';
  };

  // Extract memory logs
  const getReflectionMemory = () => {
    try {
      const historySaved = localStorage.getItem('reflectionHistory');
      if (historySaved) {
        const historyList = JSON.parse(historySaved);
        return historyList.slice(0, 3).map(log => `${log.date}: Mood ${log.mood} - ${log.text}`);
      }
    } catch (e) {
      console.warn("Could not read reflection logs for AI memory:", e);
    }
    return [];
  };

  // Start new conversation
  const handleStartNewConversation = () => {
    const newConv = {
      id: `conv_${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: []
    };
    const updated = [newConv, ...conversations];
    syncConversations(updated);
    setActiveConvId(newConv.id);
  };

  // Rename Title
  const handleStartRename = (conv, e) => {
    e.stopPropagation();
    setEditingConvId(conv.id);
    setEditTitleInput(conv.title);
  };

  const handleSaveRename = (convId) => {
    const updated = conversations.map(c => {
      if (c.id === convId) {
        return { ...c, title: editTitleInput.trim() || c.title };
      }
      return c;
    });
    syncConversations(updated);
    setEditingConvId(null);
  };

  // Delete Conversation
  const handleDeleteConversation = (convId, e) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== convId);
    syncConversations(updated);
    if (activeConvId === convId) {
      setActiveConvId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || inputMessage;
    if (!messageText.trim()) return;

    let targetConv = activeConv;
    let updatedConvs = [...conversations];

    // If no active conversation exists, create one immediately
    if (!targetConv) {
      targetConv = {
        id: `conv_${Date.now()}`,
        title: generateTitle(messageText),
        createdAt: new Date().toISOString(),
        messages: []
      };
      updatedConvs = [targetConv, ...updatedConvs];
    }

    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    const nextMessages = [...targetConv.messages, userMessage];

    // Auto-title updates on first message
    const nextTitle = targetConv.messages.length === 0 ? generateTitle(messageText) : targetConv.title;

    let updatedConv = {
      ...targetConv,
      title: nextTitle,
      messages: nextMessages
    };

    updatedConvs = updatedConvs.map(c => (c.id === updatedConv.id ? updatedConv : c));
    syncConversations(updatedConvs);
    setActiveConvId(updatedConv.id);
    setInputMessage('');
    setIsLoading(true);

    try {
      const todayMood = localStorage.getItem('todayMood') || 'Neutral';
      const recentMemory = getReflectionMemory();

      // Backend conversation API query
      const response = await api.post('/ai/chat', {
        messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
        mood: todayMood,
        memory: recentMemory
      });

      const companionMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'model',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      updatedConv = {
        ...updatedConv,
        messages: [...nextMessages, companionMessage]
      };

      const finalConvs = updatedConvs.map(c => (c.id === updatedConv.id ? updatedConv : c));
      syncConversations(finalConvs);
    } catch (e) {
      console.error("AI Chat connection error:", e);
      // Fallback local mock companion message
      const companionMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'model',
        content: "I'm having trouble connecting to Luna online right now, but I'm here to support you offline. Let's try breaking things down one step at a time.",
        timestamp: new Date().toISOString()
      };
      updatedConv = {
        ...updatedConv,
        messages: [...nextMessages, companionMessage]
      };
      const finalConvs = updatedConvs.map(c => (c.id === updatedConv.id ? updatedConv : c));
      syncConversations(finalConvs);
    } finally {
      setIsLoading(false);
    }
  };

  // Export File
  const handleExport = (format) => {
    if (!activeConv) return;
    let content = '';
    const dateStr = new Date(activeConv.createdAt).toLocaleDateString();

    if (format === 'markdown') {
      content = `# Conversation with Luna: ${activeConv.title}\n*Date: ${dateStr}*\n\n---\n\n`;
      activeConv.messages.forEach(msg => {
        const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sender = msg.role === 'user' ? 'Student' : 'Luna';
        content += `**${sender}** (${timeStr}):\n${msg.content}\n\n`;
      });
    } else {
      content = `Conversation with Luna: ${activeConv.title}\nDate: ${dateStr}\n${'='.repeat(40)}\n\n`;
      activeConv.messages.forEach(msg => {
        const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sender = msg.role === 'user' ? 'Student' : 'Luna';
        content += `[${timeStr}] ${sender}: ${msg.content}\n\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `luna_${activeConv.title.toLowerCase().replace(/\s+/g, '_')}.${format === 'markdown' ? 'md' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter conversations based on query (title, content text, date)
  const filteredConversations = conversations.filter(c => {
    const q = searchQuery.toLowerCase();
    const titleMatch = c.title.toLowerCase().includes(q);
    const dateMatch = new Date(c.createdAt).toLocaleDateString().includes(q);
    const msgMatch = c.messages.some(m => m.content.toLowerCase().includes(q));
    return titleMatch || dateMatch || msgMatch;
  });

  // Markdown renderer parser
  const renderMarkdown = (text) => {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    escaped = escaped.replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px]">$1</code>');

    const lines = escaped.split('\n');
    const parsedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return `<li class="ml-4 list-disc text-xs leading-relaxed mt-1 font-medium">${trimmed.substring(2)}</li>`;
      }
      return line;
    });

    let html = parsedLines.join('\n');
    html = html.replace(/\n/g, '<br />');
    html = html.replace(/(<li.*?>.*?<\/li>)/g, '<ul class="my-1.5">$1</ul>');
    html = html.replace(/<\/ul>\s*<ul class="my-1.5">/g, '');

    return <div className="space-y-1 text-xs sm:text-sm leading-relaxed text-[#2F3A3F] dark:text-slate-350" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Suggested replies config
  const suggestedReplies = [
    "📄 Summarize Today's Journal",
    "📅 Plan My Week",
    "🎯 Break Down My Goal",
    "📚 Help Me Study",
    "📝 Organize My Thoughts",
    "💡 Brainstorm Ideas"
  ];

  return (
    <div className="flex-grow max-w-7xl mx-auto px-6 sm:px-8 py-8 w-full select-none animate-fade-in text-left">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch h-[calc(100vh-11rem)] min-h-[500px]">
        
        {/* Left column: Chats Sidebar */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4 h-full">
          <Button onClick={handleStartNewConversation} className="w-full flex items-center justify-center gap-2 !py-3 font-bold text-xs uppercase">
            <Plus size={16} /> New Chat
          </Button>

          <Card className="flex-grow flex flex-col p-4 overflow-hidden dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
            {/* Sidebar search input */}
            <div className="relative mb-4">
              <input
                type="text"
                className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2F3A3F] focus:outline-none focus:border-[#6B8E7A]/60 transition-all font-medium dark:bg-slate-900 dark:border-slate-800 dark:text-slate-250"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={13} className="absolute left-3 top-3 text-[#6B7280]" />
            </div>

            {/* Previous conversations list */}
            <div className="flex-grow overflow-y-auto space-y-2 pr-1">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-[#6B7280] text-[11px] font-bold border border-dashed border-[#E5E7EB] dark:border-slate-800 rounded-xl bg-[#FAF9F6]/30">
                  No chats found
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isActive = conv.id === activeConvId;
                  const isEditing = conv.id === editingConvId;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => !isEditing && setActiveConvId(conv.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 select-none ${
                        isActive
                          ? 'bg-[#E2EBE5] border-[#6B8E7A] text-[#587665] dark:bg-emerald-950/30 dark:border-emerald-700 dark:text-emerald-350'
                          : 'bg-white border-[#E5E7EB] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-850 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden flex-grow mr-2">
                        <MessageSquare size={14} className="shrink-0" />
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white border border-slate-300 text-xs px-2 py-0.5 rounded focus:outline-none font-bold text-slate-800 w-full"
                            value={editTitleInput}
                            onChange={(e) => setEditTitleInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(conv.id);
                              if (e.key === 'Escape') setEditingConvId(null);
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="text-xs font-bold truncate block">{conv.title}</span>
                        )}
                      </div>

                      {/* Rename and Delete action icons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isEditing ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSaveRename(conv.id); }}
                            className="p-1 hover:text-emerald-700 text-slate-400 focus:outline-none"
                            type="button"
                          >
                            <Check size={12} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleStartRename(conv, e)}
                            className="p-1 hover:text-slate-600 text-slate-400 focus:outline-none"
                            type="button"
                          >
                            <Edit3 size={11} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteConversation(conv.id, e)}
                          className="p-1 hover:text-red-600 text-slate-400 focus:outline-none"
                          type="button"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right column: Chat Area */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col h-full">
          <Card className="flex-grow flex flex-col p-6 h-full overflow-hidden justify-between dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
            {!activeConvId ? (
              /* Global Empty State */
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-5">
                <div className="p-4 bg-[#E2EBE5] dark:bg-emerald-950/40 rounded-full text-[#587665] dark:text-emerald-400">
                  <Sparkles size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-[#2F3A3F] dark:text-slate-100">🌙 Hi, I'm Luna.</h3>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 font-semibold max-w-sm">
                    I'm here to help you organize your thoughts, understand your reflections, and solve problems one step at a time.
                  </p>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 font-bold max-w-sm">
                    What would you like to work on today?
                  </p>
                </div>
                <Button onClick={handleStartNewConversation} className="!px-6">
                  Start Conversation
                </Button>
              </div>
            ) : (
              /* Active Chat Container */
              <div className="flex flex-col flex-grow overflow-hidden">
                {/* Chat Area Header: Title and Download Export Options */}
                <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-[#2F3A3F] dark:text-slate-200">{activeConv?.title}</h4>
                    <span className="text-[10px] text-[#6B7280] font-semibold">
                      Started: {new Date(activeConv?.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExport('text')}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6B8E7A] hover:bg-[#E2EBE5]/50 px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-slate-800 transition-colors focus:outline-none"
                      type="button"
                    >
                      <Download size={10} /> TXT
                    </button>
                    <button
                      onClick={() => handleExport('markdown')}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6B8E7A] hover:bg-[#E2EBE5]/50 px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-slate-800 transition-colors focus:outline-none"
                      type="button"
                    >
                      <Download size={10} /> MD
                    </button>
                  </div>
                </div>

                {/* Message Streams list */}
                <div className="flex-grow overflow-y-auto space-y-4 py-4 pr-1">
                  {activeConv?.messages.length === 0 ? (
                    <div className="text-center py-20 text-[#6B7280] text-xs font-semibold">
                      Ask me anything. Type a message below or pick a suggestion chip to start talking!
                    </div>
                  ) : (
                    activeConv?.messages.map(msg => {
                      const isUser = msg.role === 'user';
                      const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[75%] select-none ${
                            isUser ? 'ml-auto text-right items-end' : 'mr-auto text-left items-start'
                          }`}
                        >
                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed shadow-soft ${
                              isUser
                                ? 'bg-[#6B8E7A] text-white rounded-tr-none'
                                : 'bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-850 text-[#2F3A3F] dark:text-slate-200 rounded-tl-none'
                            }`}
                          >
                            {isUser ? msg.content : renderMarkdown(msg.content)}
                          </div>
                          <span className="text-[9px] text-[#6B7280] font-semibold mt-1 block select-none">
                            {formattedTime}
                          </span>
                        </div>
                      );
                    })
                  )}

                  {/* Loading skeletons for typing indicator */}
                  {isLoading && (
                    <div className="mr-auto text-left items-start max-w-[70%] space-y-1 animate-pulse select-none">
                      <div className="p-3.5 rounded-2xl bg-[#FAF9F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-850 w-28 h-8 rounded-tl-none" />
                      <span className="text-[9px] text-slate-400 font-bold block">Luna is writing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Reply Chips Footer */}
                {!isLoading && (
                  <div className="flex flex-wrap gap-2 py-2.5 border-t border-[#E5E7EB] dark:border-slate-800 select-none justify-start">
                    {suggestedReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(reply)}
                        className="text-[10px] font-bold bg-[#FAF9F6] border border-[#E5E7EB] dark:bg-slate-900 dark:border-slate-850 dark:text-slate-350 text-[#6B7280] px-3 py-1.5 rounded-full hover:bg-[#E2EBE5]/50 dark:hover:bg-slate-800 transition-colors focus:outline-none shadow-soft"
                        type="button"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message input bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 pt-3 border-t border-[#E5E7EB] dark:border-slate-800"
                >
                  <input
                    type="text"
                    disabled={isLoading}
                    className="flex-grow bg-[#FAF9F6] border border-[#E5E7EB] dark:bg-slate-900 dark:border-slate-850 dark:text-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#2F3A3F] focus:outline-none focus:border-[#6B8E7A] transition-all font-semibold disabled:opacity-50"
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="!p-3 shrink-0 flex items-center justify-center rounded-xl"
                  >
                    <Send size={14} />
                  </Button>
                </form>

                {/* Safety notice disclaimer footer */}
                <span className="text-[10px] text-[#6B7280] dark:text-slate-500 mt-3 text-center block max-w-lg mx-auto leading-normal select-none font-semibold">
                  Luna is an AI reflection and productivity companion designed to help organize thoughts, encourage self-reflection, and support everyday planning. It does not replace qualified medical, psychological, or emergency support.
                </span>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Luna;
