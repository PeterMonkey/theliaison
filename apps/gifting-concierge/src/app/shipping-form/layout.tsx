import { Header } from "~/components/header"
import { Footer } from "../components/footer"

export default function Layout({children}:{children: React.ReactNode}) {
    return(
            <div className="flex min-h-dvh flex-col bg-background">
                <Header/>
                {children}
                <Footer/>
            </div>
    )
}