import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  strings: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delay?: number;
  loop?: boolean;
}

const Typewriter: React.FC<TypewriterProps> = ({
  strings,
  typeSpeed = 100,
  deleteSpeed = 50,
  delay = 1500,
  loop = true,
}) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % strings.length;
      const fullText = strings[i];
      
      const updatedText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);

      setText(updatedText);

      let timeoutDuration = isDeleting ? deleteSpeed : typeSpeed;
      
      if (!isDeleting && updatedText === fullText) {
        timeoutDuration = delay;
        setIsDeleting(true);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        timeoutDuration = 500; // Pause before starting next string
      }
      
      if (!loop && loopNum >= strings.length -1 && updatedText === fullText) {
         if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
         return;
      }

      typingTimeoutRef.current = window.setTimeout(handleTyping, timeoutDuration);
    };
    
    typingTimeoutRef.current = window.setTimeout(handleTyping, typeSpeed);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [text, isDeleting, loopNum, strings, typeSpeed, deleteSpeed, delay, loop]);

  return <span className="border-r-4 border-gray-800 pr-1">{text}</span>;
};

export default Typewriter;
