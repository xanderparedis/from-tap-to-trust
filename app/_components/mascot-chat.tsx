"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { GuideAnswer } from "./mascot-knowledge";

export type GuideMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  answer?: GuideAnswer;
};

export function MascotChat({ messages, onAsk, onReset, onNavigate }: {
  messages: GuideMessage[];
  onAsk: (question: string) => void;
  onReset: () => void;
  onNavigate: () => void;
}) {
  const [draft, setDraft] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const latest = messages.at(-1)?.answer;

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages]);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    onAsk(trimmed.slice(0, 500));
    setDraft("");
    input.current?.focus({ preventScroll: true });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(draft);
  }

  return <div className="mascot-chat">
    <div className="mascot-chat-toolbar">
      <p>Answers from this website</p>
      <button type="button" onClick={() => { onReset(); setDraft(""); input.current?.focus({ preventScroll: true }); }}
        disabled={messages.length === 1}>New chat</button>
    </div>
    <div ref={log} className="mascot-chat-log" role="log" aria-label="Conversation with your water guide" aria-live="polite" aria-relevant="additions">
      {messages.map(message => <article className={`mascot-chat-message mascot-chat-${message.role}`} key={message.id}>
        <span className="sr-only">{message.role === "user" ? "You" : "Water guide"}: </span>
        <p>{message.text}</p>
        {message.answer && message.answer.links.length > 0 && <nav className="mascot-chat-links" aria-label="Pages for this answer">
          {message.answer.links.map(link => <Link href={link.href} key={link.href} onClick={onNavigate}>{link.label}</Link>)}
        </nav>}
      </article>)}
    </div>
    <div className="mascot-chat-suggestions" aria-label="Suggested questions">
      {latest?.suggestions.slice(0, messages.length === 1 ? 3 : 2).map(question => (
        <button type="button" key={question} onClick={() => ask(question)}>{question}</button>
      ))}
    </div>
    <form className="mascot-chat-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="mascot-chat-question">Your question about the website</label>
      <input ref={input} id="mascot-chat-question" name="question" value={draft} maxLength={500}
        onChange={event => setDraft(event.target.value)} placeholder="Ask about the website…" autoComplete="off" enterKeyHint="send" />
      <button type="submit" disabled={!draft.trim()}>Ask</button>
    </form>
  </div>;
}
