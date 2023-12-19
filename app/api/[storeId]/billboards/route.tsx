import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(request: Request, {params}: {params: {storeId: string}}){
    try{
        const body = await request.json();
        const {
            label,
            imageUrl
        } = body
        const {userId} = auth()
        if(!userId) return new NextResponse("Unauthorized", {status: 403})

        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})
        if(!label || typeof label != 'string') return new NextResponse("Name is required", {status: 400})
        if(!imageUrl || typeof imageUrl != 'string') return new NextResponse("Iamge is required", {status: 400})

        const billboard = await prismadb.billboard.create({
            data:{
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return  NextResponse.json(billboard)
    }catch(error){
        console.log("BILLBOARD POST", error)
        return new NextResponse("Server error", {status: 500})
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

        const billboards = await prismadb.billboard.findMany({
            where:{
                storeId: params.storeId,
            }
        }) 
        return  NextResponse.json(billboards)
    }catch(error){
        console.log("BILLBOARD GET", error)
        return new NextResponse("Server error", {status: 500})
    }
}