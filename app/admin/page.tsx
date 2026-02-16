"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ================= MOCK DATA ================= */

const revenueData = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 180000 },
  { month: "Mar", revenue: 150000},
  { month: "Apr", revenue: 220000 },
  { month: "May", revenue: 260000 },
  { month: "Jun", revenue: 310000 },
];

const userGrowth = [
  { name: "Week 1", users: 2000 },
  { name: "Week 2", users: 4500 },
  { name: "Week 3", users: 7000 },
  { name: "Week 4", users: 9800 },
];

const countryData = [
  { name: "France", value: 4000 },
  { name: "Germany", value: 3000 },
  { name: "Canada", value: 2000 },
  { name: "Egypt", value: 2500 },
];

const COLORS = ["#0F3D2E", "#145A3C", "#1F7A5E", "#3AAFA9"];

const usersTable = [
  { id: 1, name: "Emma Laurent", email: "emma@mail.com", role: "Instructor" },
  { id: 2, name: "Lucas Bernard", email: "lucas@mail.com", role: "Student" },
  { id: 3, name: "Amine Hassan", email: "amine@mail.com", role: "Admin" },
  { id: 4, name: "Sophie Martin", email: "sophie@mail.com", role: "Student" },
  { id: 5, name: "Karim Nader", email: "karim@mail.com", role: "Student" },
];

export default function AdminDashboard() {
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const isFrench = language === "fr";

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as "fr" | "en";
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleLanguageChange = () => {
    const newLang = isFrench ? "en" : "fr";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[3px]"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 px-24 py-24">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-white rounded-[40px] shadow-[0_25px_80px_rgba(0,0,0,0.25)] p-20"
        >

          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-20">

            <div className="flex items-center gap-8">
              <Image src="/logo.png" alt="Logo" width={200} height={60} />

              <div>
                <h1 className="text-6xl font-light text-gray-900 tracking-tight">
                  {isFrench ? "Analyse de la Plateforme" : "Platform Analytics"}
                </h1>

                <p className="text-gray-500 text-base mt-3">
                  {isFrench
                    ? "Février 2026 Vue globale des performances"
                    : "February 2026 Global Performance Overview"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLanguageChange}
                className="cursor-pointer text-sm bg-gray-100 px-6 py-2 rounded-full font-medium"
              >
                {isFrench ? "EN" : "FR"}
              </motion.span>

              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-7 py-2 rounded-full bg-[#0F3D2E] text-white text-sm"
                >
                  {isFrench ? "Retour" : "Back"}
                </motion.button>
              </Link>
            </div>
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-4 gap-12 mb-24">
            <MetricCard
              title={isFrench ? "Utilisateurs Actifs" : "Active Users"}
              value="8,942"
              change="+12%"
            />
            <MetricCard
              title={isFrench ? "Nouvelles Inscriptions" : "New Signups"}
              value="1,284"
              change="+18%"
            />
            <MetricCard
              title={isFrench ? "Revenus Mensuels" : "Monthly Revenue"}
              value="$31,000"
              change="+22%"
            />
            <MetricCard
              title={isFrench ? "Taux d’Engagement" : "Engagement Rate"}
              value="64%"
              change="+6%"
            />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-3 gap-12 mb-24">

            <ChartCard title={isFrench ? "Croissance des Revenus" : "Revenue Growth"}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0F3D2E" strokeWidth={3} />
              </LineChart>
            </ChartCard>

            <ChartCard title={isFrench ? "Croissance Utilisateurs" : "User Growth"}>
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#145A3C" />
              </BarChart>
            </ChartCard>

            <ChartCard title={isFrench ? "Utilisateurs par Pays" : "Users by Country"}>
              <PieChart>
                <Pie data={countryData} dataKey="value" outerRadius={95}>
                  {countryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartCard>

          </div>

          {/* USERS TABLE */}
          <div className="bg-gray-50 rounded-2xl p-10 shadow-inner">
            <h3 className="mb-6 font-medium text-gray-700 text-xl">
              {isFrench ? "Utilisateurs Récents" : "Recent Users"}
            </h3>

            <table className="w-full text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-3 text-left">ID</th>
                  <th className="text-left">{isFrench ? "Nom" : "Name"}</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">{isFrench ? "Rôle" : "Role"}</th>
                </tr>
              </thead>
              <tbody>
                {usersTable.map((user) => (
                  <motion.tr
                    key={user.id}
                    whileHover={{ backgroundColor: "#f1f5f9" }}
                    className="border-b"
                  >
                    <td className="py-3">{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

/* ================= METRIC CARD ================= */

function MetricCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-100 rounded-3xl p-10 text-center shadow-md"
    >
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-5xl font-bold mt-4 text-[#0F3D2E]">
        {value}
      </h2>
      <p className="mt-3 text-green-600 text-sm font-medium">
        {change} vs last month
      </p>
    </motion.div>
  );
}

/* ================= CHART CARD ================= */

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 rounded-3xl p-10 shadow-md"
    >
      <h3 className="mb-6 font-medium text-gray-700 text-lg">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </motion.div>
  );
}
