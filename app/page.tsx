"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const isFrench = language === "fr";

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as "fr" | "en";
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  // Toggle language
  const handleLanguageChange = () => {
    const newLang = isFrench ? "en" : "fr";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">

      {/* ================= HEADER ================= */}
      <header
        className="
          absolute top-0 left-0 w-full z-40
          bg-white/70
          border-b border-gray-200
        "
      >
        <div className="flex items-center justify-between px-12 py-3">

          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Logo"
            width={300}
            height={120}
            className="h-20 w-auto object-contain"
            priority
          />

          <div className="flex items-center gap-8">

            {/* About */}
            <span
              className="
                relative cursor-pointer
                text-sm tracking-wide
                text-gray-800
                font-medium
              "
            >
              {isFrench ? "À propos" : "About"}
              <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#0F3D2E]" />
            </span>

            {/* Language */}
            <span
              onClick={handleLanguageChange}
              className="cursor-pointer text-sm tracking-wide text-gray-700 hover:text-black transition"
            >
              {isFrench ? "EN" : "FR"}
            </span>

            {/* Login */}
            <Link href="/login">
              <button
                className="
                  flex items-center gap-2
                  px-6 py-2
                  rounded-full
                  bg-[#0F3D2E]
                  hover:bg-[#145A3C]
                  transition-all duration-300
                  text-white
                  font-medium
                  text-sm
                "
              >
                {isFrench ? "Connexion" : "Log in"}
                <span>→</span>
              </button>
            </Link>

          </div>
        </div>
      </header>

      {/* ================= BACKGROUND ================= */}
      <div
        className="absolute inset-0 bg-cover bg-[center_44%] blur-[1px]"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/55" />

      {/* ================= HERO ================= */}
      <div className="relative z-10 flex items-center justify-center min-h-screen text-center text-white px-6 pt-40">
        <div className="max-w-3xl">

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="
              text-4xl md:text-5xl
              font-light
              leading-tight
              tracking-tight
              mb-6
            "
            style={{
              textShadow: "0px 0px 25px rgba(255,255,255,0.25)",
            }}
          >
            {isFrench
              ? "Une solution simple pour moderniser votre centre de formation"
              : "A modern solution for forward thinking training centers"}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="
              text-base md:text-lg
              text-gray-200
              leading-relaxed
              mb-12
            "
          >
            {isFrench
              ? "Organisez vos contenus, créez des supports pédagogiques et structurez vos parcours avec clarté."
              : "Organize your content, structure your courses, and streamline your training programs with clarity."}
          </motion.p>

          {/* Discover */}
          <Link href="/login">
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              className="
                px-8 py-3
                rounded-full
                bg-white/25
                backdrop-blur-md
                border border-white/40
                text-white
                text-sm
                tracking-wide
                shadow-lg
                transition
              "
            >
              {isFrench ? "Découvrir la plateforme" : "Discover the platform"}
            </motion.button>
          </Link>

        </div>
      </div>

    </div>
  );
}
