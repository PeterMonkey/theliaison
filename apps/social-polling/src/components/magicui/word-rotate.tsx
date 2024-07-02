"use client";

import type { HTMLMotionProps } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@theliaison/ui";

interface WordRotateProps {
	words: string[];
	duration?: number;
	framerProps?: HTMLMotionProps<"p">;
	className?: string;
}

export default function WordRotate({
	words,
	duration = 2500,
	framerProps = {
		initial: { opacity: 0, y: -50 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 50 },
		transition: { duration: 0.25, ease: "easeOut" },
	},
	className,
}: WordRotateProps) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prevIndex) => (prevIndex + 1) % words.length);
		}, duration);

		// Clean up interval on unmount
		return () => clearInterval(interval);
	}, [words, duration]);

	return (
		<div className="overflow-hidden py-2">
			<AnimatePresence mode="wait">
				<motion.p key={words[index]} className={cn(className)} {...framerProps}>
					{words[index]}
				</motion.p>
			</AnimatePresence>
		</div>
	);
}
