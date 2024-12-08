import type { Variants } from 'framer-motion';

// Hero section animations
export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

export const heroTitleVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  }
};

export const heroDescriptionVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    }
  }
};

// Background pattern animation
export const backgroundPatternVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
  },
  visible: { 
    opacity: 0.1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut",
    }
  }
};

// Icon animations
export const floatingIconVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    scale: 0.5,
    y: 20,
    rotate: -30,
  }),
  visible: (i: number) => ({
    opacity: [0, 0.2, 0.1],
    scale: [0.5, 1.2, 1],
    y: [20, -10, 0],
    rotate: [-30, 10, 0],
    transition: {
      duration: 2,
      delay: i * 0.2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeOut",
    }
  })
};

// Grid animations
export const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

export const gridItemVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  }
};

// Header animations
export const headerVariants: Variants = {
  top: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    backdropFilter: "blur(0px)",
    boxShadow: "none",
    borderBottomColor: "rgba(0, 0, 0, 0)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  scrolled: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Card hover animations
export const cardHoverVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    }
  }
};

// Common transitions
export const springTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

export const easeTransition = {
  type: "ease",
  duration: 0.5,
};