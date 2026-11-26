"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { WaterMascot } from "./water-mascot";
import { MascotChat } from "./mascot-chat";
import type { GuideMessage } from "./mascot-chat";
import { answerWebsiteQuestion } from "./mascot-knowledge";

function welcome(): GuideMessage[] {
  const answer = answerWebsiteQuestion("");
  return [{ id: 0, role: "assistant", text: answer.text, answer }];
}

export function MascotHelper() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<GuideMessage[]>(welcome);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const id = "mascot-help-" + useId().replace(/:/g, "");
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLElement>(null);
  const exitTimer = useRef<number | null>(null);

  function ask(question: string) {
    setMessages(previous => {
      const context = [...previous].reverse().find(message => message.answer)?.answer;
      const answer = answerWebsiteQuestion(question, pathname, context);
      const nextId = (previous.at(-1)?.id ?? 0) + 1;
      return [...previous.slice(-37), { id: nextId, role: "user", text: question },
        { id: nextId + 1, role: "assistant", text: answer.text, answer }];
    });
  }

  useEffect(() => {
    const button = launcher.current;
    if (!button) return;
    function alignWithButton() {
      if (button) root.current?.style.setProperty("--helper-launcher-width", `${button.getBoundingClientRect().width}px`);
    }
    const size = new ResizeObserver(alignWithButton);
    size.observe(button);
    alignWithButton();
    return () => size.disconnect();
  }, []);

  const close = useCallback((restoreFocus = true) => {
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    if (restoreFocus) launcher.current?.focus({ preventScroll: true });
    if (!restoreFocus || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      setClosing(false);
      exitTimer.current = null;
      return;
    }
    const mascot = root.current?.querySelector(".animated-mascot");
    const panel = root.current?.querySelector(".mascot-helper-panel");
    if (mascot) root.current?.style.setProperty("--helper-exit-start", getComputedStyle(mascot).transform);
    if (panel) root.current?.style.setProperty("--helper-panel-exit-opacity", getComputedStyle(panel).opacity);
    setClosing(true);
    exitTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      exitTimer.current = null;
    }, 900);
  }, []);

  function show() {
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    exitTimer.current = null;
    setClosing(false);
    setOpen(true);
  }

  useEffect(() => {
    if (!open || closing) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const focus = window.setTimeout(() => {
      if (!root.current?.querySelector(".mascot-helper-panel")?.contains(document.activeElement)) {
        closeButton.current?.focus({ preventScroll: true });
      }
    }, reducedMotion ? 0 : 850);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focus);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closing, close]);

  useEffect(() => () => {
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
  }, []);

  return (
    <aside ref={root} className="mascot-helper" data-closing={closing} aria-label={"From Tap to Trust help"}>
      {open && (
        <div id={id} className="mascot-helper-popover" role="dialog" aria-modal="false" aria-labelledby={`${id}-title`} aria-hidden={closing || undefined} inert={closing}>
          <div className="mascot-helper-panel mascot-helper-chat-panel">
            <header className="mascot-helper-heading">
              <div>
                <p className="mascot-helper-eyebrow">Your website guide</p>
                <h2 id={`${id}-title`}>Ask your water guide</h2>
              </div>
              <button ref={closeButton} type="button" className="mascot-helper-close" onClick={() => close()} aria-label={"Close help"}>
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <MascotChat messages={messages} onAsk={ask} onReset={() => setMessages(welcome())} onNavigate={() => close(false)} />
          </div>
          <div className="mascot-helper-window"><WaterMascot /></div>
        </div>
      )}
      <button ref={launcher} type="button" className="mascot-helper-launcher" aria-expanded={open && !closing} aria-controls={open ? id : undefined} aria-haspopup="dialog" onClick={() => open && !closing ? close() : show()}>
        <span className="mascot-helper-question" aria-hidden="true">?</span>
        <span>{open && !closing ? "Close help" : "Need help?"}</span>
      </button>
    </aside>
  );
}
