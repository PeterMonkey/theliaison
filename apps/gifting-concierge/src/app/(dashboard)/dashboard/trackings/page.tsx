import TrackingCard from "./TrackingCard";
import TrackingSent from "./TrackingSent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@theliaison/ui/tabs";
//import { getTrackingStatus } from "./action";

export default async function GiftTracking() {
  // const {
  //   _deliveryStatus,
  //   _delivaryHistory,
  //   trackingNumber,
  //   trackerRequest,
  //   trackerAuthorization,
  // } = await getTrackingStatus("128667043726");

  // console.log(_deliveryStatus);
  // console.log(_delivaryHistory);
  // console.log(trackingNumber);
  // console.log(trackerRequest); ///borrar
  // console.log(trackerAuthorization); ///borrar
  return (
    <div>
      <Tabs className="m-3" defaultValue="my-gifts">
        <div className="flex items-center">
          <TabsList className="grid grid-flow-col grid-cols-2 bg-background w-64 h-10">
            <TabsTrigger className="h-full" value="my-gifts">
              My Gifts
            </TabsTrigger>
            <TabsTrigger className="h-full" value="gifts-sent">
              Gifts Sent
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="my-gifts">
          <TrackingCard />
        </TabsContent>
        <TabsContent value="gifts-sent">
          <TrackingSent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
