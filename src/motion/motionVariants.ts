// motion/motionVariants.ts
import { Transition } from "framer-motion";

export const fadeInUp = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.9 },
};

export const transitionSpring = (delay = 0): Transition => ({
  type: "spring" as const, // 👈 forza il tipo letterale
  stiffness: 300,
  damping: 25,
  mass: 0.5,
  delay,
});
