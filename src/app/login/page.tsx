'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const [step, setStep] = useState(1); // 1: Phone/Email, 2: OTP
  const [loginType, setLoginType] = useState('phone'); // 'phone' | 'email'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 1500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // VALID CREDENTIALS:
    // Phone: 9999999999 | OTP: 123456 | PIN: admin123
    // Email: admin@123.com | OTP: 123456 | PIN: admin123
    
    const isValid = 
      (loginType === 'phone' && phoneNumber === '9999999999' && otp === '123456' && securityPin === 'admin123') ||
      (loginType === 'email' && email === 'admin@123.com' && otp === '123456' && securityPin === 'admin123');

    setTimeout(() => {
      if (isValid) {
        document.cookie = `seva_admin_token=valid_token; max-age=86400; path=/`;
        router.push('/dashboard/seva-requests');
      } else {
        alert('Invalid credentials! Phone: 9999999999, Email: admin@123.com, OTP: 123456, PIN: admin123');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
        
        {/* LEFT SIDE - BIG LOGO */}
        <div className="lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 p-12 flex flex-col items-center justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          
          <div className="mb-8 flex flex-col items-center z-10">
            <Image 
              src="/logo.png" 
              alt="Sikkim Seva" 
              width={400} 
              height={160}
              className="mb-6 drop-shadow-2xl"
            />
            <div className="text-4xl font-black tracking-tight mb-2">SIKKIM SEVA</div>
            <div className="text-xl font-light opacity-90">Admin Portal</div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs opacity-75 z-10">
            © 2026 Sikkim Seva Portal
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div className="lg:w-1/2 p-12 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            
            {/* STEP 1: PHONE/EMAIL SELECTION */}
            {step === 1 && (
              <>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
                  <p className="text-gray-600 mb-8">Login with</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  {/* PHONE/EMAIL TOGGLE BUTTONS */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setLoginType('phone')}
                      className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        loginType === 'phone'
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Phone Number
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginType('email')}
                      className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        loginType === 'email'
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Email
                    </button>
                  </div>

                  {/* SINGLE INPUT FIELD */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {loginType === 'phone' ? 'Phone Number' : 'Email Address'}
                    </label>
                    <input
                      type={loginType === 'phone' ? 'tel' : 'email'}
                      value={loginType === 'phone' ? phoneNumber : email}
                      onChange={(e) => 
                        loginType === 'phone' 
                          ? setPhoneNumber(e.target.value)
                          : setEmail(e.target.value)
                      }
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500/20 focus:border-green-500 text-sm transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder={loginType === 'phone' ? '9999999999' : 'admin@123.com'}
                      required
                    />
                  </div>

                  {/* SEND OTP BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:from-green-700 hover:to-green-700 focus:ring-4 focus:ring-green-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending OTP...
                      </span>
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: OTP + SECURITY PIN */}
            {step === 2 && (
              <>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Login</h2>
                  <p className="text-gray-600 mb-8">
                    Enter OTP sent to {loginType === 'phone' ? phoneNumber : email}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* OTP */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      OTP (6 digits)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500/20 focus:border-green-500 text-sm transition-all duration-200 bg-gray-50/50 hover:bg-white text-center text-lg tracking-widest font-mono"
                      placeholder="123456"
                      required
                    />
                  </div>

                  {/* SECURITY PIN */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Security PIN
                    </label>
                    <input
                      type="password"
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500/20 focus:border-green-500 text-sm transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="admin123"
                      required
                    />
                  </div>

                  {/* BACK BUTTON */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-green-600 py-3 px-4 border border-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200"
                  >
                    ← Back to Login
                  </button>

                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:from-green-700 hover:to-green-700 focus:ring-4 focus:ring-green-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Logging In...
                      </span>
                    ) : (
                      'Login'
                    )}
                  </button>
                </form>

                <div className="text-center text-xs text-gray-500 space-y-1">
                  <p><strong>Demo Credentials:</strong></p>
                  <p>Phone: <code>9999999999</code></p>
                  <p>Email: <code>admin@123.com</code></p>
                  <p>OTP: <code>123456</code> | PIN: <code>admin123</code></p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
