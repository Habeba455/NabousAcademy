"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { jsPDF } from "jspdf";

export default function QuizPage() {
  const [language, setLanguage] = useState<"fr" | "en">("fr");

  // لغة التوليد مستقلة
  const [outputLanguage, setOutputLanguage] = useState<"fr" | "en">("fr");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("beginner");
  const [resources, setResources] = useState("medium");
  const [questionCount, setQuestionCount] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const [showAnswers, setShowAnswers] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [showExercise, setShowExercise] = useState(false);

  const isFrench = language === "fr";

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as "fr" | "en";
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = isFrench ? "en" : "fr";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  /* ===============================
     GENERATE
  =============================== */

  const handleGenerate = async () => {
    if (!subject)
      return alert(isFrench ? "Sujet requis" : "Subject required");

    setIsLoading(true);
    setGeneratedContent(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          description,
          level,
          resources,
          language: outputLanguage,
          questionCount: questionCount ? Number(questionCount) : 10,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedContent(data.data);
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  /* ===============================
     PDF EXPORT
  =============================== */

  const handleDownloadPDF = () => {
    if (!generatedContent) return;

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text(generatedContent.title || "Quiz", 20, y);
    y += 12;

    if (description) {
      doc.setFontSize(12);
      doc.text(description, 20, y);
      y += 10;
    }

    generatedContent.quiz?.forEach((q: any, index: number) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(`${index + 1}. ${q.question}`, 20, y);
      y += 8;

      q.options?.forEach((opt: string) => {
        doc.text(`- ${opt}`, 25, y);
        y += 6;
      });

      y += 6;
    });

    doc.save("quiz.pdf");
  };

  const handleReset = () => {
    setShowAnswers(false);
    setShowExplanations(false);
    setShowExercise(false);
  };

  /* ===============================
     UI
  =============================== */

  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[6px] scale-105"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/75" />

      {/* Header */}
      <div className="relative z-20 flex flex-col items-center px-10 py-6">

        {/* Top Row */}
        <div className="w-full flex justify-between items-center">
          <div />
          <Image src="/logo.png" alt="Logo" width={85} height={85} />
          <button
            onClick={toggleLanguage}
            className="px-4 py-1 rounded-full border border-white/20 text-sm hover:bg-white/10 transition"
          >
            {isFrench ? "EN" : "FR"}
          </button>
        </div>

        {/* 🔥 Text Under Logo */}
        <div className="text-center mt-6 max-w-3xl">
          <h1 className="text-3xl font-semibold mb-4">
            {isFrench
              ? "Générateur de quiz et d'exercices pédagogiques"
              : "Quiz and Educational Exercise Generator"}
          </h1>

          <p className="text-white/80 text-sm leading-relaxed">
            {isFrench
              ? "Crée des quiz pédagogiques et des exercices pratiques prêts à l’emploi (QCM, Vrai/Faux, mises en situation). Chaque exercice inclut consignes, livrables et critères d’évaluation. Idéal pour formateurs, enseignants et centres de formation."
              : "Create ready to use educational quizzes and practical exercises (MCQ, True/False, real life scenarios). Each exercise includes instructions, deliverables and evaluation criteria. Ideal for trainers, teachers and training centers."}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 grid lg:grid-cols-[40%_60%] gap-10">

        {/* LEFT PANEL */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">

          <h2 className="text-2xl font-semibold mb-8">
            {isFrench ? "Paramètres" : "Settings"}
          </h2>

          <div className="space-y-6">

            <input
              type="text"
              placeholder={isFrench ? "Sujet (Obligatoire)" : "Subject (Required)"}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
            />

            <textarea
              placeholder={
                isFrench
                  ? "Description (Optionnel)"
                  : "Description (Optional)"
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
            />

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
            >
              <option value="beginner">{isFrench ? "Débutant" : "Beginner"}</option>
              <option value="intermediate">{isFrench ? "Intermédiaire" : "Intermediate"}</option>
              <option value="advanced">{isFrench ? "Avancé" : "Advanced"}</option>
            </select>

            <select
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
            >
              <option value="low">{isFrench ? "Ressources faibles" : "Low resources"}</option>
              <option value="medium">{isFrench ? "Ressources moyennes" : "Medium resources"}</option>
              <option value="high">{isFrench ? "Ressources élevées" : "High resources"}</option>
            </select>

            <select
              value={outputLanguage}
              onChange={(e) => setOutputLanguage(e.target.value as "fr" | "en")}
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>

            <input
              type="number"
              min="1"
              placeholder={
                isFrench
                  ? "Nombre de questions (Optionnel - défaut 10)"
                  : "Number of questions (Optional - default 10)"
              }
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
            />

            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-emerald-700 rounded-xl hover:bg-emerald-600 transition"
            >
              {isLoading
                ? isFrench
                  ? "Génération..."
                  : "Generating..."
                : isFrench
                ? "Générer"
                : "Generate"}
            </button>

            {generatedContent && (
              <button
                onClick={handleDownloadPDF}
                className="w-full py-4 mt-3 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                {isFrench ? "Télécharger PDF" : "Download PDF"}
              </button>
            )}

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl overflow-y-auto">

          <h2 className="text-2xl font-semibold mb-6">
            {isFrench ? "Résultat" : "Result"}
          </h2>

          {isLoading && (
            <div className="text-center text-emerald-400 animate-pulse">
              {isFrench ? "Génération en cours..." : "Generating..."}
            </div>
          )}

          {generatedContent && !isLoading && (
            <>
              <div className="flex flex-wrap gap-3 mb-6">

                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    showAnswers ? "bg-emerald-600 shadow-md" : "bg-white/10"
                  }`}
                >
                  {isFrench ? "Afficher réponses" : "Show Answers"}
                </button>

                <button
                  onClick={() => setShowExplanations(!showExplanations)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    showExplanations ? "bg-emerald-600 shadow-md" : "bg-white/10"
                  }`}
                >
                  {isFrench ? "Afficher explications" : "Show Explanations"}
                </button>

                <button
                  onClick={() => setShowExercise(!showExercise)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    showExercise ? "bg-emerald-600 shadow-md" : "bg-white/10"
                  }`}
                >
                  {isFrench ? "Afficher exercice" : "Show Exercise"}
                </button>

                <button
                  onClick={handleReset}
                  className="px-3 py-1 bg-red-600 rounded-lg text-sm"
                >
                  {isFrench ? "Réinitialiser" : "Reset"}
                </button>

              </div>

              <div className="space-y-6 text-sm">
                {generatedContent.quiz?.map((q: any, index: number) => (
                  <div key={index} className="bg-white/10 p-4 rounded-xl">
                    <h3 className="font-semibold mb-3">{q.question}</h3>

                    {q.options?.map((opt: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-2 mb-2 rounded-lg border border-white/20"
                      >
                        {opt}
                      </div>
                    ))}

                    {showAnswers && (
                      <div className="text-green-400">
                        {isFrench ? "Réponse :" : "Answer:"} {q.answer}
                      </div>
                    )}

                    {showExplanations && (
                      <div className="text-gray-300">
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ======= ADDED EXERCISE DISPLAY ONLY ======= */}
              {showExercise && generatedContent.exercise && (
                <div className="mt-8 bg-white/10 p-6 rounded-xl border border-white/20">

                  <h3 className="font-semibold text-lg mb-4">
                    {isFrench ? "Exercice pratique" : "Practical Exercise"}
                  </h3>

                  <div className="mb-4">
                    <p className="font-semibold mb-1">
                      {isFrench ? "Objectif :" : "Objective:"}
                    </p>
                    <p>{generatedContent.exercise.objective}</p>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold mb-1">
                      {isFrench ? "Contexte :" : "Context:"}
                    </p>
                    <p>{generatedContent.exercise.context}</p>
                  </div>

                  {generatedContent.exercise.steps && (
                    <div className="mb-4">
                      <p className="font-semibold mb-1">
                        {isFrench ? "Étapes :" : "Steps:"}
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {generatedContent.exercise.steps.map(
                          (step: string, i: number) => (
                            <li key={i}>{step}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="font-semibold mb-1">
                      {isFrench ? "Livrable attendu :" : "Expected Deliverable:"}
                    </p>
                    <p>{generatedContent.exercise.deliverable}</p>
                  </div>

                  {generatedContent.exercise.evaluation && (
                    <div>
                      <p className="font-semibold mb-1">
                        {isFrench ? "Critères d’évaluation :" : "Evaluation Criteria:"}
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {generatedContent.exercise.evaluation.map(
                          (crit: string, i: number) => (
                            <li key={i}>{crit}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                </div>
              )}
              {/* ======= END ADDED PART ======= */}

            </>
          )}

        </div>
      </div>
    </div>
  );
}
