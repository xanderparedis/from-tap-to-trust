"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { AppIcon } from "../_components/app-icon";

export function RefillRequest() {
  const [submitted, setSubmitted] = useState(false);
  const street = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  }

  return (
    <section className="refill-request section-space" aria-labelledby="refill-request-title">
      <div className="refill-request-copy">
        <span className="tile-icon"><AppIcon name="map" /></span>
        <h2 id="refill-request-title">No public tap near you?</h2>
        <p>Let’s change that. Enter your address and help us bring a refill point to your neighbourhood.</p>
      </div>
      <div className="refill-request-content">
        <form className="refill-request-form" onSubmit={submit} hidden={submitted}>
          <label className="field refill-request-street">
            <span>Street and house number</span>
            <input ref={street} name="street" autoComplete="address-line1" required
              maxLength={160} pattern=".*\S.*" placeholder="E.g. Example Street 12" aria-describedby="refill-request-note" />
          </label>
          <label className="field">
            <span>Postcode</span>
            <input name="postcode" autoComplete="postal-code" inputMode="numeric" required
              pattern="[1-9][0-9]{3}" maxLength={4} placeholder="2000" title="Enter a four-digit Belgian postcode." />
          </label>
          <label className="field">
            <span>City or municipality</span>
            <input name="city" autoComplete="address-level2" required maxLength={100}
              pattern=".*\S.*" placeholder="E.g. Antwerp" />
          </label>
          <button className="button refill-request-submit" type="submit">Request a public tap</button>
        </form>
        <div className="refill-request-confirmation" role="status" aria-live="polite" aria-atomic="true">
          {submitted && <div className="motion-reveal">
            <p className="refill-request-success">Your request has been submitted!</p>
            <p>Thank you for helping us imagine more places to refill.</p>
            <button className="text-link" type="button" onClick={() => {
              setSubmitted(false);
              window.requestAnimationFrame(() => street.current?.focus());
            }}>Suggest another location</button>
          </div>}
        </div>
        <p id="refill-request-note" className="refill-request-note">Demo only. Your address is not sent or saved.</p>
      </div>
    </section>
  );
}
