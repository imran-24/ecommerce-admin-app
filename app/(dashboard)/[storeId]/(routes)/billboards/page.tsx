
import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import BillboardClient from './components/BillboardClient'
import { BillboardColumn } from './components/columns'
import {format } from 'date-fns'

const BillboardPage = async ({params}:{params: {storeId: string}}) => {
  
  const {userId} = auth()
  if(!userId) return redirect('/sign-in')

//   const store = await prismadb.store.findUnique({
//     where:{
//         id: params.storeId,
//         userId
//     }
//   })

//   if(!store) return redirect('/')
  
  const billboards = await prismadb.billboard.findMany({
    where:{
        storeId: params.storeId
    },
    orderBy:{
        createdAt: 'desc'
    }
  })

  const formatedBillboards: BillboardColumn[] = billboards.map(billboard => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient data={formatedBillboards}/>
        </div>
    </div>
  )
}

export default BillboardPage