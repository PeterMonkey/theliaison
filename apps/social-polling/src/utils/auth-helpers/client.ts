import type { Provider } from "@supabase/supabase-js";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { getURL } from "../helpers";
import { createClient } from "../supabase/client";
import { redirectToPath } from "./server";

export async function handleRequest(
	e: React.FormEvent<HTMLFormElement>,
	requestFunc: (formData: FormData) => Promise<string>,
	router: AppRouterInstance | null = null,
): Promise<boolean> {
	// Prevent default form submission refresh
	e.preventDefault();

	const formData = new FormData(e.currentTarget);
	const redirectUrl: string = await requestFunc(formData);

	if (router) {
		// If client-side router is provided, use it to redirect
		router.push(redirectUrl);
	}
	// Otherwise, redirect server-side
	return await redirectToPath(redirectUrl);
}

export async function signInWithOAuth(e: React.FormEvent<HTMLFormElement>) {
	// Prevent default form submission refresh
	e.preventDefault();
	const formData = new FormData(e.currentTarget);
	const provider = String(formData.get("provider")).trim() as Provider;

	// Create client-side supabase client and call signInWithOAuth
	const supabase = createClient();
	const redirectURL = getURL("/auth/callback");
	await supabase.auth.signInWithOAuth({
		provider: provider,
		options: {
			redirectTo: redirectURL,
		},
	});
}
