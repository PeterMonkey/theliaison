import { env } from "~/env";
import { client as locationsClient } from "@theliaison/fedex/fetch/locations";
import { getAccessToken } from "@theliaison/fedex/fetch/authorization";
import { nanoid } from "~/utils";

export async function getFedexLocations(recipientZipCode: string) {
	const authToken = await getAccessToken(
		env.FEDEX_TEST_API_KEY,
		env.FEDEX_TEST_SECRET_KEY,
	);

	if (!authToken) {
		throw new Error("No auth token");
	}

	console.log("authToken", authToken);

	const transactionId = nanoid();
	const response = await locationsClient.POST("/location/v1/locations", {
		params: {
			header: {
				"content-type": "application/json",
				authorization: authToken,
				"x-customer-transaction-id": transactionId,
				"x-locale": "en_US",
			},
		},
		body: {
			location: {
				address: {
					postalCode: recipientZipCode,
					countryCode: "US",
				},
			},
		},
	});

	console.log("response", response.data);

	return response.data?.output;
}