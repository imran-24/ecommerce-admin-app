'use client'
import { Size } from '@prisma/client'
import React from 'react'


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'


import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modal'
import axios from 'axios'
import toast from 'react-hot-toast'

interface SizeFormInterface{
    initialData: Size | null
}

const formSchema = z.object({
    name: z.string().min(2),
    value: z.string().min(1),
  })

const SizeForm: React.FC<SizeFormInterface> = ({
    initialData
}) => {
  
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
          name: '',
          value: ''
        }
    })
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const params = useParams()
  const title = initialData ? "Edit Size" : "Create Size"
  const subtitle = initialData ? "Edit this Size" : "Create a new size"
  const toastMessage = initialData ? "Size updated" : "Size created"
  const actionLabel = initialData ? "Save changes": "Create"

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        setLoading(true);
        if(initialData){
          const response = await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, values)
        }else{
          const response = await axios.post(`/api/${params.storeId}/sizes`, values)
        }       
        
        router.push(`/${params.storeId}/sizes`)
        toast.success(toastMessage);
        router.refresh()
    }catch(error){
        setLoading(false)
        console.log(error)
        toast.error("Something went wrong")
    }finally{
        setLoading(false);
    }
  }

  const onDelete = async()=>{
    try{
        setLoading(true)
        const response = await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
        router.refresh()
        toast.success("Successfully deleted")
        router.push(`/${params.storeId}/sizes`)
    }catch(error){
        setLoading(false)
        console.log(error)
        toast.error("Something went wrong")
    }finally{
        setLoading(false);
    }
  }
  return (
    <>
    <AlertModal
    isOpen={open}
    disabled={loading}
    onCancel={()=> setOpen(false)}
    onConfirm={onDelete}
    />
    <div className='flex items-center justify-between'>
        <Heading 
        title={title}
        subtitle={subtitle}
        />
        {initialData && 
        <Button
        size='icon'
        onClick={()=> setOpen(true)}
        variant='destructive'>
            <Trash className='h-4 w-4' />
        </Button>}
    </div>
    <Separator />
    <div className='py-2 space-y-4 pb-4'>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input  
                disabled={loading}
                placeholder="Size name" 
                {...field} />
              </FormControl>
              <FormDescription>
              Type a unique name for size
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input  
                disabled={loading}
                placeholder="Size value" 
                {...field} />
              </FormControl>
              <FormDescription>
              Type a unique value for the size
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <Button 
        disabled={loading}
        type="submit">
          {actionLabel}
        </Button>
      </form>
    </Form>
    </div>
    </>
  )
}

export default SizeForm