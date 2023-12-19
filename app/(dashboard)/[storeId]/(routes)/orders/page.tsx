
import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import OrderClient from './components/OrderClient'
import { OrderColumn } from './components/columns'
import {format } from 'date-fns'
import { formatter } from '@/lib/utils'

const orderPage = async ({params}:{params: {storeId: string}}) => {
  
  const {userId} = auth()
  if(!userId) return redirect('/sign-in')

//   const store = await prismadb.store.findUnique({
//     where:{
//         id: params.storeId,
//         userId
//     }
//   })

//   if(!store) return redirect('/')
  
  const orders = await prismadb.order.findMany({
    where:{
        storeId: params.storeId
    },
    include:{
      orderItems:{
        include:{
          product: true
        }
      }
    },
    orderBy:{
        createdAt: 'desc'
    }
  })

  const formatedOrders: OrderColumn[] = orders.map(order => ({
    id: order.id,
    isPaid: order.isPaid,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map(orderItem => orderItem.product.name).join(', '),
    totalPrice: formatter.format(order.orderItems.reduce((total, orderItem) => { 
      return total + Number(orderItem.product.price)
    }, 0)),
    createdAt: format(order.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formatedOrders}/>
        </div>
    </div>
  )
}

export default orderPage