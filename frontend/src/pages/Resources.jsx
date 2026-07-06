import React, { useState, useEffect, Component } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { wellnessArticles } from '../data/wellnessArticles';
import { Search, Bookmark, BookOpen, HeartHandshake, X, Play, ChevronRight, Info, Calendar, Phone, Trash2 } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Resources Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-grow flex items-center justify-center min-h-[50vh] p-8 text-center select-none">
          <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/50 rounded-3xl p-8 max-w-md w-full space-y-4 shadow-soft">
            <span className="text-3xl block">⚠️</span>
            <h3 className="text-base font-extrabold text-rose-900 dark:text-rose-350">
              Something went wrong while loading Resources.
            </h3>
            <p className="text-xs text-rose-800/80 dark:text-rose-450 font-semibold leading-relaxed">
              We encountered an unexpected runtime error.
            </p>
            <div className="pt-2">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#6B8E7A] hover:bg-[#587665] text-white focus:ring-[#6B8E7A] shadow-soft hover:scale-[1.02] active:scale-[0.98] !py-2.5 !px-6 text-xs font-bold uppercase tracking-wider"
                type="button"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Resources = () => {
  const { user } = useAuth();
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Bookmarks
  const bookmarksKey = user ? `unwind_bookmarks_${user.email}` : 'unwind_bookmarks_guest';
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  
  // Modals / active views
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [continueReadingId, setContinueReadingId] = useState(null);

  // Exercise timer states
  const [exerciseStage, setExerciseStage] = useState('');
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState(0);
  const [exerciseIsActive, setExerciseIsActive] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);

  // Inline Breathing states
  const [inlineActive, setInlineActive] = useState(false);
  const [inlinePhase, setInlinePhase] = useState('Breathe In'); // Breathe In, Hold, Exhale
  const [inlineTimeLeft, setInlineTimeLeft] = useState(4);

  // Inline Grounding states
  const [groundingTab, setGroundingTab] = useState('54321'); // 54321, PMR
  const [groundingActiveStep, setGroundingActiveStep] = useState(0);

  // FAQ Accordion states
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  // Categories list
  const categories = [
    'All',
    'Exam Stress',
    'Better Sleep',
    'Mindfulness',
    'Burnout Recovery',
    'Time Management',
    'Emotional Wellbeing',
    'Relationships',
    'Student Life'
  ];

  // 1. Initial Load of Saved Bookmarks & Continue Reading
  useEffect(() => {
    const saved = localStorage.getItem(bookmarksKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBookmarkedIds(parsed);
        } else {
          setBookmarkedIds([]);
        }
      } catch (e) {
        console.error("Could not parse bookmarks:", e);
        setBookmarkedIds([]);
      }
    } else {
      setBookmarkedIds([]);
    }
    const lastRead = localStorage.getItem('continue_reading_article_id');
    if (lastRead) {
      setContinueReadingId(lastRead);
    }
  }, [bookmarksKey]);

  // 1b. Scroll to #breathing if present in URL
  useEffect(() => {
    const handleScroll = () => {
      if (window.location.hash === '#breathing') {
        setTimeout(() => {
          const element = document.getElementById('breathing-exercise-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      }
    };
    handleScroll();
    window.addEventListener('hashchange', handleScroll);
    return () => window.removeEventListener('hashchange', handleScroll);
  }, []);

  // 1c. Inline Cyclic Phase timer loop for breathing
  useEffect(() => {
    let timer = null;
    if (inlineActive) {
      timer = setInterval(() => {
        setInlineTimeLeft(prev => {
          if (prev <= 1) {
            if (inlinePhase === 'Breathe In') {
              setInlinePhase('Hold');
              return 4;
            } else if (inlinePhase === 'Hold') {
              setInlinePhase('Exhale');
              return 6;
            } else {
              setInlinePhase('Breathe In');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inlineActive, inlinePhase]);

  // Sync bookmarks
  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    if (!id) return;
    const currentIds = Array.isArray(bookmarkedIds) ? bookmarkedIds : [];
    let updated;
    if (currentIds.includes(id)) {
      updated = currentIds.filter(item => item !== id);
    } else {
      updated = [...currentIds, id];
    }
    setBookmarkedIds(updated);
    localStorage.setItem(bookmarksKey, JSON.stringify(updated));
  };

  // Open article details and save reading resume point
  const handleOpenArticle = (art) => {
    if (!art) return;
    setActiveArticle(art);
    setContinueReadingId(art.id);
    localStorage.setItem('continue_reading_article_id', art.id);
  };

  // Close Article
  const handleCloseArticle = () => {
    setActiveArticle(null);
  };

  // Rotate recommended resource based on current date
  const getDailyIndex = () => {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    const len = Array.isArray(wellnessArticles) ? wellnessArticles.length : 0;
    return len > 0 ? day % len : 0;
  };
  const dailyArticle = Array.isArray(wellnessArticles) && wellnessArticles.length > 0 ? wellnessArticles[getDailyIndex()] : null;

  // Filtered articles list matching category, search bar
  const filteredArticles = (Array.isArray(wellnessArticles) ? wellnessArticles : []).filter(art => {
    if (!art) return false;
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const query = (searchQuery || '').toLowerCase();
    const title = (art.title || '').toLowerCase();
    const summary = (art.summary || '').toLowerCase();
    const category = (art.category || '').toLowerCase();
    const tags = Array.isArray(art.tags) ? art.tags : [];
    
    const matchesSearch =
      title.includes(query) ||
      summary.includes(query) ||
      tags.some(t => t?.toLowerCase().includes(query)) ||
      category.includes(query);
    return matchesCategory && matchesSearch;
  });

  // Bookmarked articles list
  const bookmarkedArticles = (Array.isArray(wellnessArticles) ? wellnessArticles : []).filter(art => 
    art && Array.isArray(bookmarkedIds) && bookmarkedIds.includes(art.id)
  );

  // Exercise structures
  const exercises = [
    {
      id: "478_breath",
      title: "4-7-8 Breathing",
      duration: "19 seconds per cycle",
      instructions: "Inhale quietly through your nose for 4 seconds, hold your breath for 7 seconds, then blow out through your mouth for 8 seconds. Repetitions regulate physical anxiety responses."
    },
    {
      id: "box_breath",
      title: "Box Breathing",
      duration: "16 seconds per cycle",
      instructions: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, then hold for 4 seconds. Repeat the box cycles to regain mental center."
    },
    {
      id: "54321_grounding",
      title: "5-4-3-2-1 Grounding",
      duration: "Self-paced guide",
      instructions: "A sensory awareness method to anchor your mind to the current moment when thoughts spiral."
    },
    {
      id: "pmr_relaxation",
      title: "Progressive Muscle Relaxation",
      duration: "Step-by-step focus",
      instructions: "Tense specific muscle groups for 5 seconds, then release completely for 10 seconds. Helps release built-up physical tension."
    }
  ];

  // Grounding steps instructions
  const groundingInstructions = [
    { label: "👀 See 5 Things", desc: "Look around you. Name five things you can see (e.g. a book, a plant, a pen, a clock, the wall)." },
    { label: "✋ Feel 4 Things", desc: "Touch four things. Focus on textures and temperatures (e.g. cold desk, soft shirt fabric, smooth phone screen)." },
    { label: "👂 Hear 3 Things", desc: "Listen carefully. Name three distinct sounds (e.g. fan hum, distant cars, breeze outside)." },
    { label: "👃 Smell 2 Things", desc: "Identify two smells. If none are around, recall your favorite scents (e.g. coffee, rain)." },
    { label: "👅 Taste 1 Thing", desc: "Notice one taste. If not tasting anything, take a sip of water or focus on your mouth feel." }
  ];

  // Progressive Muscle Relaxation steps
  const pmrSteps = [
    { part: "💪 Shoulders & Arms", desc: "Clench your fists and pull your shoulders up to your ears. Hold tightly... and release completely." },
    { part: "😊 Face & Jaw", desc: "Squeeze your eyes shut and clench your jaw tightly. Hold... and release." },
    { part: "🧘 Chest & Stomach", desc: "Take a deep breath and tense your core muscles. Hold... and breathe out." },
    { part: "🦵 Legs & Feet", desc: "Point your toes and tense your calves and thighs. Hold... and let go." }
  ];

  // Timer loop for breathing exercises
  useEffect(() => {
    let intervalId;
    if (exerciseIsActive && activeExercise) {
      if (activeExercise.id === '478_breath') {
        let step = 0; // 0: Inhale (4s), 1: Hold (7s), 2: Exhale (8s)
        setExerciseStage('Inhale (4s)');
        setExerciseTimeLeft(4);
        
        intervalId = setInterval(() => {
          setExerciseTimeLeft(prev => {
            if (prev <= 1) {
              if (step === 0) {
                step = 1;
                setExerciseStage('Hold Breath (7s)');
                return 7;
              } else if (step === 1) {
                step = 2;
                setExerciseStage('Exhale (8s)');
                return 8;
              } else {
                step = 0;
                setExerciseStage('Inhale (4s)');
                return 4;
              }
            }
            return prev - 1;
          });
        }, 1000);
      } else if (activeExercise.id === 'box_breath') {
        let step = 0; // 0: Inhale (4s), 1: Hold (4s), 2: Exhale (4s), 3: Hold (4s)
        setExerciseStage('Inhale (4s)');
        setExerciseTimeLeft(4);

        intervalId = setInterval(() => {
          setExerciseTimeLeft(prev => {
            if (prev <= 1) {
              if (step === 0) {
                step = 1;
                setExerciseStage('Hold (4s)');
                return 4;
              } else if (step === 1) {
                step = 2;
                setExerciseStage('Exhale (4s)');
                return 4;
              } else if (step === 2) {
                step = 3;
                setExerciseStage('Hold (4s)');
                return 4;
              } else {
                step = 0;
                setExerciseStage('Inhale (4s)');
                return 4;
              }
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
    return () => clearInterval(intervalId);
  }, [exerciseIsActive, activeExercise]);

  const handleStartExercise = (ex) => {
    setActiveExercise(ex);
    setExerciseIsActive(true);
    setGroundingStep(0);
  };

  const handleCloseExercise = () => {
    setActiveExercise(null);
    setExerciseIsActive(false);
    setExerciseStage('');
    setExerciseTimeLeft(0);
    setGroundingStep(0);
  };

  const handleInlineReset = () => {
    setInlineActive(false);
    setInlinePhase('Breathe In');
    setInlineTimeLeft(4);
  };

  const resumeArticleObj = continueReadingId ? wellnessArticles.find(a => a.id === continueReadingId) : null;

  return (
    <div className="flex-grow space-y-12 py-8 max-w-7xl mx-auto px-6 sm:px-8 relative animate-fade-in text-left select-none">
      
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold text-[#89A8B2] tracking-wide uppercase block">Wellness Resources</span>
        <h2 className="text-3xl font-extrabold text-[#2F3A3F] dark:text-slate-100 mt-1.5 tracking-tight">Resource Hub</h2>
        <p className="text-sm text-[#6B7280] dark:text-slate-400 font-medium mt-1">Explore wellness advice, mental health exercises, and emergency support services.</p>
      </div>

      {/* Row 1: Daily Recommendation & Continue Reading */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Daily Recommend Card */}
        <div className="lg:col-span-8">
          <Card className="p-6 bg-[#FAF7F2] border-[#E8DCC8]/60 dark:bg-slate-900 dark:border-slate-800 flex flex-col md:flex-row gap-6 h-full justify-between items-start" hoverEffect={false}>
            <div className="space-y-3 text-left">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-800 bg-[#E2EBE5] px-2.5 py-0.5 rounded-full select-none uppercase">
                <Calendar size={9} /> Daily Recommended Resource
              </span>
              <h3 className="text-lg font-bold text-[#2F3A3F] dark:text-slate-100">{dailyArticle?.title}</h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-semibold">
                {dailyArticle?.summary}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {dailyArticle?.tags?.map(t => (
                  <span key={t} className="text-[9px] font-bold bg-[#FAF9F6] border border-slate-200/50 text-[#2F3A3F] dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350 px-2 py-0.5 rounded-full select-none">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 flex flex-col justify-end h-full md:self-end pt-4 md:pt-0">
              <Button onClick={() => handleOpenArticle(dailyArticle)} className="flex items-center gap-1 font-bold text-xs uppercase !px-4 !py-2.5">
                Read Article <ChevronRight size={14} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Continue Reading Card */}
        <div className="lg:col-span-4">
          <Card className="p-6 flex flex-col justify-between h-full dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">Continue Reading</span>
              {resumeArticleObj ? (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200 line-clamp-1">{resumeArticleObj.title}</h4>
                  <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-semibold line-clamp-2">
                    {resumeArticleObj.summary}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#6B7280] dark:text-slate-400 font-semibold italic py-2">
                  No recently read articles yet. Browse below to start reading.
                </p>
              )}
            </div>
            {resumeArticleObj && (
              <div className="pt-4">
                <Button onClick={() => handleOpenArticle(resumeArticleObj)} variant="outline" className="w-full flex items-center justify-center gap-1 text-[11px] font-bold">
                  <BookOpen size={12} /> Resume Reading
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Row 2: Search & Article Database browser */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#2F3A3F] dark:text-slate-100">Wellness Articles</h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">Find advice matching categories or keywords.</p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              className="w-full bg-white border border-[#E5E7EB] dark:bg-slate-900 dark:border-slate-850 dark:text-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2F3A3F] focus:outline-none focus:border-[#6B8E7A]/60 transition-all font-medium shadow-soft"
              placeholder="Search title, category, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={14} className="absolute left-3.5 top-3.5 text-[#6B7280]" />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 py-1 select-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] font-bold px-3.5 py-2 rounded-full border transition-all duration-200 shadow-soft focus:outline-none ${
                selectedCategory === cat
                  ? 'bg-[#E2EBE5] border-[#6B8E7A] text-[#587665] dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-350'
                  : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-850 dark:text-slate-350 dark:hover:bg-slate-800'
              }`}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.length === 0 ? (
            /* Empty State Container */
            <div className="col-span-full py-16 text-center select-none flex flex-col items-center justify-center gap-4">
              <div className="text-xs text-[#6B7280] dark:text-slate-400 font-semibold border border-dashed border-[#E5E7EB] dark:border-slate-800 rounded-2xl bg-[#FAF9F6]/50 dark:bg-slate-900/30 p-10 max-w-md w-full">
                No matching resources found.
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="text-xs bg-[#6B8E7A] text-white px-4.5 py-2 rounded-xl font-bold hover:bg-[#587665] transition-colors focus:outline-none"
                  type="button"
                >
                  Clear Search
                </button>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-xs bg-[#FAF9F6] border border-[#E5E7EB] text-[#2F3A3F] px-4.5 py-2 rounded-xl font-bold hover:bg-slate-50 focus:outline-none transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                  type="button"
                >
                  Browse Categories
                </button>
              </div>
            </div>
          ) : (
            filteredArticles.map(art => {
              const isBookmarked = bookmarkedIds.includes(art.id);
              return (
                <Card
                  key={art.id}
                  onClick={() => handleOpenArticle(art)}
                  className="p-5 cursor-pointer dark:bg-slate-950 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div className="space-y-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#89A8B2] tracking-wider uppercase">{art.category}</span>
                      <button
                        onClick={(e) => toggleBookmark(art.id, e)}
                        className={`p-1.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none ${
                          isBookmarked
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                            : 'border-slate-200 dark:border-slate-850 text-slate-400'
                        }`}
                        type="button"
                      >
                        <Bookmark size={12} className={isBookmarked ? 'fill-emerald-750 dark:fill-emerald-400' : ''} />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-[#2F3A3F] dark:text-slate-200 line-clamp-2">{art.title}</h4>
                    <p className="text-[11px] text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed line-clamp-3">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#E5E7EB]/50 dark:border-slate-850/50 mt-4 select-none">
                    <span className="text-[9px] font-bold bg-[#FAF9F6] border border-slate-200/50 text-[#2F3A3F] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 px-2 py-0.5 rounded-full select-none">
                      {art.duration}
                    </span>
                    <button className="text-[10px] font-bold text-[#6B8E7A] hover:underline flex items-center gap-0.5 focus:outline-none">
                      Read More <ChevronRight size={12} />
                    </button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Row 3: Saved Articles */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-[#2F3A3F] dark:text-slate-100">Saved Articles</h3>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">Your bookmarked wellness read list.</p>
        </div>
        <Card className="p-5 dark:bg-slate-950 dark:border-slate-800" hoverEffect={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-1">
            {bookmarkedArticles.length === 0 ? (
              <div className="col-span-full text-center py-12 text-[#6B7280] text-xs font-semibold italic border border-dashed border-[#E5E7EB] dark:border-slate-800 rounded-2xl bg-[#FAF9F6]/30">
                No saved articles yet. Bookmark cards to access them here.
              </div>
            ) : (
              bookmarkedArticles.map(art => (
                <div
                  key={art.id}
                  onClick={() => handleOpenArticle(art)}
                  className="flex items-center justify-between p-3.5 bg-white border border-[#E5E7EB] dark:bg-slate-900 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="text-left overflow-hidden mr-3">
                    <span className="text-[9px] font-bold text-[#89A8B2] tracking-wider uppercase block">{art.category}</span>
                    <h4 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200 truncate mt-0.5">{art.title}</h4>
                  </div>
                  <button
                    onClick={(e) => toggleBookmark(art.id, e)}
                    className="p-1.5 text-red-400 hover:text-red-600 focus:outline-none shrink-0"
                    type="button"
                  >
                    <Trash2 size={13} className="lucide shrink-0" />
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Row 4: Wellness Tools */}
      <div id="breathing-exercise-section" className="space-y-6 scroll-mt-6">
        <div>
          <h3 className="text-xl font-bold text-[#2F3A3F] dark:text-slate-100">🧘 Wellness Tools</h3>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">Interactive tools to help you breathe, relax, and ground yourself in real-time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Breathing Exercise Card */}
          <div className="lg:col-span-6 flex flex-col">
            <Card className="p-6 flex-grow flex flex-col justify-between dark:bg-slate-950 dark:border-slate-800 text-center space-y-6" hoverEffect={false}>
              <div className="text-center space-y-1.5 select-none text-left">
                <span className="text-xs font-bold text-[#89A8B2] tracking-wider uppercase block">Breathing Session</span>
                <h4 className="text-lg font-extrabold text-[#2F3A3F] dark:text-slate-200 mt-1">
                  {inlinePhase === 'Breathe In' ? '💨 Breathe In' : inlinePhase === 'Hold' ? '✋ Hold' : '🌬️ Breathe Out'} ({inlineTimeLeft}s)
                </h4>
              </div>

              {/* Pulsing Guide Ring */}
              <div className="relative w-40 h-40 flex items-center justify-center mx-auto select-none">
                <div className="absolute w-24 h-24 rounded-full border border-slate-100 dark:border-slate-800" />
                <div 
                  className={`absolute w-20 h-20 rounded-full bg-[#6B8E7A]/15 border border-[#6B8E7A]/30 transition-transform ease-in-out duration-1000 ${
                    !inlineActive ? 'scale-100' : inlinePhase === 'Breathe In' ? 'scale-125 duration-[4000ms]' : inlinePhase === 'Hold' ? 'scale-125 duration-0' : 'scale-100 duration-[6000ms]'
                  }`} 
                />
                <div className="relative z-10 text-[10px] font-extrabold text-[#6B8E7A] uppercase tracking-widest">
                  {inlinePhase === 'Breathe In' ? 'Inhale' : inlinePhase === 'Hold' ? 'Hold' : 'Exhale'}
                </div>
              </div>

              <div className="flex items-center gap-3 max-w-xs mx-auto w-full pt-2">
                <Button 
                  onClick={() => setInlineActive(!inlineActive)} 
                  variant={inlineActive ? 'outline' : 'primary'}
                  className="flex-1 text-[11px] font-bold uppercase !py-2.5"
                >
                  {inlineActive ? 'Pause' : 'Start'}
                </Button>
                <Button 
                  onClick={handleInlineReset} 
                  variant="outline" 
                  className="flex-1 text-[11px] font-bold uppercase !py-2.5 border-[#E5E7EB] dark:border-slate-850 dark:text-slate-350 text-[#2F3A3F]"
                >
                  Reset
                </Button>
              </div>
            </Card>
          </div>

          {/* Grounding / PMR Techniques Card */}
          <div className="lg:col-span-6 flex flex-col">
            <Card className="p-6 flex-grow flex flex-col justify-between dark:bg-slate-950 dark:border-slate-800 text-left space-y-4" hoverEffect={false}>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-[#89A8B2] tracking-wider uppercase block">Grounding Techniques</span>
                
                {/* Tabs */}
                <div className="flex gap-2" role="tablist" aria-label="Grounding Exercises">
                  <button 
                    onClick={() => { setGroundingTab('54321'); setGroundingActiveStep(0); }}
                    role="tab"
                    id="54321-tab"
                    aria-selected={groundingTab === '54321'}
                    aria-controls="grounding-panel"
                    className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition-all focus:outline-none ${
                      groundingTab === '54321' ? 'bg-[#E2EBE5] border-[#6B8E7A] text-[#587665] dark:bg-emerald-950/40 dark:text-emerald-350' : 'bg-white border-[#E5E7EB] text-[#6B7280] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                    }`}
                    type="button"
                  >
                    5-4-3-2-1
                  </button>
                  <button 
                    onClick={() => { setGroundingTab('pmr'); setGroundingActiveStep(0); }}
                    role="tab"
                    id="pmr-tab"
                    aria-selected={groundingTab === 'pmr'}
                    aria-controls="pmr-panel"
                    className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition-all focus:outline-none ${
                      groundingTab === 'pmr' ? 'bg-[#E2EBE5] border-[#6B8E7A] text-[#587665] dark:bg-emerald-950/40 dark:text-emerald-350' : 'bg-white border-[#E5E7EB] text-[#6B7280] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                    }`}
                    type="button"
                  >
                    PMR
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {groundingTab === '54321' ? (
                <div id="grounding-panel" role="tabpanel" aria-labelledby="54321-tab" className="space-y-4 flex-grow flex flex-col justify-between py-2">
                  <div className="space-y-2">
                    <h5 className="text-sm font-extrabold text-[#587665] dark:text-emerald-400">{groundingInstructions[groundingActiveStep]?.label}</h5>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed">
                      {groundingInstructions[groundingActiveStep]?.desc}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB]/50 dark:border-slate-850/50">
                    <span className="text-[9px] text-[#6B7280] font-bold uppercase">Step {groundingActiveStep + 1} of 5</span>
                    <div className="flex gap-2">
                      {groundingActiveStep > 0 && (
                        <Button onClick={() => setGroundingActiveStep(prev => prev - 1)} variant="outline" className="text-[10px] font-bold uppercase !px-3.5 !py-1.5 border-[#E5E7EB]">
                          Back
                        </Button>
                      )}
                      {groundingActiveStep < 4 ? (
                        <Button onClick={() => setGroundingActiveStep(prev => prev + 1)} className="text-[10px] font-bold uppercase !px-3.5 !py-1.5">
                          Next
                        </Button>
                      ) : (
                        <Button onClick={() => setGroundingActiveStep(0)} variant="outline" className="text-[10px] font-bold uppercase !px-3.5 !py-1.5 border-emerald-255 border-dashed text-emerald-800 dark:text-emerald-400">
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div id="pmr-panel" role="tabpanel" aria-labelledby="pmr-tab" className="space-y-4 flex-grow flex flex-col justify-between py-2">
                  <div className="space-y-2">
                    <h5 className="text-sm font-extrabold text-[#587665] dark:text-emerald-400">PMR Group: {pmrSteps[groundingActiveStep]?.part}</h5>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed">
                      {pmrSteps[groundingActiveStep]?.desc}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB]/50 dark:border-slate-850/50">
                    <span className="text-[9px] text-[#6B7280] font-bold uppercase">Group {groundingActiveStep + 1} of 4</span>
                    <div className="flex gap-2">
                      {groundingActiveStep > 0 && (
                        <Button onClick={() => setGroundingActiveStep(prev => prev - 1)} variant="outline" className="text-[10px] font-bold uppercase !px-3.5 !py-1.5 border-[#E5E7EB]">
                          Back
                        </Button>
                      )}
                      {groundingActiveStep < 3 ? (
                        <Button onClick={() => setGroundingActiveStep(prev => prev + 1)} className="text-[10px] font-bold uppercase !px-3.5 !py-1.5">
                          Next
                        </Button>
                      ) : (
                        <Button onClick={() => setGroundingActiveStep(0)} variant="outline" className="text-[10px] font-bold uppercase !px-3.5 !py-1.5 border-emerald-255 border-dashed text-emerald-800 dark:text-emerald-400">
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Row 5: Emergency Support Section */}
      <Card className="p-6 border-rose-250 bg-rose-50/50 dark:border-rose-950 dark:bg-rose-950/20 text-left space-y-4" hoverEffect={false}>
        <div className="flex items-center gap-2.5 select-none">
          <div className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-450 rounded-xl">
            <HeartHandshake size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-rose-950 dark:text-rose-250">Emergency & Crisis Support</h3>
            <p className="text-xs text-rose-900/80 dark:text-rose-350 font-medium">Reaching out for help is a sign of resilience and self-care.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#2F3A3F] dark:text-slate-350 select-text">
          {/* Left Card: When to Seek Help */}
          <div className="space-y-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-rose-100 dark:border-rose-950 flex flex-col justify-between">
            <div className="space-y-1 text-left">
              <h4 className="font-extrabold text-rose-900 dark:text-rose-300 flex items-center gap-1 text-sm">
                <Info size={14} /> When to Seek Help
              </h4>
              <p className="leading-relaxed font-semibold text-[11px] text-rose-805 dark:text-rose-400">
                If your academic pressure feels unmanageable, or stress blocks sleep, eating, or daily routines for more than two consecutive weeks, please seek professional support.
              </p>
            </div>
            
            <div className="text-[10px] text-rose-900 dark:text-rose-300 font-bold border-t border-rose-100 dark:border-rose-950/50 pt-3 mt-4 text-left">
              🛡️ If you or someone you know is in immediate danger, call your local emergency services (112) or reach out to someone you trust immediately.
            </div>
          </div>

          {/* Right Card: India Mental Health Helplines */}
          <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-rose-100 dark:border-rose-950">
            <div className="border-b border-rose-100 dark:border-rose-950/50 pb-2 text-left">
              <h4 className="font-extrabold text-rose-900 dark:text-rose-300 text-sm">🇮🇳 India Mental Health Helplines</h4>
              <p className="text-[10px] text-rose-800 dark:text-rose-450 font-semibold leading-normal mt-0.5">
                Free and confidential mental health support is available. Reaching out is a sign of strength.
              </p>
            </div>

            <div className="divide-y divide-rose-100/50 dark:divide-rose-950/50 space-y-3">
              {/* KIRAN */}
              <div className="flex items-center justify-between pt-3 first:pt-0">
                <div className="text-left overflow-hidden mr-2">
                  <h5 className="text-[11px] font-bold text-rose-950 dark:text-rose-200 truncate">KIRAN Mental Health Helpline</h5>
                  <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold truncate">24×7 Government of India mental health support</p>
                </div>
                <div className="flex items-center gap-1.5 text-right shrink-0">
                  <Phone size={10} className="text-rose-700" />
                  <span className="font-extrabold text-rose-950 dark:text-rose-200 text-xs select-all">1800-599-0019</span>
                </div>
              </div>

              {/* iCALL */}
              <div className="flex items-center justify-between pt-3">
                <div className="text-left overflow-hidden mr-2">
                  <h5 className="text-[11px] font-bold text-rose-950 dark:text-rose-200 truncate">iCALL (TISS)</h5>
                  <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold truncate">Professional emotional support and counselling</p>
                </div>
                <div className="flex items-center gap-1.5 text-right shrink-0">
                  <Phone size={10} className="text-rose-700" />
                  <span className="font-extrabold text-rose-950 dark:text-rose-200 text-xs select-all">+91 9152987821 (Mon–Sat)</span>
                </div>
              </div>

              {/* AASRA */}
              <div className="flex items-center justify-between pt-3">
                <div className="text-left overflow-hidden mr-2">
                  <h5 className="text-[11px] font-bold text-rose-950 dark:text-rose-200 truncate">AASRA</h5>
                  <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold truncate">24×7 Suicide Prevention & Emotional Support</p>
                </div>
                <div className="flex items-center gap-1.5 text-right shrink-0">
                  <Phone size={10} className="text-rose-700" />
                  <span className="font-extrabold text-rose-950 dark:text-rose-200 text-xs select-all">+91 9820466726</span>
                </div>
              </div>

              {/* Sneha Foundation */}
              <div className="flex items-center justify-between pt-3">
                <div className="text-left overflow-hidden mr-2">
                  <h5 className="text-[11px] font-bold text-rose-950 dark:text-rose-200 truncate">Sneha Foundation</h5>
                  <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold truncate">Emotional support and suicide prevention</p>
                </div>
                <div className="flex items-center gap-1.5 text-right shrink-0">
                  <Phone size={10} className="text-rose-700" />
                  <span className="font-extrabold text-rose-950 dark:text-rose-200 text-xs select-all">044-24640050</span>
                </div>
              </div>

              {/* Vandrevala Foundation */}
              <div className="flex items-center justify-between pt-3">
                <div className="text-left overflow-hidden mr-2">
                  <h5 className="text-[11px] font-bold text-rose-950 dark:text-rose-200 truncate">Vandrevala Foundation</h5>
                  <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold truncate">Mental health support and counselling</p>
                </div>
                <div className="flex items-center gap-1.5 text-right shrink-0">
                  <Phone size={10} className="text-rose-700" />
                  <span className="font-extrabold text-rose-950 dark:text-rose-200 text-xs select-all">9999 666 555</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Row 6: Student Support Resources & FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Student Support Resources */}
        <div className="lg:col-span-6 flex flex-col text-left">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#2F3A3F] dark:text-slate-100">🎓 Student Support Resources</h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">Campus relief services and support divisions for academic balance.</p>
          </div>

          <Card className="p-6 flex-grow dark:bg-slate-950 dark:border-slate-800 space-y-4" hoverEffect={false}>
            <div className="divide-y divide-[#E5E7EB] dark:divide-slate-850 space-y-3">
              <div className="pt-3 first:pt-0">
                <h5 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">Dean of Students Office</h5>
                <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed mt-0.5">
                  Assistance with academic accommodations, sudden leaves of absence, medical extensions, and personal wellness leaves.
                </p>
              </div>
              <div className="pt-3">
                <h5 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">Peer Listening Network</h5>
                <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed mt-0.5">
                  Student-led groups providing confidential listening sessions, study support forums, and emotional wellness circles.
                </p>
              </div>
              <div className="pt-3">
                <h5 className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">Financial Aid Relief Desk</h5>
                <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed mt-0.5">
                  Micro-grants and emergency relief funding details for unforeseen medical bills or academic resource requirements.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Frequently Asked Questions */}
        <div className="lg:col-span-6 flex flex-col text-left">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#2F3A3F] dark:text-slate-100">❓ Frequently Asked Questions</h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">Frequently asked questions about Unwind wellness tools and data security.</p>
          </div>

          <Card className="p-6 flex-grow dark:bg-slate-950 dark:border-slate-800 space-y-3" hoverEffect={false}>
            {[
              { q: "How do I bookmark articles?", a: "Tap the bookmark ribbon icon on the top right of any article card. You can view, search, and manage your read list under Saved Articles." },
              { q: "What breathing cycles should I select?", a: "Use the 4-7-8 timer for fast physiological calming and stress reduction. Try Box Breathing to regain cognitive focus during exams." },
              { q: "How does Luna use my journal context?", a: "Luna retrieves the latest 3 reflections from your local logs to act as short-term conversation memory, enabling customized study/planning help." },
              { q: "Is my personal data secure?", a: "Yes. All your journals, reflections, chat history, and article bookmarks are saved directly inside your local storage partitioned by your email account." }
            ].map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div key={idx} className="border border-[#E5E7EB] dark:border-slate-850 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
                  <button
                    onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none"
                    type="button"
                  >
                    <span className="text-xs font-bold text-[#2F3A3F] dark:text-slate-200">{faq.q}</span>
                    <span className="text-xs text-[#89A8B2]">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 pt-1 border-t border-[#E5E7EB]/50 dark:border-slate-850/50 text-[10px] text-[#6B7280] dark:text-slate-400 font-semibold leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Article Detail Modal Overlay */}
      {activeArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF9F6]/60 dark:bg-slate-950/60 backdrop-blur-md transition-all duration-300 select-text">
          <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-premium relative text-left space-y-5 max-h-[85vh] overflow-y-auto">
            <button
              onClick={handleCloseArticle}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-[#6B7280] dark:text-slate-400 transition-colors focus:outline-none cursor-pointer"
              aria-label="Close Article"
              type="button"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">{activeArticle?.category}</span>
            <h3 className="text-xl font-bold text-[#2F3A3F] dark:text-slate-100 leading-tight">{activeArticle?.title}</h3>
            
            <div className="flex items-center gap-2 select-none">
              <span className="text-[9px] font-bold bg-[#FAF9F6] border border-slate-200/50 text-[#2F3A3F] dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350 px-2 py-0.5 rounded-full">
                {activeArticle?.duration}
              </span>
              <button
                onClick={() => activeArticle?.id && toggleBookmark(activeArticle.id)}
                className={`flex items-center gap-1 text-[9px] font-bold border px-2.5 py-0.5 rounded-full transition-colors focus:outline-none ${
                  activeArticle?.id && bookmarkedIds.includes(activeArticle.id)
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30'
                    : 'border-slate-200 dark:border-slate-850 text-slate-500'
                }`}
                type="button"
              >
                <Bookmark size={9} /> {activeArticle?.id && bookmarkedIds.includes(activeArticle.id) ? 'Saved' : 'Save'}
              </button>
            </div>

            <p className="text-sm font-semibold text-[#2F3A3F] dark:text-slate-250 italic leading-relaxed border-l-2 border-[#6B8E7A] pl-3 py-1">
              "{activeArticle?.summary}"
            </p>

            <div className="text-xs sm:text-sm text-[#2F3A3F] dark:text-slate-300 leading-relaxed space-y-4 font-medium whitespace-pre-line">
              {activeArticle?.content}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 select-none">
              {activeArticle?.tags?.map(t => (
                <span key={t} className="text-[10px] font-bold bg-[#FAF9F6] border border-slate-200/50 text-[#2F3A3F] dark:bg-slate-950 dark:border-slate-850 dark:text-slate-400 px-3 py-1 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exercise Modal Overlay */}
      {activeExercise && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF9F6]/60 dark:bg-slate-950/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-premium relative text-center space-y-6">
            <button
              onClick={handleCloseExercise}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-[#6B7280] dark:text-slate-400 transition-colors focus:outline-none cursor-pointer"
              aria-label="Close Exercise"
              type="button"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-[10px] font-bold text-[#89A8B2] tracking-wider uppercase block">Active Exercise</span>
              <h3 className="text-lg font-bold text-[#2F3A3F] dark:text-slate-100">{activeExercise?.title}</h3>
            </div>

            {/* Breathing Exercises States Timer */}
            {(activeExercise?.id === '478_breath' || activeExercise?.id === 'box_breath') && (
              <div className="space-y-6 py-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#6B8E7A]/40 dark:border-emerald-500/25 flex flex-col items-center justify-center mx-auto shadow-soft bg-[#FAF9F6] dark:bg-slate-950 transition-all duration-1000 scale-105 animate-pulse">
                  <span className="text-xs font-bold text-[#89A8B2] uppercase">Time</span>
                  <span className="text-3xl font-extrabold text-[#2F3A3F] dark:text-slate-100">{exerciseTimeLeft}s</span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-extrabold text-[#587665] dark:text-emerald-400 tracking-wide block uppercase animate-fade-in">{exerciseStage}</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400 font-semibold px-4">
                    Follow the visual pacing cycle. Breathe deep and calm your focus.
                  </p>
                </div>
              </div>
            )}

            {/* Grounding Exercise Steps */}
            {activeExercise?.id === '54321_grounding' && (
              <div className="space-y-6 py-4 text-left">
                <div className="p-4 bg-[#FAF9F6] dark:bg-slate-950 rounded-2xl border border-[#E5E7EB] dark:border-slate-850 space-y-2">
                  <span className="text-xs font-extrabold text-[#587665] dark:text-emerald-450 block">{groundingInstructions[groundingStep]?.label}</span>
                  <p className="text-xs text-[#2F3A3F] dark:text-slate-350 leading-relaxed font-semibold">
                    {groundingInstructions[groundingStep]?.desc}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-[#6B7280] font-bold">Step {groundingStep + 1} of 5</span>
                  {groundingStep < 4 ? (
                    <Button onClick={() => setGroundingStep(prev => prev + 1)} className="text-xs uppercase !px-4 !py-2">
                      Next Step
                    </Button>
                  ) : (
                    <Button onClick={handleCloseExercise} className="text-xs uppercase !px-4 !py-2">
                      Finish Exercise
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* PMR Steps */}
            {activeExercise?.id === 'pmr_relaxation' && (
              <div className="space-y-6 py-4 text-left">
                <div className="p-4 bg-[#FAF9F6] dark:bg-slate-950 rounded-2xl border border-[#E5E7EB] dark:border-slate-850 space-y-2">
                  <span className="text-xs font-extrabold text-[#587665] dark:text-emerald-450 block">Target: {pmrSteps[groundingStep]?.part}</span>
                  <p className="text-xs text-[#2F3A3F] dark:text-slate-350 leading-relaxed font-semibold">
                    {pmrSteps[groundingStep]?.desc}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-[#6B7280] font-bold">Part {groundingStep + 1} of 4</span>
                  {groundingStep < 3 ? (
                    <Button onClick={() => setGroundingStep(prev => prev + 1)} className="text-xs uppercase !px-4 !py-2">
                      Next Group
                    </Button>
                  ) : (
                    <Button onClick={handleCloseExercise} className="text-xs uppercase !px-4 !py-2">
                      Finish Exercise
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};



const ResourcesWithBoundary = (props) => (
  <ErrorBoundary>
    <Resources {...props} />
  </ErrorBoundary>
);

export default ResourcesWithBoundary;
