import { cn } from "@theliaison/ui";

const dots = "mx-[1px] inline-block h-1 w-1 animate-blink rounded-md";

export const LoadingDots = ({ className }: { className: string }) => {
	return (
		<span className="mx-2 inline-flex items-center">
			<span className={cn(dots, className)} />
			<span className={cn(dots, "animation-delay-[200ms]", className)} />
			<span className={cn(dots, "animation-delay-[400ms]", className)} />
		</span>
	);
};
