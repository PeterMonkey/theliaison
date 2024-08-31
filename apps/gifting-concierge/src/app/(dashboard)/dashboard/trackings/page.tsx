import TrackingCard from "./TrackingCard";
import { getTrackingStatus } from "./action";

export default async function GiftTracking() {
  const {
    _deliveryStatus,
    _delivaryHistory,
    trackingNumber,
    trackerRequest,
    trackerAuthorization,
  } = await getTrackingStatus("128667043726");

  console.log(_deliveryStatus);
  console.log(_delivaryHistory);
  console.log(trackingNumber);
  console.log(trackerRequest); ///borrar
  console.log(trackerAuthorization); ///borrar
  return <TrackingCard />;
}
