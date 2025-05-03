"use client";

import { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, HelpCircle, AlertCircle, Film, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();

  // Check localStorage for dark mode and session on load
  useEffect(() => {
    // Check dark mode
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, []);  // Removed router dependency

  // Update localStorage when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode)); // ✅ explicit conversion
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);


  // Simulate authentication check
  const handleLogin = (e:any) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      // Credential verification (to be replaced by a real API)
      if (email === 'admin@dreammaker.fr' && password === 'admin123') {
        // Store authentication in localStorage
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminEmail', email);
        // Redirect to dashboard with delay to ensure localStorage is updated
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 100);
      } else {
        setError('Incorrect credentials. Please try again.');
        setIsLoading(false);
      }
    }, 1000);
  };

  // Simulate reset email sending
  const handleForgotPassword = (e:any) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      console.log(`Reset email sent to administrator for: ${email}`);
      setEmailSent(true);
      setIsLoading(false);
    }, 1000);
  };

  // Conditional classes based on dark mode
  const pageClasses = darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-800';
  const cardClasses = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const inputClasses = darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800';
  const buttonBgClasses = "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg";

  return (
    <div className={`min-h-screen ${pageClasses} font-sans flex items-center justify-center p-4`}>
      <div className={`max-w-md w-full ${cardClasses} rounded-2xl shadow-xl p-8 border`}>
        {/* Logo and title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4 shadow-lg">
            <Film size={28} />
          </div>
          <h1 className="text-2xl font-bold text-center">
            <span className="font-light">Dreamaker Productions </span>
           
            <span className="block text-sm mt-1 font-normal text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Administration
            </span>
          </h1>
        </div>

        {forgotPasswordMode ? (
          emailSent ? (
            // Confirmation message for forgot password
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Mail size={28} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Request Sent</h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                An email has been sent to the administrator to reset your access. You will be contacted soon.
              </p>
              <button
                onClick={() => {
                  setForgotPasswordMode(false);
                  setEmailSent(false);
                }}
                className={`w-full py-3 rounded-xl text-white transition-all ${buttonBgClasses} flex items-center justify-center gap-2`}
              >
                Back to Login <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            // Forgot password form
            <div>
              <h2 className="text-xl font-semibold mb-2">Forgot Password</h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter your email below to contact the administrator to reset your access.
              </p>
              
              {error && (
                <div className={`p-3 rounded-lg mb-4 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 flex items-center gap-2`}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleForgotPassword}>
                <div className="mb-6">
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all ${inputClasses}`}
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMode(false)}
                    className={`flex-1 py-3 rounded-xl border transition-all ${
                      darkMode 
                        ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 rounded-xl text-white flex items-center justify-center gap-2 ${buttonBgClasses} ${isLoading ? 'opacity-80' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Contact Admin
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  You can also contact the administrator directly at:
                </p>
                <a 
                  href="mailto:barrysanoussa19@gmail.com" 
                  className="block mt-1 font-medium text-blue-600 hover:underline"
                >
                  barrysanoussa19@gmail.com
                </a>
              </div>
            </div>
          )
        ) : (
          // Login form
          <div>
            <h2 className="text-xl font-semibold mb-2">Administrator Login</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Please log in to access the administration area
            </p>
            
            {error && (
              <div className={`p-3 rounded-lg mb-4 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 flex items-center gap-2`}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all ${inputClasses}`}
                    placeholder="admin@dreammaker.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all ${inputClasses}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-white flex items-center justify-center gap-2 ${buttonBgClasses} ${isLoading ? 'opacity-80' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Log in <ArrowRight size={16} />
                  </>
                )}
              </button>
              
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(true)}
                  className={`inline-flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                >
                  <HelpCircle size={16} className="mr-1" />
                  Forgot password?
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Toggle dark mode */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
          >
            {darkMode ? '🌞 Light mode' : '🌙 Dark mode'}
          </button>
        </div>
      </div>
    </div>
  );
}