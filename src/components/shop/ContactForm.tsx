"use client"

import { useState } from "react"

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error || "Could not send your message. Please try again.")
        setStatus("error")
        return
      }
      setStatus("success")
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch {
      setError("Could not send your message. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <p className="text-title-md font-bold text-on-surface mb-2">
          Thank you! Your message has been sent.
        </p>
        <p className="text-body-md text-on-surface-variant">
          We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    )
  }

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-label-md text-on-surface-variant mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-label-md text-on-surface-variant mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-label-md text-on-surface-variant mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className={inputClass}
          placeholder="How can we help?"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-label-md text-on-surface-variant mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          placeholder="Tell us more..."
        />
      </div>
      {status === "error" && (
        <div role="alert" className="bg-error-container/20 border border-error/30 rounded-lg px-4 py-3 text-body-sm text-on-surface">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-bold transition-all active:scale-95 hover:shadow-lg disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}