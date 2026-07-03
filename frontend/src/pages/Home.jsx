import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BookOpen, Sparkles, Users, ArrowRight, Wind } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  return (
    <div className="space-y-36 md:space-y-48 py-12">
      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Side Copy */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B8E7A]/10 border border-[#6B8E7A]/20 text-[#6B8E7A] text-xs font-semibold uppercase tracking-wider">
            🌱 A Calming Space for Stressed Students
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2F3A3F] font-sans leading-[1.15] max-w-2xl">
            Your Safe Space During{' '}
            <span className="text-[#6B8E7A]">
              Stressful Semesters
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#6B7280] max-w-xl leading-relaxed">
            University can feel overwhelming. Unwind gives you a private space to reflect, understand your emotions, and build healthier habits—one day at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center pt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                Start Your Journey
                <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </a>
          </div>
        </div>

        {/* Right Side - Human-Centered Composition */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[380px] aspect-square rounded-[36px] bg-[#FAF7F2] border border-[#E5E7EB]/60 flex items-center justify-center overflow-hidden shadow-soft">
            
            {/* Concentric Calming Breathing Circles */}
            <div className="absolute w-64 h-64 rounded-full border border-[#6B8E7A]/10 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-[#6B8E7A]/8 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[#E8DCC8]/25 flex items-center justify-center text-[#6B8E7A]">
                  <Wind size={40} className="opacity-90" />
                </div>
              </div>
            </div>

            {/* Organic SVG Leaf Illustration */}
            <svg 
              className="absolute top-10 left-12 w-8 h-8 text-[#6B8E7A]/40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.8 8.1 6.8 9.4.4.1.8-.2.8-.7V12.7c-2.4 1.4-4.8 0-4.8 0S6 7 12 7c6 0 7.8 5.7 7.8 5.7s-2.4 1.4-4.8 0v8.1c0 .5.4.8.8.7C19.2 20.1 22 16.4 22 12c0-5.5-4.5-10-10-10z" />
            </svg>
            
            {/* Floating Mood Emojis & Journal Chips */}
            <div className="absolute top-8 left-6 bg-white px-3 py-1.5 rounded-full border border-[#E5E7EB] text-xs text-[#2F3A3F] font-semibold shadow-soft inline-flex items-center gap-1.5 animate-float">
              <span>🙂</span> Good Day
            </div>

            <div className="absolute bottom-6 left-8 bg-white px-3 py-1.5 rounded-full border border-[#E5E7EB] text-xs text-[#2F3A3F] font-semibold shadow-soft inline-flex items-center gap-1.5 animate-floatSlow">
              <span>😔</span> Rough Lecture
            </div>

            <div className="absolute top-16 right-6 bg-white px-3 py-1.5 rounded-full border border-[#E5E7EB] text-xs text-[#2F3A3F] font-semibold shadow-soft inline-flex items-center gap-1.5 animate-floatSlow">
              <span>😌</span> Feeling Better
            </div>

            <div className="absolute bottom-16 right-8 bg-[#E2EBE5] px-3 py-1.5 rounded-full border border-[#6B8E7A]/30 text-xs text-[#587665] font-semibold shadow-soft inline-flex items-center gap-1.5 animate-float">
              <span>📖</span> Journal Saved
            </div>

            {/* Tiny Handwritten note styling panel */}
            <div className="absolute top-1/2 left-6 bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-soft text-left max-w-[130px] animate-floatSlow">
              <span className="text-[10px] text-[#6B7280] font-medium tracking-wide block uppercase">Note</span>
              <p className="text-[11px] font-medium text-[#2F3A3F] mt-0.5 leading-normal">
                Take a deep breath before the study group.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Section */}
      <section id="features" className="space-y-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-[#89A8B2] uppercase tracking-wider">Features</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#2F3A3F] font-sans">
            Designed for Student Clarity
          </h2>
          <p className="text-[#6B7280] text-sm leading-relaxed">
            Unwind elements are styled like structured journal sections to give your mind a quiet place to organize.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-8 flex flex-col text-left space-y-4 hover:border-[#6B8E7A]/30">
            <div className="w-10 h-10 rounded-xl bg-[#6B8E7A]/10 flex items-center justify-center text-[#6B8E7A]">
              <Brain size={18} />
            </div>
            <h3 className="text-lg font-bold text-[#2F3A3F]">Mood Tracker</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Understand how you're feeling before the stress builds.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] font-semibold bg-[#E2EBE5] text-[#587665] px-2.5 py-1 rounded-full">
                Daily Check-In
              </span>
            </div>
          </Card>

          <Card className="p-8 flex flex-col text-left space-y-4 hover:border-[#6B8E7A]/30">
            <div className="w-10 h-10 rounded-xl bg-[#89A8B2]/10 flex items-center justify-center text-[#89A8B2]">
              <BookOpen size={18} />
            </div>
            <h3 className="text-lg font-bold text-[#2F3A3F]">Journal</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Write freely without pressure.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] font-semibold bg-[#E9EFF1] text-[#6E8B95] px-2.5 py-1 rounded-full">
                Private Logs
              </span>
            </div>
          </Card>

          <Card className="p-8 flex flex-col text-left space-y-4 hover:border-[#6B8E7A]/30">
            <div className="w-10 h-10 rounded-xl bg-[#E8DCC8]/30 flex items-center justify-center text-[#C8BBA5]">
              <Sparkles size={18} />
            </div>
            <h3 className="text-lg font-bold text-[#2F3A3F]">AI Reflection</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Receive gentle insights—not judgments.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] font-semibold bg-[#FAF7F2] text-[#C8BBA5] px-2.5 py-1 rounded-full">
                Gentle Guides
              </span>
            </div>
          </Card>

          <Card className="p-8 flex flex-col text-left space-y-4 hover:border-[#6B8E7A]/30">
            <div className="w-10 h-10 rounded-xl bg-[#6B8E7A]/10 flex items-center justify-center text-[#6B8E7A]">
              <Users size={18} />
            </div>
            <h3 className="text-lg font-bold text-[#2F3A3F]">Peer Support</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              You're never the only one.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] font-semibold bg-[#E2EBE5] text-[#587665] px-2.5 py-1 rounded-full">
                Shared Community
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. How It Works - Vertical Connected Timeline */}
      <section id="about" className="space-y-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-[#6B8E7A] uppercase tracking-wider">Methodology</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#2F3A3F] font-sans">
            How It Works
          </h2>
          <p className="text-[#6B7280] text-sm leading-relaxed">
            Our wellness flow is simplified into three stages to easily blend into your busy academic schedule.
          </p>
        </div>

        {/* Timeline container */}
        <div className="max-w-xl mx-auto relative pl-8 border-l-2 border-dashed border-[#E5E7EB]">
          {/* Step 1 */}
          <div className="relative mb-16">
            <div className="absolute -left-[41px] top-0.5 w-6 h-6 rounded-full bg-[#6B8E7A] border-4 border-white flex items-center justify-center shadow-soft" />
            <div className="space-y-2 text-left">
              <h3 className="text-lg font-bold text-[#2F3A3F]">Reflect</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Pause for a few minutes each day to record your mood indicators and note current study loads.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative mb-16">
            <div className="absolute -left-[41px] top-0.5 w-6 h-6 rounded-full bg-[#89A8B2] border-4 border-white flex items-center justify-center shadow-soft" />
            <div className="space-y-2 text-left">
              <h3 className="text-lg font-bold text-[#2F3A3F]">Understand</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Analyze mental health triggers and see historical trends through your wellness workspace.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-[41px] top-0.5 w-6 h-6 rounded-full bg-[#C8BBA5] border-4 border-white flex items-center justify-center shadow-soft" />
            <div className="space-y-2 text-left">
              <h3 className="text-lg font-bold text-[#2F3A3F]">Grow</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Apply peer-tested routines and customized AI summaries to reduce burnout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust Section */}
      <section className="space-y-16 max-w-4xl mx-auto">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-[#89A8B2] uppercase tracking-wider">Ethics</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#2F3A3F] font-sans">Why Students Trust Unwind</h2>
          <p className="text-[#6B7280] text-sm leading-relaxed">
            Your focus should be on learning, not worrying about privacy or social media distractions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 text-left space-y-2" hoverEffect={false}>
            <h3 className="font-bold text-base text-[#2F3A3F]">🔒 Private by Design</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Your reflections stay personal and secure.
            </p>
          </Card>
          <Card className="p-6 text-left space-y-2" hoverEffect={false}>
            <h3 className="font-bold text-base text-[#2F3A3F]">🚫 No Toxic Social Feed</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Focus entirely on yourself without distractions or comparisons.
            </p>
          </Card>
          <Card className="p-6 text-left space-y-2" hoverEffect={false}>
            <h3 className="font-bold text-base text-[#2F3A3F]">❤️ Built Around Mental Wellness</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Every UI choice is designed to reduce stress, not create visual noise.
            </p>
          </Card>
          <Card className="p-6 text-left space-y-2" hoverEffect={false}>
            <h3 className="font-bold text-base text-[#2F3A3F]">💡 AI Supports, Never Judges</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Gentle insights that help you understand your patterns.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Call-To-Action Banner */}
      <section className="relative w-full rounded-3xl bg-[#6B8E7A] p-12 md:p-20 text-center text-white overflow-hidden shadow-soft">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold font-sans">
            Ready to find your academic balance?
          </h2>
          <p className="text-white/90 text-sm leading-relaxed">
            Create your account today and unlock tools tailored to help you handle semester stress. It takes less than a minute.
          </p>
          <div className="pt-4">
            <Link to="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold border-white/20 bg-white hover:bg-slate-50 text-[#2F3A3F]">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
