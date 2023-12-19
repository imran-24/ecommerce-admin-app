'use client'

import Heading from '@/components/ui/heading'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { BillboardColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface BillboardClientInterface{
  data: BillboardColumn[]
}

const BillboardClient: React.FC<BillboardClientInterface> = ({
  data
}) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading 
        title={`Billboards(${data?.length})`}
        subtitle="Manage billboard for your store"
        />
        <Button
        onClick={()=> router.push(`/${params.storeId}/billboards/new`)}
        >
            <Plus className='h-4 w-4 mr-3' />
            Add New
        </Button>
      </div>
      <Separator /> 
      <div>
        <DataTable searchKey={'label'} columns={columns} data={data} />
      </div>
      <Heading 
      title='API'
      subtitle='API calls for Billboards'
      />
      <Separator />
      <ApiList 
      entityName="billboards"
      entityIdName="billboardId"/>
    </>
  )
}

export default BillboardClient