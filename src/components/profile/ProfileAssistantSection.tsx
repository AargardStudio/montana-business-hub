import React, { useState } from 'react';
import { Business } from '../../types';
import { Sparkles, Send } from 'lucide-react';

interface ProfileAssistantSectionProps {
  business: Business;
}

/** "AI Assistant" tab: grounded Q&A chat about the business's own profile data. */
export const ProfileAssistantSection: React.FC<ProfileAssistantSectionProps> = ({ business }) => {
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hello! I am the AI Assistant for ${business.name}. Ask me any question about their services, products, hours, credentials, or pricing!`,
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || isAiLoading) return;

    const question = aiQuestion.trim();
    setAiQuestion('');
    setAiChatHistory((prev) => [...prev, { role: 'user', text: question }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, question }),
      });
      const data = await res.json();
      setAiChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            data.answer ||
            "This information isn't currently listed on the business profile. Please contact the business directly.",
        },
      ]);
    } catch (err) {
      setAiChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `You can reach ${business.name} directly at ${business.contact.formattedPhone} or via WhatsApp.`,
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-full text-xs font-semibold mb-2">
          <Sparkles size={14} className="text-amber-600" />
          <span>AI Profile Assistant</span>
        </div>
        <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Ask About {business.name}</h2>
        <p className="text-xs text-stone-500">
          Answers are strictly verified and grounded in {business.name}'s official profile, services, and
          credentials.
        </p>
      </div>

      {/* Chat History Box */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 h-80 overflow-y-auto space-y-3">
        {aiChatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-stone-950 font-medium rounded-br-none'
                  : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-2xs'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isAiLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 text-stone-500 text-xs px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-2">
              <Sparkles size={14} className="animate-spin text-amber-500" />
              <span>Checking business facts...</span>
            </div>
          </div>
        )}
      </div>

      {/* Query Input */}
      <form onSubmit={handleAiAsk} className="flex gap-2">
        <input
          type="text"
          value={aiQuestion}
          onChange={(e) => setAiQuestion(e.target.value)}
          placeholder={`Ask: "Do they work outside Bozeman?", "What are their hours?", "How do I request a quote?"`}
          className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-hidden focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={isAiLoading || !aiQuestion.trim()}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Send</span>
          <Send size={14} />
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5 text-xs text-stone-500">
        <span className="font-semibold">Quick questions:</span>
        {[
          'What services do they offer?',
          'Are they open today?',
          'How long have they been in business?',
          'How can I message on WhatsApp?',
        ].map((q) => (
          <button
            key={q}
            onClick={() => {
              setAiQuestion(q);
            }}
            className="bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-[11px] text-stone-700 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
