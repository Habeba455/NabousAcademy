"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [language, setLanguage] = useState<"en" | "fr">("en");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as "en" | "fr";
    if (savedLang) setLanguage(savedLang);
  }, []);

  const isFrench = language === "fr";

  /* ================= LOGIN ================= */
  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // 👑 Admin condition
    if (
      email === "admin@platform.com" &&
      password === "Admin123!"
    ) {
      router.push("/admin");
      return;
    }

    // 👤 Any other user
    router.push("/dashboard");
  };

  /* ================= REGISTER ================= */
  const handleRegister = () => {
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-[1100px] h-[680px] bg-white rounded-3xl shadow-2xl flex overflow-hidden">

        <div className="w-1/2 flex flex-col justify-center px-20 py-16">

          <AnimatePresence mode="wait">

            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
              >

                <h2
                  className="text-4xl font-light mb-6 tracking-tight text-gray-900"
                  style={{ textShadow: "0 0 25px rgba(15,61,46,0.22)" }}
                >
                  {isFrench ? "Bon retour !" : "Welcome back!"}
                </h2>

                <p className="text-gray-500 mb-12 text-sm leading-relaxed">
                  {isFrench
                    ? "Connectez-vous pour accéder à votre espace."
                    : "Sign in to access your workspace."}
                </p>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isFrench ? "Adresse email" : "Email address"}
                  className="w-full mb-6 px-5 py-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/40 transition"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isFrench ? "Mot de passe" : "Password"}
                  className="w-full mb-4 px-5 py-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/40 transition"
                />

                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <div className="flex items-center justify-between mb-8 text-sm">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#0F3D2E] focus:ring-[#0F3D2E]/40"
                    />
                    {isFrench ? "Se souvenir de moi" : "Remember me"}
                  </label>

                  <span
                    onClick={() => router.push("/forgot-password")}
                    className="text-[#0F3D2E] cursor-pointer hover:underline font-medium"
                  >
                    {isFrench ? "Mot de passe oublié ?" : "Forgot password?"}
                  </span>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full py-4 rounded-xl bg-[#0F3D2E] text-white font-medium hover:bg-[#145A3C] transition"
                >
                  {isFrench ? "Connexion" : "Sign in"}
                </button>

                <p className="mt-10 text-sm text-gray-500">
                  {isFrench
                    ? "Vous n’avez pas encore de compte ?"
                    : "Don't have an account?"}{" "}
                  <span
                    onClick={() => {
                      setError("");
                      setIsLogin(false);
                    }}
                    className="text-[#0F3D2E] cursor-pointer font-medium hover:underline"
                  >
                    {isFrench ? "Créer un compte" : "Register"}
                  </span>
                </p>

              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >

                <h2
                  className="text-4xl font-light mb-6 tracking-tight text-gray-900"
                  style={{ textShadow: "0 0 25px rgba(15,61,46,0.22)" }}
                >
                  {isFrench ? "Créer un compte" : "Create account"}
                </h2>

                <p className="text-gray-500 mb-12 text-sm leading-relaxed">
                  {isFrench
                    ? "Commencez votre expérience dès maintenant."
                    : "Start your journey with us."}
                </p>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isFrench ? "Nom complet" : "Full name"}
                  className="w-full mb-6 px-5 py-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/40 transition"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isFrench ? "Adresse email" : "Email address"}
                  className="w-full mb-6 px-5 py-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/40 transition"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isFrench ? "Mot de passe" : "Password"}
                  className="w-full mb-8 px-5 py-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/40 transition"
                />

                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <button
                  onClick={handleRegister}
                  className="w-full py-4 rounded-xl bg-[#0F3D2E] text-white font-medium hover:bg-[#145A3C] transition"
                >
                  {isFrench ? "Créer" : "Register"}
                </button>

                <p className="mt-10 text-sm text-gray-500">
                  {isFrench
                    ? "Déjà inscrit ?"
                    : "Already registered?"}{" "}
                  <span
                    onClick={() => {
                      setError("");
                      setIsLogin(true);
                    }}
                    className="text-[#0F3D2E] cursor-pointer font-medium hover:underline"
                  >
                    {isFrench ? "Connexion" : "Login"}
                  </span>
                </p>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

        <div className="w-1/2 relative">
          <Image
            src="/new-auth.jpg"
            alt="Side"
            fill
            className="object-cover"
            priority
          />
        </div>

      </div>
    </div>
  );
}
