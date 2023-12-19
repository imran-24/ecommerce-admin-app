'use client'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { CategoryColumn, columns } from './column'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface CategoriesClientInterface{
    data: CategoryColumn[] 
}
const CategoriesClient: React.FC<CategoriesClientInterface> = ({
    data
}) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
        <div className='flex items-center justify-between'>
            <Heading
            title={`Category(${data.length})`}
            subtitle='Manage category for your store' />
            <Button
            onClick={()=> router.push(`/${params.storeId}/categories/new`)}>
                <Plus className='h-4 w-4 mr-2' />
                Add new 
            </Button>
        </div>
        <Separator /> 
        <div>
            <DataTable searchKey={'name'} columns={columns} data={data} />
        </div>
        <Heading 
        title='API'
        subtitle='API calls for Billboards'
        />
        <Separator />
        <ApiList 
        entityName="categories"
        entityIdName="categoryId"/>
    </>
  )
}

export default CategoriesClient