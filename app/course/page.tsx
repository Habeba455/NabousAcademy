"use client";

import { useState } from "react";
import Image from "next/image";
import PptxGenJS from "pptxgenjs";
import { motion, AnimatePresence } from "framer-motion";

type Step = "home" | "form" | "result";
type Mode = "4weeks" | "3months" | "udemy" | "ppt" | null;
type Lang = "fr" | "en";

export default function CourseBuilder() {
  const [step, setStep] = useState<Step>("home");
  const [mode, setMode] = useState<Mode>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [outputLang, setOutputLang] = useState<Lang>("en");
  const [formData, setFormData] = useState<any>({});
  const [generated, setGenerated] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const t = {
    en: {
      title: "AI Course Builder",
      subtitle:
        "Build powerful, structured academic and professional programs in minutes.",
      description:
        "Generate complete learning pathways, structured modules, pedagogical quizzes and presentation ready slides fully organized and adapted to your audience level.",
      choose: "Choose Your Program Type",
      formTitle: "Course Configuration",
      topic: "Course Topic",
      levelPlaceholder: "Select Level",
      levels: {
        high: "High School",
        university: "University",
        master: "Master"
      },
      resourcesPlaceholder: "Resources Availability",
      resourcesOptions: {
        low: "Low Resources",
        medium: "Medium Resources",
        advanced: "Advanced Resources"
      },
      generate: "Generate Program",
      generating: "Generating...",
      showQuiz: "Show Quiz",
      hideQuiz: "Hide Quiz",
      download: "Download PowerPoint",
      outputLang: "Generated Content Language",
      back: "Back"
    },
    fr: {
      title: "Générateur de Cours IA",
      subtitle:
        "Créez des programmes académiques et professionnels puissants en quelques minutes.",
      description:
        "Générez des parcours pédagogiques complets, modules structurés, quiz éducatifs et présentations prêtes à l'emploi adaptés à votre public.",
      choose: "Choisissez le type de programme",
      formTitle: "Configuration du cours",
      topic: "Sujet du cours",
      levelPlaceholder: "Sélectionner le niveau",
      levels: {
        high: "Lycée",
        university: "Université",
        master: "Master"
      },
      resourcesPlaceholder: "Disponibilité des ressources",
      resourcesOptions: {
        low: "Ressources limitées",
        medium: "Ressources moyennes",
        advanced: "Ressources avancées"
      },
      generate: "Générer le programme",
      generating: "Génération...",
      showQuiz: "Afficher le Quiz",
      hideQuiz: "Masquer le Quiz",
      download: "Télécharger PowerPoint",
      outputLang: "Langue du contenu généré",
      back: "Retour"
    }
  };

  const cleanText = (text: string) =>
    text ? text.replace(/#+\s?/g, "").trim() : "";

  const splitParagraphs = (text: string) =>
    cleanText(text)
      .split("\n")
      .filter((p) => p.trim() !== "");

  const handleGenerate = async () => {
    if (!formData.subject) return;
    setLoading(true);

    const res = await fetch("/api/generate-course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        subject: formData.subject,
        level: formData.level,
        resources: formData.resources,
        language: outputLang
      })
    });

    const data = await res.json();
    if (data.success) {
      setGenerated(data.data);
      setStep("result");
    }

    setLoading(false);
  };


/* ================= PROFESSIONAL CLEAN PPT ================= */

const handleDownloadPPT = async () => {
  if (!generated?.slides) return;

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  generated.slides.forEach((slideData: any) => {

    /* ===== Ensure bullets array ===== */
    let bullets: string[] = [];

    if (Array.isArray(slideData.content)) {
      bullets = slideData.content;
    } else if (typeof slideData.content === "string") {
      bullets = slideData.content
        .split("\n")
        .map((b: string) => b.replace(/^•\s*/, "").trim())
        .filter((b: string) => b.length > 0);
    }

    if (!bullets.length) return;

    /* ===== Split every 3 bullets ===== */
    for (let i = 0; i < bullets.length; i += 3) {

      const slide = pptx.addSlide();
      const chunk = bullets.slice(i, i + 3);

      /* Background */
      slide.background = { fill: "F9FAFB" };

      /* Accent Bar Left */
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 0.5,
        h: "100%",
        fill: { color: "0F766E" }
      });

      /* ===== TITLE (TOP) ===== */
      slide.addText(slideData.title || "", {
        x: 1.2,
        y: 0.6,
        w: 7.5,
        fontSize: 20,
        bold: true,
        color: "111827",
        fontFace: "Calibri"
      });

      /* ===== LOGO (INSIDE HEADER AREA) ===== */
      slide.addImage({
        path: "/logo.png",
        x: 8,
        y: 0.3,
        w: 1,
        h: 1
      });

      /* ===== UNDERLINE UNDER TITLE ===== */
      slide.addShape(pptx.ShapeType.rect, {
        x: 1.2,
        y: 1.25,
        w: 2,
        h: 0.06,
        fill: { color: "0F766E" }
      });

      /* ===== CONTENT (MOVE UP) ===== */
      slide.addText(
        chunk.map((b) => ({
          text: b,
          options: {
            bullet: true,
            fontSize: 14,
            fontFace: "Calibri",
            color: "374151"
          }
        })),
        {
          x: 1.2,
          y: 1.9,   
          w: 8.5,
          h: 4,
          lineSpacing: 22
        }
      );

      /* Footer */
      slide.addText("Nabous Academy", {
        x: 1.2,
        y: 6.8,
        fontSize: 9,
        color: "9CA3AF",
        fontFace: "Calibri"
      });
    }
  });

  await pptx.writeFile({
    fileName: `${generated.title || "Presentation"}.pptx`
  });
};

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-[12px] scale-110"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/75" />

      {/* HEADER */}
      <div className="absolute top-6 left-6 right-6 z-30 flex justify-between items-center">

        {step !== "home" ? (
          <button
            onClick={() =>
              step === "form" ? setStep("home") : setStep("form")
            }
            className="flex items-center gap-2 text-white border border-white/30 px-4 py-1 rounded-full backdrop-blur-md hover:bg-white/10 transition"
          >
            <span>←</span>
            <span>{t[lang].back}</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => setLang(lang === "fr" ? "en" : "fr")}
          className="text-white border border-white/40 px-4 py-1 rounded-full text-sm backdrop-blur-md hover:bg-white/10 transition"
        >
          {lang === "fr" ? "EN" : "FR"}
        </button>
      </div>
      <AnimatePresence mode="wait">

        {/* HOME */}
        {step === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-6"
          >
            <Image src="/logo.png" alt="Logo" width={170} height={170} />

            <h1 className="text-6xl font-bold mt-10 text-emerald-400">
              {t[lang].title}
            </h1>

            <p className="text-white/80 mt-6 max-w-3xl text-lg leading-8">
              {t[lang].subtitle}
            </p>

            <p className="text-white/60 mt-4 max-w-3xl">
              {t[lang].description}
            </p>

            <h2 className="mt-12 text-xl font-semibold text-emerald-300">
              {t[lang].choose}
            </h2>

            <div className="grid md:grid-cols-4 gap-6 mt-8 w-full max-w-6xl">
              {[
                {
                  key: "4weeks",
                  en: "4-Week Program\nStructured weekly progression.",
                  fr: "Programme 4 semaines\nProgression hebdomadaire structurée."
                },
                {
                  key: "3months",
                  en: "3-Month Intensive\nDeep academic structure.",
                  fr: "Programme 3 mois\nStructure académique approfondie."
                },
                {
                  key: "udemy",
                  en: "Structured Course + Quiz\nIncludes evaluation.",
                  fr: "Cours structuré + Quiz\nInclut une évaluation."
                },
                {
                  key: "ppt",
                  en: "PowerPoint Plan\nPresentation-ready format.",
                  fr: "Plan PowerPoint\nFormat prêt à présenter."
                }
              ].map((card, i) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={i}
                  onClick={() => {
                    setMode(card.key as Mode);
                    setStep("form");
                  }}
                  className="bg-[#1f2a25]/80 border border-emerald-700/40 rounded-xl p-6 cursor-pointer backdrop-blur-lg shadow-xl hover:shadow-emerald-800/40 transition whitespace-pre-line"
                >
                  {lang === "en" ? card.en : card.fr}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FORM */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 flex justify-center items-center min-h-screen px-6"
          >
            <div className="bg-[#1f2a25]/90 border border-emerald-700/50 p-12 rounded-2xl w-full max-w-xl shadow-2xl space-y-6">

              <h2 className="text-xl font-semibold text-emerald-300">
                {t[lang].formTitle}
              </h2>

              <input
                placeholder={t[lang].topic}
                className="w-full p-4 rounded-lg bg-black/40 border border-white/10"
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />

              <select
                className="w-full p-4 rounded-lg bg-black/40 border border-white/10"
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
              >
                <option value="">{t[lang].levelPlaceholder}</option>
                <option value="high">{t[lang].levels.high}</option>
                <option value="university">{t[lang].levels.university}</option>
                <option value="master">{t[lang].levels.master}</option>
              </select>

              <select
                className="w-full p-4 rounded-lg bg-black/40 border border-white/10"
                onChange={(e) =>
                  setFormData({ ...formData, resources: e.target.value })
                }
              >
                <option value="">{t[lang].resourcesPlaceholder}</option>
                <option value="low">{t[lang].resourcesOptions.low}</option>
                <option value="medium">{t[lang].resourcesOptions.medium}</option>
                <option value="advanced">{t[lang].resourcesOptions.advanced}</option>
              </select>

              {/* Output Language */}
              <div>
                <p className="text-sm mb-2">{t[lang].outputLang}</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={outputLang === "en"}
                      onChange={() => setOutputLang("en")}
                    />
                    English
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={outputLang === "fr"}
                      onChange={() => setOutputLang("fr")}
                    />
                    Français
                  </label>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full bg-emerald-700 py-4 rounded-lg hover:bg-emerald-600 transition"
              >
                {loading ? t[lang].generating : t[lang].generate}
              </button>
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {step === "result" && generated && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 max-w-5xl mx-auto py-24 px-6"
          >
            <h2 className="text-4xl font-bold text-center mb-16 text-emerald-400">
              {generated.title}
            </h2>

            {(generated.weeks || generated.modules)?.map(
              (item: any, i: number) => (
                <div key={i} className="mb-20">
                  <h3 className="text-2xl font-semibold text-emerald-300 mb-6">
                    {item.week_title || item.module_title}
                  </h3>

                  <div className="text-white/80 leading-9 text-lg space-y-6">
                    {splitParagraphs(
                      item.content || item.detailed_content
                    ).map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* QUIZ */}
            {mode === "udemy" && generated.quiz && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowQuiz(!showQuiz)}
                  className="bg-emerald-700 px-8 py-3 rounded-lg hover:bg-emerald-600 transition"
                >
                  {showQuiz ? t[lang].hideQuiz : t[lang].showQuiz}
                </button>
              </div>
            )}

            {showQuiz && generated.quiz && (
              <div className="mt-10 bg-[#1f2a25]/80 p-8 rounded-xl space-y-6">
                {generated.quiz.map((q: any, i: number) => (
                  <div key={i}>
                    <h4 className="font-semibold mb-3 text-lg">
                      {i + 1}. {q.question}
                    </h4>

                    {q.options.map((opt: string, oi: number) => (
                      <div key={oi} className="ml-6 text-white/70 mb-1">
                        • {opt}
                      </div>
                    ))}

                    <div className="mt-3 text-emerald-400 font-medium">
                      Answer: {q.correct_answer}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PPT PREVIEW */}
            {generated.slides && (
              <div className="mt-20 bg-[#1f2a25]/90 border border-emerald-700/50 p-10 rounded-2xl">

                <div className="flex justify-between items-center mb-8">

                  <button
                    onClick={() =>
                      setSlideIndex((prev) =>
                        prev === 0
                          ? generated.slides.length - 1
                          : prev - 1
                      )
                    }
                    className="text-white text-xl"
                  >
                    ◀
                  </button>

                  <h3 className="text-lg font-semibold text-center">
                    {generated.slides[slideIndex].title}
                  </h3>

                  <button
                    onClick={() =>
                      setSlideIndex((prev) =>
                        prev === generated.slides.length - 1
                          ? 0
                          : prev + 1
                      )
                    }
                    className="text-white text-xl"
                  >
                    ▶
                  </button>
                </div>

                <div className="space-y-4 text-white/80 leading-8">
                  {generated.slides[slideIndex].content.map(
                    (point: string, i: number) => (
                      <div key={i}>• {point}</div>
                    )
                  )}
                </div>

                <div className="text-center mt-8">
                  <button
                    onClick={handleDownloadPPT}
                    className="bg-emerald-700 px-8 py-3 rounded-lg hover:bg-emerald-600 transition"
                  >
                    {t[lang].download}
                  </button>
                </div>

              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
