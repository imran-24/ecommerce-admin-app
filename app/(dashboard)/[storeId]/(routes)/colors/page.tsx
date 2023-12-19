import React from 'react'
import ColorClient from './components/client'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import prismadb from '@/lib/prismadb'
import { format } from 'date-fns'
import { ColorsColumn } from './components/column'

const ColorsPage = async({params}: {params: {storeId: string}}) => {

  const {userId} = auth()
  if(!userId) return redirect('/sign-in')
  
//   const store = await prismadb.store.findUnique({
//     where:{
//         id: params.storeId,
//         userId
//     }
//     })
//   if(!store) return redirect('/')

  const colors = await prismadb.color.findMany({
    where:{
        storeId: params.storeId
    }
  })

  const formatedColors: ColorsColumn[] = colors.map(color => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM do, yyyy")
  }))
  
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <ColorClient data={formatedColors}/>
        </div>
    </div>
  )
}

export default ColorsPage