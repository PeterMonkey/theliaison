
import StoreLocator from "./StoreLocator"
import { cn } from "@theliaison/ui";
import { buttonVariants } from "@theliaison/ui/button";
import { createClient } from "~/supabase/server"
import Link from "next/link";



export default async function AddressInfo({ params:{ giftId }}: { params:{ giftId: string } }) {
    

    const supabase = createClient();

	const { data, error,  } = await supabase
		.from("gifts")
		.select("id, recipient_id, sender_id")
		.eq("id", giftId)
		.single();


    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 my-40">
                <h1>This gift does not exist anymore.</h1>
                <Link
                    href="/dashboard/gifts"
                    className={cn(
                        buttonVariants(),
                        "bg-white text-black hover:text-black hover:bg-white/90",
                    )}
                >
                    Go back to the list of gifts
                </Link>
            </div>
        );
    }

    return(
        <div className="mt-4 mb-32">
            <StoreLocator giftId={giftId}/>
        </div>
    )
}