import { useSprings, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';

const SplitText = ({
  text = '',
  className = '',
  delay = 50,
  animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  easing = 'easeOutCubic',
  textAlign = 'center',
  heighlightsword = [],
  heighlightclass = '',
}) => {
  const words = text.split(' ').map(word => word.split(''));
  const letters = words.flat();

  const [toggle, setToggle] = useState(false);

  const springs = useSprings(
    letters.length,
    letters.map((_, i) => ({
      from: animationFrom,
      to: toggle ? animationTo : animationFrom,
      delay: i * delay,
      config: { easing },
    }))
  );

  useEffect(() => {
    setToggle(true);
  }, []);

  return (
    <p
      className={`split-parent inline overflow-hidden ${className}`}
      style={{ textAlign, whiteSpace: 'normal', wordWrap: 'break-word' }}
    >
      {words.map((word, wordIndex) => {
        const letterOffset = words
          .slice(0, wordIndex)
          .reduce((acc, w) => acc + w.length, 0);

        const isHighlighted = heighlightsword.includes(wordIndex + 1); // 1-based

        return (
          <span
            key={wordIndex}
            className={isHighlighted ? heighlightclass : ''}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            {word.map((letter, letterIndex) => {
              const index = letterOffset + letterIndex;

              return (
                <animated.span
                  key={index}
                  style={springs[index]}
                  className="inline-block transform transition-opacity will-change-transform"
                >
                  {letter}
                </animated.span>
              );
            })}
            <span className="inline-block w-[0.3em]">&nbsp;</span>
          </span>
        );
      })}
    </p>
  );
};

export default SplitText;
