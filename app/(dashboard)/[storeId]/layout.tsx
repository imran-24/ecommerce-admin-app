import Navbar from "@/components/navbar"
import prismadb from "@/lib/prismadb"
import { auth, redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"


export default async function DashboardLayout({
    children, params
}: {children: React.ReactNode,
    params: {storeId: string}}) {
    
    const {userId} = auth()
    if(!userId) return redirectToSignIn()

    const store = await prismadb.store.findUnique({
        where:{
            id: params.storeId,
            userId
        }
    })
    
    if(!store?.id) return redirect('/')
    
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}