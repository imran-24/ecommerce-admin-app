import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(request: Request, {params}: {params: {storeId: string}}){
    try{
        const body = await request.json();
        const {
            name,
            value
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
        if(!name || typeof name != 'string') return new NextResponse("Name is required", {status: 400})
        if(!value || typeof value != 'string') return new NextResponse("Value is required", {status: 400})

        const color = await prismadb.color.create({
            data:{
                name,
                value,
                storeId: params.storeId
            }
        })

        return  NextResponse.json(color)
    }catch(error){
        console.log("COLOR_POST", error)
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

        const colors = await prismadb.color.findMany({
            where:{
                storeId: params.storeId,
            }
        }) 
        return  NextResponse.json(colors)
    }catch(error){
        console.log("COLOR_GET", error)
        return new NextResponse("Server error", {status: 500})
    }
}