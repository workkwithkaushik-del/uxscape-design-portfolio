import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/** Parallax wrapper, translates child on Y as it scrolls through viewport. */
export function Parallax({
  children,
  className,
  offset = 80,
}: {
  children: ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Fade + rise on enter. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Card that rotates in 3D as it scrolls through the viewport. */
export function ScrollFlipCard({
  children,
  className,
  axis = "x",
  strength = 14,
}: {
  children: ReactNode;
  className?: string;
  axis?: "x" | "y";
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rot: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [strength, 0, -strength]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.97]);
  return (
    <motion.div
      ref={ref}
      style={{
        [axis === "x" ? "rotateX" : "rotateY"]: rot,
        scale,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
