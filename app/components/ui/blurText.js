import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const buildKeyframes = (from, steps) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = "",
  delay = 2000,
  className = "text-red-600",
  animateBy = "words",
  direction = "top",
  animationFrom,
  animationTo,
  easing = (t) => t,
  stepDuration = 0.35,
  loop = true,
  loopDelay = 0.5, // Delay between loops in seconds
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [animateKey, setAnimateKey] = useState(0); // For re-rendering animation

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );
  
  useEffect(() => {
    if (!loop) return;
    const interval = setInterval(() => {
      setAnimateKey((k) => k + 1);
    }, (totalDuration + loopDelay) * 5000);
    return () => clearInterval(interval);
  }, [totalDuration, loop, loopDelay]);

  return (
    <p className={`flex flex-wrap ${className}`}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        };

        return (
          <motion.span
            key={`${animateKey}-${index}`}
            className="inline-block will-change-[transform,filter,opacity]"
            initial={fromSnapshot}
            animate={animateKeyframes}
            transition={spanTransition}
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;
