import { Card, CardHeader, CardTitle, CardContent } from "@theliaison/ui/card";
import { Badge } from "@theliaison/ui/badge";
//import { Progress } from "@theliaison/ui/progress"
import { Truck, Package, CheckCircle } from "lucide-react";

export default function TrackingSent() {
  const trackingInfo = {
    trackingNumber: "1Z999AA1234567890",
    status: "In transit",
    estimatedDelivery: "2023-05-15",
    events: [
      { date: "2023-05-10", description: "Package received" },
      { date: "2023-05-12", description: "In transit" },
      { date: "2023-05-14", description: "Out for delivery" },
    ],
  };

  return (
    <Card className="w-full max-w-md bg-background text-foreground border-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Package tracking</span>
          <Badge variant="secondary">{trackingInfo.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Tracking Number:</span>
            <span>{trackingInfo.trackingNumber}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Estimated delivery:</span>
            <span>{trackingInfo.estimatedDelivery}</span>
          </div>
          <div className="mt-8">
            <h4 className="font-semibold mb-2">Sender</h4>
            <span>Pedro Fernandez</span>
          </div>
          {/* <div className="mt-6">
            <h4 className="font-semibold mb-2">Shipping history</h4>
            <div className="space-y-3">
              {trackingInfo.events.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{event.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}