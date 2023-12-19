import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, 
    {params}: {params: {
        storeId: string,
        sizeId: string
    }}){
    try{
        const body = await request.json();
        const {
            name,
            value
        } = body
        const {userId} = auth()
        if(!userId) return new NextResponse("Unauthenticated", {status: 403})
        if(!params.sizeId) return new NextResponse("SizeId is required", {status: 400})

        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})

        const existingSize = await prismadb.size.findUnique({
            where:{
                id: params.sizeId,
                storeId: params.storeId
            }
        })

        if(!existingSize) return new NextResponse("Invalid sizeId", {status: 401})
        if(!name || typeof name != 'string') return new NextResponse("Name is required", {status: 400})
        if(!value || typeof value != 'string') return new NextResponse("Value is required", {status: 400})

        const size = await prismadb.size.update({
            where:{
                id: params.sizeId,
                storeId: params.storeId
            },
            data:{

                name,
                value,
                storeId: params.storeId
            }
        })

        return  NextResponse.json(size)
    }catch(error){
        console.log("BILLBOARD PATCH", error)
        return new NextResponse("Server error", {status: 500})
    }
}

export async function GET(request: Request,
    {params}: {params: {storeId: string, sizeId: string}}){
    try{
        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})
        if(!params.sizeId ) return new NextResponse("SizeId is required", {status: 400})

        const size = await prismadb.size.findUnique({
            where:{
                id: params.sizeId,
                storeId: params.storeId,
            }
        }) 
        return  NextResponse.json(size)
    }catch(error){
        console.log("SIZE_GET", error)
        return new NextResponse("Server error", {status: 500})
    }
}

export async function DELETE(request: Request, 
    {params}: {params: {
        storeId: string,
        sizeId: string
    }}){
    try{
        
        const {userId} = auth()

        if(!userId) return new NextResponse("Unauthenticated", {status: 403})
        if(!params.sizeId) return new NextResponse("SizeId is required", {status: 400})

        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})


        const size = await prismadb.size.delete({
            where:{
                id: params.sizeId,
                storeId: params.storeId
            }
        })

        return  NextResponse.json(size)
    }catch(error){
        console.log("BILLBOARD DELETE", error)
        return new NextResponse("Server error", {status: 500})
    }
}