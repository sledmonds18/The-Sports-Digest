"use client";

import { FormEvent, useState } from "react";

interface NewsletterProps {
  onSubmit?: (email: string) => void;
}

export function Newsletter({ onSubmit }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setStatus("success");
        setMessage(
          data.message || "Subscribed! Your first digest arrives soon."
        );
        onSubmit?.(email);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(
          data?.error || "Subscription could not be saved. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setMessage("Network error — please check your connection and retry.");
    }
  };

  return (
    <section className="nl2" aria-labelledby="nl-h">
      <div className="wrap">
        <h2 id="nl-h">Never Miss a Story</h2>
        <p>Join 850,000+ readers — your morning sports digest, free forever.</p>
        <form
          className="nlf"
          onSubmit={handleSubmit}
          aria-label="Newsletter signup form"
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle" && status !== "submitting") {
                setStatus("idle");
                setMessage("");
              }
            }}
            required
            aria-label="Email address"
            disabled={status === "submitting"}
          />
          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
        {message && (
          <p
            role="status"
            aria-live="polite"
            style={{
              marginTop: "0.75rem",
              fontSize: "0.9rem",
              color: status === "error" ? "#ffb4a2" : "inherit",
            }}
          >
            {status === "success" ? `✓ ${message}` : `✕ ${message}`}
          </p>
        )}
      </div>
    </section>
  );
}
