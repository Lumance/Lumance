import { AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';

const letters = import.meta.env.VITE_WEBSITE_NAME.toUpperCase().split('');

export default function LoadingScreen({ onComplete }) {
    const progress = useMotionValue(0);
    const barWidth = useTransform(progress, (v) => `${v}%`);
    const [showLetters, setShowLetters] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            const current = progress.get();
            if (current < 100) {
                progress.set(current + 1);
            } else {
                clearInterval(interval);

                setTimeout(() => {
                    setShowLetters(false);

                    setTimeout(() => {
                        onComplete?.();
                    }, 800); //600
                }, 550); //500
            }
        }, 15);
        return () => setTimeout(clearInterval(interval), 500);
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-50 cursor-none flex flex-col items-center justify-center bg-dotted bg-black text-white"
            exit={{ opacity: 0, transition: { duration: 1, ease: [0.645, 0.045, 0.355, 1], delay: 0.3 } }}
        >
            {/* Animated Letters */}
            <div className="flex flex-col items-center justify-center">
                <AnimatePresence>
                    {showLetters && (
                        <motion.div
                            key="word"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{
                                scale: 1.07,
                                opacity: 0.1,
                            }}
                            transition={{
                                type: 'tween',
                                duration: 0.8,
                                ease: [0.645, 0.045, 0.355, 1],
                            }}
                            className="flex space-x-1 mb-4"
                        >
                            {letters.map((letter, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 2 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.21, duration: 0.4, ease: [0.645, 0.045, 0.355, 1] }}
                                    className="text-4xl font-satoshi tracking-wide"
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Keep bar outside AnimatePresence so it stays stable */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showLetters ? 1 : 0 }}
                    transition={{ duration: 0.1, ease: 'easeOut' }}
                    className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden"
                >
                    <motion.div
                        className="h-full rounded-full"
                        style={{
                            width: barWidth,
                            background: 'linear-gradient(to right, #B2F5EA, #81E6D9)',
                            boxShadow: '0 0 6px #81E6D9, 0 0 12px #B2F5EA',
                        }}
                    />
                </motion.div>
            </div>
        </motion.div >
    );
}