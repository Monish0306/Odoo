"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TextReveal, AnimatedButton } from "@/components/AnimationComponents";

// TEMP: plain-text localStorage auth for local testing only — replace with real backend auth

/**
 * Screen 1 — Login / Signup
 * Palette: navy #2E4F66, mid-blue #7AAACE, sky #9ED8FF, cream #F5F5ED
 * Font: Sentient (display/headline) — add the Fontshare <link> in app/layout.tsx
 *
 * Paste at: app/login/page.tsx
 */

export default function Page() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
  }>({});

  // Success/info messages
  const [successMessage, setSuccessMessage] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSignUp = () => {
    const newErrors: typeof errors = {};
    setSuccessMessage("");
    setLoginError("");

    // Validate fields
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!email.includes("@")) newErrors.email = "Please enter a valid email";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Check for duplicate email
    const storedUsers = JSON.parse(localStorage.getItem("assetflow_users") || "[]");
    if (storedUsers.some((u: any) => u.email === email)) {
      setErrors({ email: "An account with this email already exists." });
      return;
    }

    // Save to localStorage
    const newUser = { name, phone, email, password };
    storedUsers.push(newUser);
    localStorage.setItem("assetflow_users", JSON.stringify(storedUsers));

    // Show success and switch to login
    setSuccessMessage("Account created — sign in below");
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setErrors({});
    setTimeout(() => setMode("login"), 500);
  };

  const handleSignIn = () => {
    setLoginError("");
    setErrors({});

    const storedUsers = JSON.parse(localStorage.getItem("assetflow_users") || "[]");
    const user = storedUsers.find((u: any) => u.email === email && u.password === password);

    if (user) {
      router.push("/dashboard");
    } else {
      setLoginError("Invalid email or password.");
      setPassword("");
    }
  };

  return (
    // --- Fade In: whole card fades + lifts in on mount ---
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5ED] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm bg-white border border-[#7AAACE]/20 rounded-lg p-8 shadow-sm"
      >
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-lg bg-[#2E4F66] text-white font-mono font-bold flex items-center justify-center mb-4 text-sm">
            AF
          </div>
          <h2 className="text-3xl font-bold text-[#2E4F66] text-center" style={{ fontFamily: "Sentient, serif" }}>
            <TextReveal
              text={mode === "login" ? "Sign in to AssetFlow" : "Create your account"}
            />
          </h2>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Track, allocate, and audit company assets
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-5">
            <p className="text-emerald-700 text-xs font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Signup: Full Name */}
        {mode === "signup" && (
          <>
            <label className="block text-xs font-semibold text-[#2E4F66] mb-2 uppercase tracking-wide">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-1 px-3.5 py-2.5 border border-[#7AAACE]/20 rounded-lg text-sm text-gray-700 placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-[#9ED8FF] focus:border-transparent
                         transition-all duration-200 bg-white"
              placeholder="Jane Doe"
            />
            {errors.name && (
              <p className="text-xs text-rose-600 mb-4">{errors.name}</p>
            )}
          </>
        )}

        {/* Signup: Phone Number */}
        {mode === "signup" && (
          <>
            <label className="block text-xs font-semibold text-[#2E4F66] mb-2 uppercase tracking-wide">
              Phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-1 px-3.5 py-2.5 border border-[#7AAACE]/20 rounded-lg text-sm text-gray-700 placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-[#9ED8FF] focus:border-transparent
                         transition-all duration-200 bg-white"
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-xs text-rose-600 mb-4">{errors.phone}</p>
            )}
          </>
        )}

        {/* Email */}
        <label className="block text-xs font-semibold text-[#2E4F66] mb-2 uppercase tracking-wide">
          Work email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-1 px-3.5 py-2.5 border border-[#7AAACE]/20 rounded-lg text-sm text-gray-700 placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-[#9ED8FF] focus:border-transparent
                     transition-all duration-200 bg-white"
          placeholder="name@company.com"
        />
        {errors.email && (
          <p className="text-xs text-rose-600 mb-4">{errors.email}</p>
        )}

        {/* Password */}
        <label className="block text-xs font-semibold text-[#2E4F66] mb-2 uppercase tracking-wide">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-1 px-3.5 py-2.5 border border-[#7AAACE]/20 rounded-lg text-sm text-gray-700 placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-[#9ED8FF] focus:border-transparent
                     transition-all duration-200 bg-white"
          placeholder="••••••••••"
        />
        {errors.password && (
          <p className="text-xs text-rose-600 mb-4">{errors.password}</p>
        )}
        {loginError && (
          <p className="text-xs text-rose-600 mb-4">{loginError}</p>
        )}

        {mode === "login" && (
          <div className="text-right mb-5">
            <button className="text-xs text-[#2E4F66] hover:text-[#2E4F66]/80 font-medium transition-colors">
              Forgot password?
            </button>
          </div>
        )}

        <AnimatedButton
          onClick={mode === "login" ? handleSignIn : handleSignUp}
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </AnimatedButton>

        {mode === "signup" && (
          <p className="text-xs text-gray-500 mt-3 text-center leading-relaxed">
            New accounts start as Employee. An admin assigns other roles later.
          </p>
        )}

        {/* Toggle login/signup */}
        <div className="mt-7 pt-5 border-t border-[#7AAACE]/20 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setSuccessMessage("");
                  setLoginError("");
                  setErrors({});
                }}
                className="text-[#2E4F66] font-semibold hover:text-[#1a2f42] transition-colors"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setSuccessMessage("");
                  setLoginError("");
                  setErrors({});
                  setName("");
                  setPhone("");
                  setEmail("");
                  setPassword("");
                }}
                className="text-[#2E4F66] font-semibold hover:text-[#1a2f42] transition-colors"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
