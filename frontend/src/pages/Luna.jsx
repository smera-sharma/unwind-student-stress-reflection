import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { safeStorage } from '../utils/storage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { MessageSquare, Send, Trash2, Edit3, Plus, Search, Download, Sparkles, Check, X, Menu } from 'lucide-react';

const Luna = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingConvId, setEditingConvId] = useState(null);
  const [editTitleInput, setEditTitleInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatKey = 'unwind_chats';

  // 1. Initial Load of Chat Histories
  useEffect(() => {
    const parsed = safeStorage.getItem(chatKey, []);
    setConversations(parsed);
    if (parsed.length > 0) {
      setActiveConvId(parsed[0].id);
    }
  }, [chatKey]);

  // 2. Helper: Sync to LocalStorage
  const syncConversations = (updated) => {
    setConversations(updated);
    safeStorage.setItem(chatKey, updated);
  };

  // Auto-resize textarea height on content change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
      const historyList = safeStorage.getItem('reflectionHistory', []);
      return historyList.slice(0, 3).map(log => `${log.date}: Mood ${log.mood} - ${log.text || log.journal || ''}`);
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

  const handleChipClick = async (chipText) => {
    let targetConv = activeConv;
    let updatedConvs = [...conversations];

    if (!targetConv) {
      targetConv = {
        id: `conv_${Date.now()}`,
        title: generateTitle(chipText),
        createdAt: new Date().toISOString(),
        messages: []
      };
      updatedConvs = [targetConv, ...updatedConvs];
      syncConversations(updatedConvs);
      setActiveConvId(targetConv.id);
    }
    
    setTimeout(() => {
      handleSendMessage(chipText);
    }, 50);
  };

  const handleCopyMessage = (content, msgId) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerateResponse = async () => {
    if (!activeConv || activeConv.messages.length < 2) return;
    const userMessages = activeConv.messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return;
    const lastUserMessage = userMessages[userMessages.length - 1];

    const lastUserIdx = activeConv.messages.findIndex(m => m.id === lastUserMessage.id);
    const truncatedMessages = activeConv.messages.slice(0, lastUserIdx + 1);

    const updatedConv = {
      ...activeConv,
      messages: truncatedMessages
    };
    const updatedConvs = conversations.map(c => c.id === activeConv.id ? updatedConv : c);
    syncConversations(updatedConvs);
    
    setIsLoading(true);
    await handleSendMessage(lastUserMessage.content);
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
      const todayMood = safeStorage.getItem('todayMood', 'Neutral');
      const recentMemory = getReflectionMemory();

      // Backend conversation API query
      const data = await apiService.ai.chat(
        nextMessages.map(m => ({ role: m.role, content: m.content })),
        todayMood,
        recentMemory
      );

      const companionMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'model',
        content: data.response,
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
    
    // 1. Escape HTML
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2. Handle fenced code blocks
    escaped = escaped.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-mono text-[10px] overflow-x-auto border border-[#E5E7EB] dark:border-slate-800 text-left my-2"><code>$2</code></pre>');

    // 3. Bold, Italic, Inline Code
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    escaped = escaped.replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px]">$1</code>');

    // 4. Split by line for lists
    const lines = escaped.split('\n');
    const parsedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return `<li class="ml-4 list-disc text-xs leading-relaxed mt-1 font-medium">${trimmed.substring(2)}</li>`;
      }
      const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return `<li class="ml-4 list-decimal text-xs leading-relaxed mt-1 font-medium">${numMatch[2]}</li>`;
      }
      return line;
    });

    let html = parsedLines.join('\n');
    html = html.replace(/\n/g, '<br />');
    
    html = html.replace(/(<li class="ml-4 list-disc.*?<\/li>)/g, '<ul class="my-1.5">$1</ul>');
    html = html.replace(/<\/ul>\s*<ul class="my-1.5">/g, '');
    
    html = html.replace(/(<li class="ml-4 list-decimal.*?<\/li>)/g, '<ol class="my-1.5">$1</ol>');
    html = html.replace(/<\/ol>\s*<ol class="my-1.5">/g, '');

    return <div className="space-y-1 text-xs sm:text-sm leading-relaxed text-[#2F3A3F] dark:text-slate-350" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Suggested replies config for active chat
  const suggestedReplies = [
    "📅 Build Schedule",
    "📝 Checklist",
    "💡 Brainstorm",
    "🎯 Prioritize"
  ];

  // Suggestions for Welcome Screen
  const welcomeSuggestions = [
    { title: "Plan My Week", icon: "📅", desc: "Organize your upcoming assignments and study sessions." },
    { title: "Study Planner", icon: "📚", desc: "Map out targets and break down complex modules." },
    { title: "Brainstorm", icon: "🧠", desc: "Explore academic projects and creative ideas." },
    { title: "Reflect", icon: "💭", desc: "Organize your thoughts and reflect on journal insights." },
    { title: "Organize Thoughts", icon: "📝", desc: "Tackle overwhelm by structuring your daily focus." }
  ];

  const renderWelcomeScreen = () => {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6 py-12 px-4 overflow-y-auto max-w-2xl mx-auto">
        <div className="p-4 bg-[#E2EBE5] dark:bg-emerald-950/40 rounded-full text-[#587665] dark:text-emerald-400">
          <Sparkles size={28} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-[#2F3A3F] dark:text-slate-100">🌙 Hi, I'm Luna.</h3>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed">
            Your wellness, reflection, and productivity companion. What would you like to work on today?
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
          {welcomeSuggestions.map((item, index) => (
            <button
              key={index}
              onClick={() => handleChipClick(`${item.icon} ${item.title}`)}
              className="flex items-start gap-3 p-4 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-[#6B8E7A]/40 transition-all text-left focus:outline-none shadow-soft"
              type="button"
            >
              <span className="text-xl select-none shrink-0">{item.icon}</span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-[#F8FAFC]">{item.title}</h4>
                <p className="text-[10.5px] text-[#6B7280] dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex select-none animate-fade-in text-left overflow-hidden bg-[#FAF9F6] dark:bg-[#0F172A] relative">
      
      {/* Mobile Drawer Overlay */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-[280px] transform bg-white dark:bg-[#1E293B] border-r border-[#E5E7EB] dark:border-slate-800 flex flex-col gap-4 p-4 h-full transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-0 md:inset-auto md:w-[260px] lg:w-[280px] shrink-0
        ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between shrink-0">
          <Button onClick={() => { handleStartNewConversation(); setShowSidebar(false); }} className="flex-grow flex items-center justify-center gap-2 !py-2.5 font-bold text-xs uppercase shrink-0">
            <Plus size={16} /> New Chat
          </Button>
          <button onClick={() => setShowSidebar(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-600 focus:outline-none">
            <X size={16} />
          </button>
        </div>

        {/* Sidebar search input */}
        <div className="relative shrink-0">
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
                  onClick={() => {
                    if (!isEditing) {
                      setActiveConvId(conv.id);
                      setShowSidebar(false);
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 select-none ${
                    isActive
                      ? 'bg-[#E2EBE5] border-[#6B8E7A] text-[#587665] dark:bg-[#A7C4A0]/10 dark:border-[#A7C4A0]/30 dark:text-[#A7C4A0]'
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
      </div>

      {/* Main chat layout */}
      <div className="flex-grow flex flex-col h-full bg-[#FAF9F6] dark:bg-[#0F172A] overflow-hidden">
        <div className="max-w-[950px] w-full mx-auto flex flex-col h-full px-4 sm:px-6 md:px-8 overflow-hidden">
          
          {/* Chat Area Header */}
          <div className="py-4 border-b border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSidebar(true)}
                className="md:hidden p-2 text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] hover:bg-[#E2EBE5]/50 dark:hover:bg-slate-800 rounded-lg focus:outline-none"
              >
                <Menu size={18} />
              </button>
              {activeConvId && (
                <div className="text-left">
                  <h4 className="text-sm font-bold text-[#2F3A3F] dark:text-slate-200">{activeConv?.title}</h4>
                  <span className="text-[10px] text-[#6B7280] dark:text-slate-400 font-semibold">
                    Started: {new Date(activeConv?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {activeConvId && (
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
            )}
          </div>

          {/* Conversation & Scroll Area */}
          <div className="flex-grow overflow-y-auto space-y-6 py-6 pr-1">
            {!activeConvId || activeConv?.messages.length === 0 ? (
              renderWelcomeScreen()
            ) : (
              activeConv?.messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[75%] transition-all duration-300 animate-fade-in ${
                      isUser ? 'ml-auto text-right items-end' : 'mr-auto text-left items-start'
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed shadow-soft ${
                        isUser
                          ? 'bg-[#E2EBE5] dark:bg-[#A7C4A0] text-[#2F3A3F] dark:text-[#0F172A] rounded-tr-none'
                          : 'bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-white/10 text-[#2F3A3F] dark:text-[#F8FAFC] rounded-tl-none'
                      }`}
                    >
                      {isUser ? msg.content : renderMarkdown(msg.content)}
                    </div>
                    
                    {isUser ? (
                      <span className="text-[9px] text-[#6B7280] font-semibold mt-1 block select-none">
                        {formattedTime}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 mt-1 select-none">
                        <button
                          onClick={() => handleCopyMessage(msg.content, msg.id)}
                          className="text-[9px] font-bold text-[#6B8E7A] hover:underline focus:outline-none"
                          type="button"
                        >
                          {copiedId === msg.id ? '✓ Copied' : '📋 Copy'}
                        </button>
                        {idx === activeConv.messages.length - 1 && (
                          <button
                            onClick={handleRegenerateResponse}
                            className="text-[9px] font-bold text-[#89A8B2] hover:underline focus:outline-none"
                            type="button"
                          >
                            🔄 Regenerate
                          </button>
                        )}
                        <span className="text-[9px] text-[#6B7280] font-semibold">
                          • {formattedTime}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="mr-auto text-left items-start max-w-[75%] space-y-1.5 select-none animate-pulse">
                <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-white/10 text-[#6B7280] rounded-tl-none inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E7A] dark:bg-[#A7C4A0] animate-bounce duration-300 delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E7A] dark:bg-[#A7C4A0] animate-bounce duration-300 delay-200" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E7A] dark:bg-[#A7C4A0] animate-bounce duration-300 delay-300" />
                </div>
                <span className="text-[9px] text-[#6B7280] dark:text-slate-400 font-bold block ml-2">Luna is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Reply Chips Footer */}
          {activeConvId && activeConv?.messages.length > 0 && !isLoading && activeConv.messages[activeConv.messages.length - 1].role === 'model' && (
            <div className="flex flex-wrap gap-2 py-3 select-none justify-center shrink-0">
              {suggestedReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(reply)}
                  className="text-[10px] font-bold bg-white border border-[#E5E7EB] dark:bg-[#1E293B] dark:border-slate-700 dark:text-slate-300 text-[#6B7280] px-3.5 py-2 rounded-full hover:bg-[#E2EBE5]/50 dark:hover:bg-slate-700 transition-colors focus:outline-none shadow-soft"
                  type="button"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Sticky Composer & Input panel */}
          <div className="shrink-0 pb-4 pt-2 border-t border-[#E5E7EB] dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2.5 p-2 border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-[#1E293B] rounded-3xl shadow-soft focus-within:border-[#6B8E7A]/60 transition-all"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                disabled={isLoading}
                onKeyDown={handleKeyDown}
                className="flex-grow bg-transparent border-none text-xs sm:text-sm text-[#2F3A3F] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:ring-0 resize-none max-h-32 px-3 py-1.5 leading-relaxed disabled:opacity-50"
                placeholder="Ask Luna to plan, prioritize, or brainstorm..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <Button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="!p-2.5 shrink-0 flex items-center justify-center rounded-full bg-[#6B8E7A] text-white hover:bg-[#587665] disabled:opacity-50"
              >
                <Send size={14} />
              </Button>
            </form>

            <span className="text-[10px] text-[#6B7280] dark:text-slate-500 mt-3 text-center block max-w-lg mx-auto leading-normal select-none font-semibold">
              Luna is an AI reflection and productivity companion designed to help organize thoughts, encourage self-reflection, and support everyday planning. It does not replace qualified medical, psychological, or emergency support.
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Luna;
