'use client'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { SizesColumn, columns } from './column'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface SizeClientInterface{
    data: SizesColumn[]
}
const SizeClient: React.FC<SizeClientInterface> = ({
    data
}) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
    <div className='flex items-center justify-between'>
        <Heading
        title={`Sizes(${data.length})`}
        subtitle='Manage size for your store' />
        <Button
        onClick={()=> router.push(`/${params.storeId}/sizes/new`)}
        >
            <Plus className='w-4 h-4 mr-2' />
            Add new
        </Button>
    </div>
    <Separator />
      <div>
        <DataTable searchKey={'label'} columns={columns} data={data} />
      </div>
      <Heading 
      title='API'
      subtitle='API calls for Size'
      />
      <Separator />
      <ApiList 
      entityName="sizes"
      entityIdName="sizeId"/>

    </>
  )
}

export default SizeClient