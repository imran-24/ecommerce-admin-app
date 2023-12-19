import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, 
    {params}: {params: {
        storeId: string,
        colorId: string
    }}){
    try{
        const body = await request.json();
        const {
            name,
            value
        } = body
        const {userId} = auth()
        if(!userId) return new NextResponse("Unauthenticated", {status: 403})
        if(!params.colorId) return new NextResponse("ColorId is required", {status: 400})

        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})

        const existingColor = await prismadb.color.findUnique({
            where:{
                id: params.colorId,
                storeId: params.storeId
            }
        })

        if(!existingColor) return new NextResponse("Invalid colorId", {status: 401})
        if(!name || typeof name != 'string') return new NextResponse("Name is required", {status: 400})
        if(!value || typeof value != 'string') return new NextResponse("Value is required", {status: 400})

        const color = await prismadb.color.update({
            where:{
                id: params.colorId,
                storeId: params.storeId
            },
            data:{

                name,
                value,
                storeId: params.storeId
            }
        })

        return  NextResponse.json(color)
    }catch(error){
        console.log("COLOR_PATCH", error)
        return new NextResponse("Server error", {status: 500})
    }
}

export async function GET(request: Request,
    {params}: {params: {storeId: string, colorId: string}}){
    try{
        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})
        if(!params.colorId ) return new NextResponse("colorId is required", {status: 400})

        const color = await prismadb.color.findUnique({
            where:{
                id: params.colorId,
                storeId: params.storeId,
            }
        }) 
        return  NextResponse.json(color)
    }catch(error){
        console.log("COLOR_GET", error)
        return new NextResponse("Server error", {status: 500})
    }
}

export async function DELETE(request: Request, 
    {params}: {params: {
        storeId: string,
        colorId: string
    }}){
    try{
        
        const {userId} = auth()

        if(!userId) return new NextResponse("Unauthenticated", {status: 403})
        if(!params.colorId) return new NextResponse("colorId is required", {status: 400})

        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})


        const color = await prismadb.color.delete({
            where:{
                id: params.colorId,
                storeId: params.storeId
            }
        })

        return  NextResponse.json(color)
    }catch(error){
        console.log("COLOR_DELETE", error)
        return new NextResponse("Server error", {status: 500})
    }
}