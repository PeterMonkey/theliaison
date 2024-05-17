import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";

import { TailwindIndicator } from "~/components/tailwind-indicator";
import { cn } from "~/lib/utils";
import { Providers } from "~/components/providers";

export const metadata = {
	title: "Ask The Liaison - Social Polling",
	description:
		"Social Polling is a web application that allows users to create polls and vote on them.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn("font-sans antialiased", GeistSans.variable)}>
				<Providers>
					<div className="dark text-foreground bg-background">{children}</div>
				</Providers>
				<TailwindIndicator />
				{process.env.NODE_ENV === "production" ? (
					<>
						<Analytics />
						<SpeedInsights />
					</>
				) : null}
			</body>
		</html>
	);
}
