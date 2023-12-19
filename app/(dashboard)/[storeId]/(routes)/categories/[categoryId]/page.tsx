import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import CategoryForm from './components/category-form'
import { CategoryColumn } from '../components/column'

const CategoryPage = async({params}: {params: {
  storeId: string,
  categoryId: string}}) => {
  
  const {userId} = auth()
  if(!userId) return redirect('/sign-in')

  const category = await prismadb.category.findUnique({
    where:{
      id: params.categoryId
    },
    include:{
      billboard: true
    }
  })

  const billboards = await prismadb.billboard.findMany({
    where: {
        storeId: params.storeId
    }
  })

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <CategoryForm 
            billboards={billboards}
            initialData={category} />
        </div>
    </div>
  )
}

export default CategoryPage