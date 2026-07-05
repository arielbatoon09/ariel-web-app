"use client";

import { motion } from "motion/react";

interface MotionSectionProps {
  children: React.ReactNode;
}

export function MotionSection({ children }: MotionSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
