'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

/* 🔐 Supabase client (client-side) */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginType === 'email' ? email : null,
          phone: loginType === 'phone' ? phoneNumber : null,
        }),
      });

      if (!res.ok) throw new Error();

      setStep(2);
    } catch {
      alert('Invalid login attempt');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY LOGIN ---------------- */
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch('/api/admin/verify-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginType === 'email' ? email : null,
        phone: loginType === 'phone' ? phoneNumber : null,
        otp,
        pin: securityPin,
      }),
    });

    if (!res.ok) throw new Error();

    // ✅ Session is already created server-side
    router.push('/dashboard/seva-requests');
  } catch {
    alert('Invalid OTP or PIN');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white">

        {/* LEFT PANEL */}
        <div className="lg:w-1/2 bg-green-600 p-12 flex flex-col items-center justify-center text-white">
          <Image
            src="/logo.png"
            alt="Sikkim Seva"
            width={400}
            height={160}
            className="mb-6"
          />
          <h1 className="text-4xl font-black">SIKKIM SEVA</h1>
          <p className="text-xl opacity-90">Admin Portal</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-1/2 p-12 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h2 className="text-3xl font-bold text-center">
                  Admin Login
                </h2>

                {/* TOGGLE */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setLoginType('email')}
                    className={`flex-1 py-3 rounded-lg font-semibold ${
                      loginType === 'email'
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    Email
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginType('phone')}
                    className={`flex-1 py-3 rounded-lg font-semibold ${
                      loginType === 'phone'
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    Phone
                  </button>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  {/* INPUT */}
                  {loginType === 'email' ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Admin email"
                      className="w-full px-4 py-4 border rounded-xl"
                      required
                    />
                  ) : (
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Admin phone number"
                      className="w-full px-4 py-4 border rounded-xl"
                      required
                    />
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold"
                  >
                    {loading ? 'Sending OTP…' : 'Send OTP'}
                  </button>
                </form>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2 className="text-3xl font-bold text-center">
                  Verify Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="OTP"
                    className="w-full px-4 py-4 border rounded-xl text-center tracking-widest"
                    required
                  />

                  <input
                    type="password"
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    placeholder="Security PIN"
                    className="w-full px-4 py-4 border rounded-xl"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full border border-green-600 text-green-600 py-3 rounded-xl"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold"
                  >
                    {loading ? 'Logging in…' : 'Login'}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
