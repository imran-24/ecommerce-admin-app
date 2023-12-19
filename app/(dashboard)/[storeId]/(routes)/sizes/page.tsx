import React from 'react'
import SizeClient from './components/client'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import prismadb from '@/lib/prismadb'
import { format } from 'date-fns'
import { SizesColumn } from './components/column'

const SizesPage = async({params}: {params: {storeId: string}}) => {

  const {userId} = auth()
  if(!userId) return redirect('/sign-in')
  
//   const store = await prismadb.store.findUnique({
//     where:{
//         id: params.storeId,
//         userId
//     }
//     })
//   if(!store) return redirect('/')

  const sizes = await prismadb.size.findMany({
    where:{
        storeId: params.storeId
    }
  })

  const formatedSizes: SizesColumn[] = sizes.map(size => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM do, yyyy")
  }))
  
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SizeClient data={formatedSizes}/>
        </div>
    </div>
  )
}

export default SizesPage