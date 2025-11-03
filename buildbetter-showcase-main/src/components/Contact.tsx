import React, { useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export default function Contact() {
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
  const [areaSqm, setAreaSqm] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.message.trim()) return "Message is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    setStatus("Sending...");
    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message
        })
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) {
        setStatus("Email sent! Thank you.");
        setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
      } else {
        const msg = (data && (data.error || data.message)) || res.statusText || "Unknown error";
        setError("Failed to send email: " + msg);
        setStatus(null);
      }
    } catch (err:any) {
      setError("Network error: " + (err?.message ?? String(err)));
      setStatus(null);
    } finally {
      setLoading(false);
      // clear status in 8s
      setTimeout(()=>{ setStatus(null); setError(null); }, 8000);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl mb-4">Contact Us</h2>
      {/* Tile Quote Calculator */}
      <div className="mb-6 p-4 border rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Quote Calculator</h3>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="areaSqm" className="block text-sm mb-1">Area (m²)</label>
            <input
              id="areaSqm"
              type="number"
              min="0"
              step="0.01"
              value={areaSqm}
              onChange={(e) => setAreaSqm(e.target.value)}
              placeholder="e.g. 12.5"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="whitespace-nowrap text-sm text-gray-700">@ R150/m²</div>
        </div>
        <div className="mt-3 text-sm">
          <span className="text-gray-600">Estimated cost:</span>{' '}
          <span className="font-semibold">R{(Math.max(0, Number(areaSqm) || 0) * 150).toFixed(2)}</span>
        </div>
      </div>
      <div className="mb-6 p-4 border rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Send us a message</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required className="flex-1 p-2 border rounded" />
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className="flex-1 p-2 border rounded" />
        </div>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required className="w-full p-2 border rounded" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="w-full p-2 border rounded" />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={6} className="w-full p-2 border rounded" />
        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Sending..." : "Send Quote"}</button>
        </div>
        {status && <p className="mt-2 text-green-700">{status}</p>}
        {error && <p className="mt-2 text-red-700">{error}</p>}
      </form>
      </div>
    </div>
  );
}