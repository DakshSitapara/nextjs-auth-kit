
"use client";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="items-center-safe  dark:bg-black ">
    <section
      className="relative flex flex-col items-center justify-center py-49"
      aria-label="Nextjs Starter Kit Hero"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full  bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="space-y-6 text-center max-w-4xl px-4">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 px-4 py-1 mb-6"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
            <Sparkles className="h-4 w-4" />
            <span>The Ultimate Next.js Starter Kit</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white animate-gradient-x pb-2"
        >
          Build Faster with <br className="hidden sm:block" />
          Next Starter
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-2xl mx-auto"
        >
        This is a Demo Next.js starter kit.
        </motion.p> 

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-4 pt-4"
        >
          <Link href="/login">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 h-12"
            >
              Get Started 
           <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link
            href="https://github.com/DakshSitapara/next.js-starter_kit"
            target="_blank"
            className="flex items-center gap-2 rounded-full px-6 py-2 h-12 border-2 text-gray-300 data:text-gray-300: bg-gray-950 hover:bg-gray-800 dark:hover:bg-gray-800 transition-colors"
            aria-label="View on GitHub"
          >
            <Github className="w-5 h-5 bg-transparent" aria-label="GitHub icon" />
            <span>Star on GitHub</span>
          </Link>
        </motion.div>
      </div>
    </section>
    </div>
  );
}
