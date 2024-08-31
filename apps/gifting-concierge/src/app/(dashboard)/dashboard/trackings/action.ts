import { client as trackClient } from "@theliaison/fedex/fetch/track";
import { getAccessToken } from "@theliaison/fedex/fetch/authorization";
import { nanoid } from "ai";
import { env } from "~/env";

export async function getTrackingStatus(trackingNumber: string) {
	const trackerAuthorization = (await getAccessToken(
		env.FEDEX_TEST_TRACKING_API_KEY,
		env.FEDEX_TEST_TRACKING_SECRET_KEY,
	)) as string;

	const trackerRequest = await trackClient.POST("/track/v1/trackingnumbers", {
		params: {
			header: {
				"content-type": "application/json",
				authorization: trackerAuthorization,
				"x-locale": "en_US",
				"x-customer-transaction-id": nanoid(),
			},
		},
		body: {
			includeDetailedScans: true,
			trackingInfo: [
				{
					trackingNumberInfo: {
						trackingNumber: trackingNumber,
					},
				},
			],
		},
	});

	// important data about the delivery status
	const track = trackerRequest.data?.output?.completeTrackResults;
	const _deliveryStatus =
		track?.[0]?.trackResults?.[0]?.latestStatusDetail?.statusByLocale;
	// const _shipmentDeliveryType =
	// 	track?.[0]?.trackResults?.[0]?.estimatedDeliveryTimeWindow?.window;
	// const _shipmentDeliveryDescription =
	// 	track?.[0]?.trackResults?.[0]?.estimatedDeliveryTimeWindow?.description;
	const _delivaryHistory = track?.[0]?.trackResults?.[0]?.dateAndTimes;

	return {
		_deliveryStatus,
		_delivaryHistory,
		trackingNumber,
		trackerRequest,
		trackerAuthorization,
	};
}
