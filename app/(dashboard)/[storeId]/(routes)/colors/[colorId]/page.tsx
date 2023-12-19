import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import SizeForm from './components/color-form'
import ColorForm from './components/color-form'


const SizePage = async({params}: {params: {
    colorId: string, storeId: string}}) => {
  const {userId} = auth()
  if(!auth) return redirect('/sign-in')
  const colorById = await prismadb.color.findUnique({
    where:{
        id: params.colorId,
        storeId: params.storeId
    }
}) 
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <ColorForm initialData= {colorById} />
        </div>
    </div>
  )
}

export default SizePage