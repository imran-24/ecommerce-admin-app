import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, 
    {params}: {params: {
        storeId: string,
        categoryId: string
    }}){
    try{
        const body = await request.json();
        const {
            name,
            billboardId
        } = body
        const {userId} = auth()
        if(!userId) return new NextResponse("Unauthenticated", {status: 403})
        if(!params.categoryId) return new NextResponse("CategoryId is required", {status: 400})

        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})
        
        if(!name || typeof name != 'string') return new NextResponse("Name is required", {status: 400})
        if(!billboardId || typeof billboardId != 'string') return new NextResponse("Iamge is required", {status: 400})
        
        const existingCategory = await prismadb.category.findUnique({
            where:{
                id: params.categoryId,
                storeId: params.storeId
            }
        })

        if(!existingCategory) return new NextResponse("Invalid billboardId", {status: 401})
        

        const category = await prismadb.category.update({
            where:{
                id: params.categoryId,
                storeId: params.storeId
            },
            data:{
                name,
                billboardId,
                storeId: params.storeId
            }
        })

        return  NextResponse.json(category)
    }catch(error){
        console.log("CATEGORY_PATCH", error)
        return new NextResponse("Server error", {status: 500})
    }
}

export async function GET(request: Request,
    {params}: {params: {storeId: string, categoryId: string}}){
    try{
        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})
        if(!params.categoryId ) return new NextResponse("CategoryId is required", {status: 400})

        const category = await prismadb.category.findUnique({
            where:{
                id: params.categoryId,
                storeId: params.storeId,
            },
            include:{
                billboard: true
            }
        }) 
        return  NextResponse.json(category)
    }catch(error){
        console.log("CATEGORY_GET", error)
        return new NextResponse("Server error", {status: 500})
    }
}

export async function DELETE(request: Request, 
    {params}: {params: {
        storeId: string,
        categoryId: string
    }}){
    try{
        
        const {userId} = auth()

        if(!userId) return new NextResponse("Unauthenticated", {status: 403})
        if(!params.categoryId) return new NextResponse("CategoryId is required", {status: 400})

        const storeByUserId = await prismadb.store.findUnique({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId ) return new NextResponse("Unauthorized", {status: 405})


        const category = await prismadb.category.delete({
            where:{
                id: params.categoryId,
                storeId: params.storeId
            }
        })

        return  NextResponse.json(category)
    }catch(error){
        console.log("CATEGORY_DELETE", error)
        return new NextResponse("Server error", {status: 500})
    }
}