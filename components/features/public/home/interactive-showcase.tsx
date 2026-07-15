"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  ShoppingBag, Search, Play, Volume2, Maximize2, 
  Layout, Activity, Users, Settings, Plus,
  ArrowRight
} from "lucide-react";

type MockupType = "ecommerce" | "website" | "dashboard";

export default function InteractiveShowcase() {
  const [businessName, setBusinessName] = useState("");
  const [activeTab, setActiveTab] = useState<MockupType>("ecommerce");
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  
  const [isMobile, setIsMobile] = useState(true);
  const sampleName = "Global Co";
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoCycleRef = useRef<NodeJS.Timeout | null>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor screen size and clear timers on unmount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoCycleRef.current) clearTimeout(autoCycleRef.current);
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  // Auto-typing animation effect
  useEffect(() => {
    if (isUserInteracting) return;

    // If we're on Ecommerce and business name is not fully typed, let's type it
    if (activeTab === "ecommerce" && businessName !== sampleName) {
      const typingTimer = setTimeout(() => {
        const nextChar = sampleName.slice(0, businessName.length + 1);
        setBusinessName(nextChar);
      }, 150); // Speed of typing
      return () => clearTimeout(typingTimer);
    }
  }, [businessName, activeTab, isUserInteracting]);

  // Automated tab cycling effect
  useEffect(() => {
    if (isUserInteracting) return;

    // Define transition times
    const delay = 3500;
    if (activeTab === "ecommerce" && businessName !== sampleName) {
      // Don't start transition timer until typing is finished
      return;
    }

    autoCycleRef.current = setTimeout(() => {
      if (activeTab === "ecommerce") {
        setActiveTab("website");
      } else if (activeTab === "website") {
        setActiveTab("dashboard");
      } else {
        // Go back to Ecommerce, clear name to re-trigger typing
        setBusinessName("");
        setActiveTab("ecommerce");
      }
    }, delay);

    return () => {
      if (autoCycleRef.current) clearTimeout(autoCycleRef.current);
    };
  }, [activeTab, businessName, isUserInteracting]);

  const handleFocus = () => {
    setIsUserInteracting(true);
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    if (autoCycleRef.current) clearTimeout(autoCycleRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleBlur = () => {
    // When user clicks outside (blurs), wait 4 seconds then resume auto-cycling
    blurTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      // If blank, reset to ecommerce storefront to trigger the auto-typing simulation again
      if (businessName.trim() === "") {
        setActiveTab("ecommerce");
        setBusinessName("");
      }
    }, 4000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUserInteracting(true);
    setBusinessName(e.target.value);
    
    if (autoCycleRef.current) clearTimeout(autoCycleRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
  };

  const currentDisplayName = businessName || sampleName;
  const currentDomain = (businessName ? businessName.toLowerCase().replace(/[^a-z0-9]/g, "") : "globalco") + ".com";

  // Tab stack positions (clean 2D stacking to match screenshot and prevent 3D clipping)
  const getCardStyle = (tab: MockupType) => {
    const order: MockupType[] = ["ecommerce", "website", "dashboard"];
    const activeIdx = order.indexOf(activeTab);
    const tabIdx = order.indexOf(tab);
    
    // Calculate difference relative to active index
    const diff = (tabIdx - activeIdx + 3) % 3;

    if (isMobile) {
      // Mobile offsets: Rightward stacked layout centered nicely
      if (diff === 0) {
        return {
          zIndex: 30,
          x: "0%",
          y: "0%",
          scale: 1,
          opacity: 1,
        };
      } else if (diff === 1) {
        return {
          zIndex: 20,
          x: "6%",
          y: "-6%",
          scale: 0.95,
          opacity: 0.9,
        };
      } else {
        return {
          zIndex: 10,
          x: "12%",
          y: "-12%",
          scale: 0.90,
          opacity: 0.7,
        };
      }
    } else {
      // Desktop offsets: Leftward stacked layout to align back card perfectly with vertical section line
      if (diff === 0) {
        return {
          zIndex: 30,
          x: "-16%",
          y: "0%",
          scale: 1,
          opacity: 1,
        };
      } else if (diff === 1) {
        return {
          zIndex: 20,
          x: "-8%",
          y: "-8%",
          scale: 0.95,
          opacity: 0.9,
        };
      } else {
        return {
          zIndex: 10,
          x: "0%",
          y: "-16%",
          scale: 0.90,
          opacity: 0.7,
        };
      }
    }
  };

  return (
    <div className="relative hidden lg:flex min-h-[500px] w-full items-center justify-end py-6 lg:col-span-6 lg:pl-12 lg:pr-0">
      
      {/* 2D Stack Container */}
      <div 
        className="relative h-[320px] xs:h-[360px] sm:h-[420px] md:h-[450px] w-full max-w-sm sm:max-w-md lg:max-w-lg"
      >
        {/* ==================== 1. ECOMMERCE MOCKUP ==================== */}
        <motion.div
          animate={getCardStyle("ecommerce")}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          onClick={() => {
            if (activeTab !== "ecommerce") {
              setIsUserInteracting(true);
              setActiveTab("ecommerce");
            }
          }}
          className={`absolute inset-0 flex flex-col rounded-xl border bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden ${
            activeTab !== "ecommerce" ? "cursor-pointer" : ""
          }`}
        >
          {/* Browser Top Bar */}
          <div className="flex h-10 w-full items-center justify-between border-b border-neutral-100 bg-neutral-50/80 px-3.5 dark:border-neutral-900 dark:bg-neutral-900/60">
            {/* Dots */}
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            </div>
            {/* Address Bar */}
            <div className="flex h-6 w-3/5 items-center justify-center rounded-md bg-neutral-200/50 px-2 font-mono text-[9px] text-neutral-500 dark:bg-neutral-800/40 dark:text-neutral-400">
              <span className="truncate">{currentDomain}/store/home</span>
            </div>
            {/* Empty space for alignment */}
            <div className="w-10" />
          </div>

          {/* Ecommerce Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3 font-sans text-neutral-800 dark:text-neutral-100">
            {/* Navbar */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2 dark:border-neutral-900">
              <span className="text-xs font-black tracking-tight text-neutral-900 dark:text-white">
                {currentDisplayName}
              </span>
              <div className="flex gap-2.5 text-[9px] font-medium text-neutral-500 dark:text-neutral-400">
                <span className="text-neutral-950 dark:text-neutral-100 font-semibold border-b border-neutral-950 dark:border-white">Shop</span>
                <span>New</span>
                <span>Collections</span>
              </div>
              <div className="flex gap-2 text-neutral-400">
                <Search className="size-3" />
                <ShoppingBag className="size-3" />
              </div>
            </div>

            {/* Hero Banner */}
            <div className="mt-3 relative rounded-lg overflow-hidden h-20 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-neutral-200/30 border border-neutral-100 dark:border-neutral-900 flex items-center px-4">
              <div className="space-y-1">
                <span className="inline-block rounded-full bg-rose-500/10 px-2 py-0.5 text-[7px] font-bold text-rose-500 uppercase tracking-widest">
                  New Season
                </span>
                <h4 className="text-[10px] font-bold text-neutral-900 dark:text-white">
                  Spring Collection &apos;26
                </h4>
                <p className="text-[7px] font-medium text-neutral-600 dark:text-neutral-400 underline cursor-pointer">
                  Shop now &rarr;
                </p>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                <div className="h-12 w-8 rounded bg-neutral-200/50 dark:bg-neutral-800/80 shadow-sm" />
                <div className="h-12 w-8 rounded bg-neutral-300/40 dark:bg-neutral-800/40 shadow-sm" />
              </div>
            </div>

            {/* Featured Grid */}
            <div className="mt-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider">Featured Products</span>
                <span className="text-[8px] text-neutral-400 hover:text-neutral-600">View all &rarr;</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {/* Product 1 */}
                <div className="space-y-1">
                  <div className="aspect-square rounded-md bg-gradient-to-br from-neutral-100 to-neutral-200/50 dark:from-neutral-900 dark:to-neutral-900/50 border border-neutral-100/50 dark:border-neutral-900 flex items-center justify-center">
                    <span className="text-[10px] opacity-75">👕</span>
                  </div>
                  <div className="text-[7px] leading-tight">
                    <p className="font-semibold truncate">Canvas Tee</p>
                    <p className="text-neutral-500">$32</p>
                  </div>
                </div>
                {/* Product 2 */}
                <div className="space-y-1">
                  <div className="aspect-square rounded-md bg-gradient-to-br from-rose-100 to-orange-100 dark:from-neutral-900 dark:to-rose-950/20 border border-neutral-100/50 dark:border-neutral-900 flex items-center justify-center">
                    <span className="text-[10px] opacity-85">👟</span>
                  </div>
                  <div className="text-[7px] leading-tight">
                    <p className="font-semibold truncate">Sprint Runner</p>
                    <p className="text-neutral-500">$98</p>
                  </div>
                </div>
                {/* Product 3 */}
                <div className="space-y-1">
                  <div className="aspect-square rounded-md bg-gradient-to-br from-neutral-100 to-neutral-200/50 dark:from-neutral-900 dark:to-neutral-900/50 border border-neutral-100/50 dark:border-neutral-900 flex items-center justify-center">
                    <span className="text-[10px] opacity-75">🎒</span>
                  </div>
                  <div className="text-[7px] leading-tight">
                    <p className="font-semibold truncate">Tote Bag</p>
                    <p className="text-neutral-500">$45</p>
                  </div>
                </div>
                {/* Product 4 */}
                <div className="space-y-1">
                  <div className="aspect-square rounded-md bg-gradient-to-br from-slate-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
                    <span className="text-[10px] opacity-85">🧥</span>
                  </div>
                  <div className="text-[7px] leading-tight">
                    <p className="font-semibold truncate">Urban Parka</p>
                    <p className="text-neutral-500">$120</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ==================== 2. NORMAL WEBSITE (STREAM) MOCKUP ==================== */}
        <motion.div
          animate={getCardStyle("website")}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          onClick={() => {
            if (activeTab !== "website") {
              setIsUserInteracting(true);
              setActiveTab("website");
            }
          }}
          className={`absolute inset-0 flex flex-col rounded-xl border bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden ${
            activeTab !== "website" ? "cursor-pointer" : ""
          }`}
        >
          {/* Browser Top Bar */}
          <div className="flex h-10 w-full items-center justify-between border-b border-neutral-100 bg-neutral-50/80 px-3.5 dark:border-neutral-900 dark:bg-neutral-900/60">
            {/* Dots */}
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            </div>
            {/* Address Bar */}
            <div className="flex h-6 w-3/5 items-center justify-center rounded-md bg-neutral-200/50 px-2 font-mono text-[9px] text-neutral-500 dark:bg-neutral-800/40 dark:text-neutral-400">
              <span className="truncate">{currentDomain}/stream/home</span>
            </div>
            {/* Empty space */}
            <div className="w-10" />
          </div>

          {/* Website Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3 font-sans text-neutral-800 dark:text-neutral-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2 dark:border-neutral-900">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-rose-500 flex items-center justify-center text-[10px] text-white">📡</div>
                <span className="text-xs font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  {currentDisplayName} Stream
                </span>
              </div>
              <div className="flex gap-2.5 text-[8px] font-medium text-neutral-500 dark:text-neutral-400">
                <span>Browse</span>
                <span>Schedule</span>
                <span>Hosts</span>
              </div>
            </div>

            {/* Video Player Showcase */}
            <div className="mt-3 relative rounded-lg overflow-hidden aspect-[16/8] bg-black border border-neutral-800 flex flex-col justify-between p-2.5">
              {/* Top Stream Status */}
              <div className="flex justify-between items-start">
                <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[6px] font-bold text-white uppercase tracking-wider flex items-center gap-1 animate-pulse">
                  <span className="h-1 w-1 rounded-full bg-white" /> Live
                </span>
                <span className="text-[7px] text-neutral-300 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  1.2k watching
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all">
                <Play className="size-3 fill-white text-white ml-0.5" />
              </div>

              {/* Bottom Stream Controls */}
              <div className="flex justify-between items-center text-white">
                <div className="flex items-center gap-1">
                  <Volume2 className="size-2.5" />
                  <div className="h-1 w-8 bg-neutral-600 rounded-full">
                    <div className="h-full w-2/3 bg-rose-500 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[6px] text-neutral-300">Spring Launch Keynote</span>
                  <Maximize2 className="size-2.5" />
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded border border-neutral-100 p-2 text-center dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20">
                <p className="text-[6px] text-neutral-400 uppercase font-mono">Stream Quality</p>
                <p className="text-[9px] font-extrabold text-emerald-500 mt-0.5">1080p 60fps</p>
              </div>
              <div className="rounded border border-neutral-100 p-2 text-center dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20">
                <p className="text-[6px] text-neutral-400 uppercase font-mono">Peak Viewers</p>
                <p className="text-[9px] font-extrabold text-neutral-900 dark:text-white mt-0.5">4,812</p>
              </div>
              <div className="rounded border border-neutral-100 p-2 text-center dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20">
                <p className="text-[6px] text-neutral-400 uppercase font-mono">Bandwidth</p>
                <p className="text-[9px] font-extrabold text-neutral-900 dark:text-white mt-0.5">8.4 Gbps</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ==================== 3. DASHBOARD MOCKUP ==================== */}
        <motion.div
          animate={getCardStyle("dashboard")}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          onClick={() => {
            if (activeTab !== "dashboard") {
              setIsUserInteracting(true);
              setActiveTab("dashboard");
            }
          }}
          className={`absolute inset-0 flex flex-col rounded-xl border bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden ${
            activeTab !== "dashboard" ? "cursor-pointer" : ""
          }`}
        >
          {/* Browser Top Bar */}
          <div className="flex h-10 w-full items-center justify-between border-b border-neutral-100 bg-neutral-50/80 px-3.5 dark:border-neutral-900 dark:bg-neutral-900/60">
            {/* Dots */}
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            </div>
            {/* Address Bar */}
            <div className="flex h-6 w-3/5 items-center justify-center rounded-md bg-neutral-200/50 px-2 font-mono text-[9px] text-neutral-500 dark:bg-neutral-800/40 dark:text-neutral-400">
              <span className="truncate">{currentDomain}/app/dashboard</span>
            </div>
            {/* Empty space */}
            <div className="w-10" />
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 flex font-sans overflow-hidden">
            {/* Sidebar */}
            <div className="w-20 border-r border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/10 p-2 flex flex-col justify-between">
              <div className="space-y-2">
                {/* Logo Area */}
                <div className="flex items-center gap-1 border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
                  <div className="h-3 w-3 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center text-[6px] text-white dark:text-black">⚡</div>
                  <span className="text-[7px] font-black truncate">{currentDisplayName}</span>
                </div>
                {/* Nav Links */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 rounded bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 text-[7px] font-medium text-neutral-900 dark:text-white">
                    <Layout className="size-2" />
                    <span>Overview</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-1.5 py-0.5 text-[7px] font-medium text-neutral-400 dark:text-neutral-500">
                    <Activity className="size-2" />
                    <span>Analytics</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-1.5 py-0.5 text-[7px] font-medium text-neutral-400 dark:text-neutral-500">
                    <Users className="size-2" />
                    <span>Customers</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="flex items-center gap-1.5 px-1 text-[7px] text-neutral-400">
                <Settings className="size-2" />
                <span>Settings</span>
              </div>
            </div>

            {/* Core Area */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-neutral-900 dark:text-white font-sans">Analytics Portal</h4>
                <span className="rounded bg-neutral-900 text-white dark:bg-white dark:text-black text-[6px] font-bold py-0.5 px-1.5 flex items-center gap-1 cursor-pointer">
                  <Plus className="size-1.5" /> Invite
                </span>
              </div>

              {/* Dashboard stats cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border border-neutral-100/80 p-2 dark:border-neutral-900/80 bg-white dark:bg-neutral-950 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <p className="text-[6px] text-neutral-400">Monthly Revenue</p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[11px] font-extrabold text-neutral-900 dark:text-white">$14,800</span>
                    <span className="text-[5px] text-emerald-500 font-bold">+18%</span>
                  </div>
                </div>
                <div className="rounded border border-neutral-100/80 p-2 dark:border-neutral-900/80 bg-white dark:bg-neutral-950 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <p className="text-[6px] text-neutral-400">Conversion Rate</p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[11px] font-extrabold text-neutral-900 dark:text-white">3.42%</span>
                    <span className="text-[5px] text-emerald-500 font-bold">+4.1%</span>
                  </div>
                </div>
              </div>

              {/* Line graph mockup */}
              <div className="rounded border border-neutral-100 p-2.5 dark:border-neutral-900 bg-neutral-50/20 dark:bg-neutral-950">
                <p className="text-[6px] text-neutral-400 font-medium">Performance Metrics</p>
                <div className="mt-2 h-10 w-full flex items-end justify-between relative px-1">
                  {/* SVG line overlay for aesthetic graph */}
                  <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                    <path
                      d="M0,40 Q15,10 30,22 T60,10 T85,25 T100,5"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,40 Q15,10 30,22 T60,10 T85,25 T100,5 L100,40 L0,40 Z"
                      fill="url(#gradient-fill)"
                      opacity="0.08"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <linearGradient id="gradient-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Vertical Guideline lines */}
                  <div className="h-full border-r border-dashed border-neutral-200 dark:border-neutral-900 w-[1px]" />
                  <div className="h-full border-r border-dashed border-neutral-200 dark:border-neutral-900 w-[1px]" />
                  <div className="h-full border-r border-dashed border-neutral-200 dark:border-neutral-900 w-[1px]" />
                  <div className="h-full border-r border-dashed border-neutral-200 dark:border-neutral-900 w-[1px]" />
                  <div className="h-full border-r border-dashed border-neutral-200 dark:border-neutral-900 w-[1px]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Floating Interactive Input Card (Bottom-Left Overlay, inside relative container for perfect centering) */}
        <div className="absolute -bottom-12 left-0 z-40 w-[240px] rounded-2xl border border-neutral-200/50 bg-white/75 p-4 shadow-[0_15px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/80 md:w-[260px] lg:-left-12">
          <div className="flex items-center gap-1.5 mb-2 text-neutral-600 dark:text-neutral-400 font-mono text-[9px] uppercase tracking-wider font-semibold">
            <span>See it with your business</span>
            <ArrowRight className="size-3 text-neutral-400 animate-pulse" />
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={businessName}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleInputChange}
              placeholder={isUserInteracting ? "Type business name..." : sampleName}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white dark:focus:border-white dark:focus:ring-white"
            />
            {!isUserInteracting && (
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-3 w-[1.5px] bg-neutral-400"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
