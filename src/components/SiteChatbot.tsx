import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { asset } from '../lib/asset';
import { sendSlateMessage } from '../lib/slateChatApi';
import {
  emptyIntent,
  emptyLead,
  WHATSAPP_URL,
  type ChatTurn,
  type FlowStep,
  type IntentState,
  type LeadDraft,
} from '../lib/slateChatEngine';

type Msg = { id: string; role: 'bot' | 'user'; text: string };

const FAQ_QUICK = [
  'Book a demo',
  'JewelBiz',
  'CuraBiz',
  'RetailBiz',
  'Pricing',
  'Address',
] as const;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Floating assistant modeled on blrhissariamain Sunehri chat. */
export default function SiteChatbot() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(true);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Namaste! I’m SlateBiz AI. Ask about JewelBiz, CuraBiz, RetailBiz, demos, pricing — or leave details and our team will follow up.',
    },
  ]);
  const [lead, setLead] = useState<LeadDraft>(emptyLead());
  const [intent, setIntent] = useState<IntentState>(emptyIntent());
  const [step, setStep] = useState<FlowStep>('chat');
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const leadRef = useRef(lead);
  const intentRef = useRef(intent);
  const stepRef = useRef(step);
  const historyRef = useRef(history);
  const busyRef = useRef(false);
  leadRef.current = lead;
  intentRef.current = intent;
  stepRef.current = step;
  historyRef.current = history;

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 7000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, open]);

  const handleUserText = (raw: string) => {
    const text = raw.trim();
    if (!text || busyRef.current) return;

    busyRef.current = true;
    setMessages((m) => [...m, { id: uid(), role: 'user', text }]);
    setInput('');
    setTyping(true);

    void (async () => {
      const prior = historyRef.current;
      const res = await sendSlateMessage({
        message: text,
        history: prior,
        lead: leadRef.current,
        intent: intentRef.current,
        step: stepRef.current,
      });
      setLead(res.lead);
      setIntent(res.intent);
      setStep(res.step);
      const nextHistory: ChatTurn[] = [
        ...prior,
        { role: 'user', content: text },
        { role: 'assistant', content: res.reply },
      ].slice(-24);
      setHistory(nextHistory);
      setMessages((m) => [...m, { id: uid(), role: 'bot', text: res.reply }]);
      setTyping(false);
      busyRef.current = false;
    })();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleUserText(input);
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-[120] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {hint && !open ? (
        <div className="max-w-[230px] rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
          Hey — need a product demo or quick answer?
        </div>
      ) : null}

      {open ? (
        <div
          className="flex h-[min(540px,72vh)] w-[min(370px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]"
          role="dialog"
          aria-label="Chat with SlateBiz AI"
        >
          <header className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2.5">
            <img
              src={asset('/services/slatebiz-ai-wordmark.png')}
              alt="SlateBiz AI — Business Chatbot"
              className="h-11 w-auto max-w-[min(260px,78%)] object-contain object-left"
            />
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#FF641F]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F7F9FC] px-3 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-[12px] px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#0B1C2C] text-white'
                      : 'border border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing ? (
              <div className="flex justify-start">
                <div className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-500">
                  Typing…
                </div>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-100 bg-white px-3 py-2">
            <div className="flex flex-wrap gap-1.5">
              {FAQ_QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleUserText(q)}
                  className="rounded-full border border-[#0C69B6]/25 px-2.5 py-1 text-[10px] tracking-wide text-slate-700 transition-colors hover:border-[#FF641F] hover:text-[#E55A18]"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-[8px] border border-slate-200 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-800 transition-colors hover:border-[#25D366] hover:text-[#128C7E]"
              >
                WhatsApp
              </a>
              <Link
                to="/contact/#contact-form"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-[8px] bg-[#FF641F] py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#E55A18]"
              >
                Book demo
              </Link>
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex border-t border-slate-100 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[13px] text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Send"
              className="px-3 text-[#FF641F] transition-colors hover:text-[#E55A18]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3.4 20.6 21 12 3.4 3.4l.1 6.7L14 12l-10.5 1.9.1 6.7z" />
              </svg>
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        aria-label={open ? 'Close chat' : 'Open SlateBiz AI chat'}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          setHint(false);
        }}
        className="flex h-[56px] w-[56px] items-center justify-center overflow-hidden rounded-full bg-white text-slate-700 shadow-[0_10px_28px_rgba(11,28,44,0.28)] ring-4 ring-white transition-transform hover:scale-105 sm:h-16 sm:w-16"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <img
            src={asset('/services/slatebiz-ai-round.png')}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </button>
    </div>
  );
}
