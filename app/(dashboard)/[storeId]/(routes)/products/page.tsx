import React from 'react'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import prismadb from '@/lib/prismadb'
import { formatter } from '@/lib/utils'
import { format } from 'date-fns'
import { ProductColumn } from './components/column'
import ProductsClient from './components/client'

const ProductsPage = async({params}: {params: {storeId: string}}) => {
  const {userId} = auth()
  if(!userId) return redirect('/sign-in')

  const products = await prismadb.product.findMany({
    where:{
      storeId: params.storeId
    },
    include:{
      category: true,
      size: true,
      color: true
    },
    orderBy:{
      createdAt: "desc"
    }
  })

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage