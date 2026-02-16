"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName] = useState("Habeba");

  const isFrench = language === "fr";
  const firstLetter = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as "fr" | "en";
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = isFrench ? "en" : "fr";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const scrollToTool2 = () => {
    document.getElementById("tool-2")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-white tracking-wide">

      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-40 bg-white/60 border-b border-gray-200 backdrop-blur-md">
        <div className="flex items-center justify-between px-12 py-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={60}
            className="h-20 w-auto object-contain"
            priority
          />

          <div className="flex items-center gap-6 relative">

            {/* 🔔 BEIGE BELL */}
            <div className="relative cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-[#CFC3A5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#7A1E2C] border border-white" />
            </div>

            <span
              onClick={toggleLanguage}
              className="cursor-pointer text-sm text-gray-700 hover:text-black transition"
            >
              {isFrench ? "EN" : "FR"}
            </span>

            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-full bg-[#0F3D2E] text-white flex items-center justify-center cursor-pointer text-sm font-medium"
            >
              {firstLetter}
            </div>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-14 w-44 bg-white border border-gray-200 rounded-xl shadow-lg p-3"
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-gray-700 hover:text-red-600 transition"
                >
                  {isFrench ? "Se déconnecter" : "Log out"}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[2px]"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/80" />

      {/* TITLE */}
      <div className="relative z-10 pt-36 text-center">
        <h1 className="text-3xl md:text-4xl font-light leading-snug">
          {isFrench
            ? "Découvrez les services proposés par Nabous Academy"
            : "Discover the services offered by Nabous Academy"}
        </h1>
      </div>

      {/* TOOL 1 — LEFT SIDE */}
      <section className="relative z-10 min-h-screen flex items-start pt-28 px-10">
        <div className="w-full md:w-[85%]">

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 shadow-xl">
            <div className="grid md:grid-cols-2 gap-14 items-center">

              <div className="relative h-[350px] md:h-[350px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/tool-course.jpg" alt="Course" fill className="object-cover" />
              </div>

              <div>
                <div className="w-9 h-9 rounded-full border-2 border-[#0F3D2E] text-[#0F3D2E] flex items-center justify-center mb-4 font-semibold">
                  1
                </div>

                <h2 className="text-2xl md:text-3xl font-medium mb-6">
                  {isFrench
                    ? "Construction complète de formations professionnelles"
                    : "Complete Professional Course Builder"}
                </h2>

                <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-8">
                  {isFrench
                    ? "Créez des formations complètes incluant modules structurés, leçons détaillées, quiz interactifs et exercices pratiques."
                    : "Build structured professional training programs including modules, detailed lessons, interactive quizzes and practical exercises."}
                </p>

                <motion.button
                  onClick={() => router.push("/course")}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2 bg-[#0F3D2E] hover:bg-[#145A3C] transition rounded-full text-sm flex items-center gap-3 shadow-lg"
                >
                  {isFrench ? "Accéder au module" : "Access module"}
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ARROW */}
      <div className="flex justify-start pl-330 -mt-70 mb-14 relative z-20">
        <motion.div
          onClick={scrollToTool2}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="cursor-pointer w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg"
        >
          <span className="text-[#0F3D2E] text-xl font-semibold">↓</span>
        </motion.div>
      </div>

      {/* TOOL 2 — RIGHT SIDE */}
      <section
        id="tool-2"
        className="relative z-10 min-h-screen flex items-center justify-end px-6 md:pr-16 md:pl-0"
      >
        <div className="w-full md:w-[85%]">

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 shadow-xl">
            <div className="grid md:grid-cols-2 gap-14 items-center">

              <div>
                <div className="w-9 h-9 rounded-full border-2 border-[#0F3D2E] text-[#0F3D2E] flex items-center justify-center mb-4 font-semibold">
                  2
                </div>

                <h2 className="text-2xl md:text-3xl font-medium mb-6">
                  {isFrench
                    ? "Génération d’évaluations intelligentes"
                    : "Smart Assessment Generator"}
                </h2>

                <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-8">
                  {isFrench
                    ? "Générez automatiquement des quiz pédagogiques, mises en situation réalistes et exercices pratiques."
                    : "Automatically generate structured quizzes, real-life scenarios and practical exercises."}
                </p>

                <motion.button
                  onClick={() => router.push("/quiz")}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2 bg-[#0F3D2E] hover:bg-[#145A3C] transition rounded-full text-sm flex items-center gap-3 shadow-lg"
                >
                  {isFrench ? "Accéder au module" : "Access module"}
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </div>

              <div className="relative h-[350px] md:h-[350px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/quiz.jpg" alt="Assessment" fill className="object-cover" />
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
