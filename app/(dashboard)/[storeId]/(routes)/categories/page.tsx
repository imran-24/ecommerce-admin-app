import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import CategoriesClient from './components/client'
import { CategoryColumn } from './components/column'
import { format } from 'date-fns'

const CategoriesPage = async({params}: {params: {storeId: string}}) => {
  const {userId} = auth()

  if(!userId) return redirect('/sign-in')
  const categories = await prismadb.category.findMany({
    where:{
        storeId: params.storeId,
    },
    include:{
        billboard: true
    },
    orderBy:{
        createdAt: 'desc'
    }
  })

  const formattedCategory: CategoryColumn[] =  categories.map(category => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <CategoriesClient  data={formattedCategory}/>
        </div>
    </div>
  )
}

export default CategoriesPage