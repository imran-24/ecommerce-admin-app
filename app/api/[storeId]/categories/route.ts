import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function POST(req: Request, 
    {params}: {params: {storeId: string}}) {
    try{
        const {userId} = auth()
        const body = await req.json()
        const {name, billboardId} = body

        if(!userId){
            return new NextResponse("Unauthoried", {status: 401} )
        }
        if(!name){
            return new NextResponse("Name is required", {status: 400})
        }
        if(!billboardId){
            return new NextResponse("BillboardId is required", {status: 400})
        }
        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})
        const category = await prismadb.category.create({
            data:{
                name,
                billboardId,
                storeId: params.storeId
            }
        })
        return NextResponse.json(category)
    }
    catch(error){
        console.log('[CATEGORY_POST]', error)
        return new NextResponse("Internal error", {status: 500} )
    }
}



export async function GET(
    request: Request,
    {params}: {params: {storeId: string}}){
    try{
        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})

        const categories = await prismadb.category.findMany({
            where:{
                storeId: params.storeId,
            },
            include:{
                billboard: true
            }
        }) 
        return  NextResponse.json(categories)
    }catch(error){
        console.log("CATEGORIES_GET", error)
        return new NextResponse("Server error", {status: 500})
    }
}