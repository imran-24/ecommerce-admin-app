import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import SizeForm from './components/size-form'


const SizePage = async({params}: {params: {
    sizeId: string, storeId: string}}) => {
  const {userId} = auth()
  if(!auth) return redirect('/sign-in')
  const sizeById = await prismadb.size.findUnique({
    where:{
        id: params.sizeId,
        storeId: params.storeId
    }
}) 
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SizeForm initialData= {sizeById} />
        </div>
    </div>
  )
}

export default SizePage