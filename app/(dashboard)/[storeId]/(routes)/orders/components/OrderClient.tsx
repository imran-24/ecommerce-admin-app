'use client'

import Heading from '@/components/ui/heading'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { OrderColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

interface OrderClientInterface{
  data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientInterface> = ({
  data
}) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading 
        title={`orders(${data?.length})`}
        subtitle="Manage order for your store"
        />
      </div>
      <Separator /> 
      <div>
        <DataTable searchKey={'products'} columns={columns} data={data} />
      </div>
      
    </>
  )
}

export default OrderClient