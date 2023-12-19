'use client'

import React, { useState } from 'react'
import { OrderColumn } from './columns'
import toast from 'react-hot-toast'


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modal'
import axios from 'axios'


interface CellActionsInterface{
  row: OrderColumn
}
const CellActions: React.FC<CellActionsInterface> = ({row}) => {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const onCopy = (id: string)=>{
    navigator.clipboard.writeText(id);
    toast.success("Billboard Id copied to the clipboard")
  }

  const onDelete = async()=>{
    try{
      setLoading(true)
      const response = await axios.delete(`/api/${params.storeId}/billboards/${row.id}`)
      toast.success('Billboard deleted successfully')
      setOpen(false)
      router.refresh()
    }catch(error){
      setOpen(false)
      toast.error("Something went wrong")
    }finally{
      setOpen(false)
    }
  }
  
  return (
    <>
      <AlertModal
      disabled={loading}
      isOpen={open}
      onCancel={()=>{setOpen(false)}}
      onConfirm={onDelete}
      />
      <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
          variant={'ghost'}>
            <MoreHorizontal className='h-4 w-4 p-0'  />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
          onClick={()=> onCopy(row.id)}>
            <Copy className='h-4 w-4 mr-2' />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
          onClick={()=> router.push(`/${params.storeId}/billboards/${row.id}`)}>
            <Edit className='h-4 w-4 mr-2' />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
          onClick={()=> setOpen(true)}>
            <Trash className='h-4 w-4 mr-2' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>

    </>
  )
}

export default CellActions