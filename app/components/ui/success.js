'use client';

import confetti from 'canvas-confetti';
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

const ConfettiContext = createContext({ fire: () => {} });

const ConfettiComponent = forwardRef((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    children,
    ...rest
  } = props;

  const instanceRef = useRef(null);
  const intervalRef = useRef(null);

  const canvasRef = useCallback(
    (node) => {
      if (node !== null) {
        if (instanceRef.current) return;
        instanceRef.current = confetti.create(node, {
          ...globalOptions,
          resize: true,
        });
      } else {
        if (instanceRef.current) {
          instanceRef.current.reset();
          instanceRef.current = null;
        }
      }
    },
    [globalOptions]
  );

  const fire = useCallback(
    async (opts = {}) => {
      try {
        await instanceRef.current?.({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          ...options,
          ...opts,
        });
      } catch (error) {
        console.error('Confetti error:', error);
      }
    },
    [options]
  );

  const api = useMemo(() => ({ fire }), [fire]);

  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (!manualstart) {
      intervalRef.current = setInterval(() => {
        fire();
      }, 1500); // Run every 1.5 seconds
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [manualstart, fire]);

  return (
    <ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} {...rest} />
      {children}
    </ConfettiContext.Provider>
  );
});

ConfettiComponent.displayName = 'Confetti';

export const Confetti = ConfettiComponent;
