import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, 
    {params}: {params: {
        storeId: string,
        billboardId: string
    }}){
    try{
        const body = await request.json();
        const {
            label,
            imageUrl
        } = body
        const {userId} = auth()
        if(!userId) return new NextResponse("Unauthenticated", {status: 403})
        if(!params.billboardId) return new NextResponse("BillboardId is required", {status: 400})

        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})

        const existingBillboard = await prismadb.billboard.findUnique({
            where:{
                id: params.billboardId,
                storeId: params.storeId
            }
        })

        if(!existingBillboard) return new NextResponse("Invalid billboardId", {status: 401})
        if(!label || typeof label != 'string') return new NextResponse("Name is required", {status: 400})
        if(!imageUrl || typeof imageUrl != 'string') return new NextResponse("Iamge is required", {status: 400})

        const billboard = await prismadb.billboard.update({
            where:{
                id: params.billboardId,
                storeId: params.storeId
            },
            data:{
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return  NextResponse.json(billboard)
    }catch(error){
        console.log("BILLBOARD PATCH", error)
        return new NextResponse("Server error", {status: 500})
    }
}

export async function GET(request: Request,
    {params}: {params: {storeId: string, billboardId: string}}){
    try{
        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})
        if(!params.billboardId ) return new NextResponse("BillboardId is required", {status: 400})

        const billboard = await prismadb.billboard.findUnique({
            where:{
                id: params.billboardId,
                storeId: params.storeId,
            }
        }) 
        return  NextResponse.json(billboard)
    }catch(error){
        console.log("BILLBOARD GET", error)
        return new NextResponse("Server error", {status: 500})
    }
}

export async function DELETE(request: Request, 
    {params}: {params: {
        storeId: string,
        billboardId: string
    }}){
    try{
        
        const {userId} = auth()

        if(!userId) return new NextResponse("Unauthenticated", {status: 403})
        if(!params.billboardId) return new NextResponse("BillboardId is required", {status: 400})

        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})


        const billboard = await prismadb.billboard.delete({
            where:{
                id: params.billboardId,
                storeId: params.storeId
            }
        })

        return  NextResponse.json(billboard)
    }catch(error){
        console.log("BILLBOARD DELETE", error)
        return new NextResponse("Server error", {status: 500})
    }
}