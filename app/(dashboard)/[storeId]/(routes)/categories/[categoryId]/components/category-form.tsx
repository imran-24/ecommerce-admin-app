'use client'

import { Billboard, Category } from '@prisma/client'
import React, { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { Trash } from 'lucide-react'

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import AlertModal from '@/components/modals/alert-modal'

import axios from 'axios'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import prismadb from '@/lib/prismadb'



interface CategoryformInterface{
    initialData: Category | null,
    billboards: Billboard[]
}

// form schema
const formSchema = z.object({
    name: z.string().min(2),
    billboardId: z.string().min(2),
  })

const CategoryForm: React.FC<CategoryformInterface> = ({
    initialData,
    billboards
}) => {
  
   // 1. Define your form.
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
    })

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()

  
  const onDelete = async() =>{
    try{
        setLoading(true)
        const response = await axios.delete(`/api/${params.storeId}/categories/${initialData?.id}`)
        router.refresh()
        toast.success("Categories deleted")
        router.push(`/${params.storeId}/categories`)
    }catch(error){
        setLoading(false)
        toast.error("Something went wrong")
    }finally{
        setLoading(false)
    }
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        setLoading(true);
        if(initialData){
          const response = await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values)
        }else{
          const response = await axios.post(`/api/${params.storeId}/categories`, values)
        }       
        router.push(`/${params.storeId}/categories`)
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

  const title = initialData ? "Edit Category" : "Create Category"
  const subtitle = initialData ? "Edit this Category" : "Create a new category"
  const toastMessage = initialData ? "Category updated" : "Category created"
  const actionLabel = initialData ? "Save changes" : "Create"

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
      
      <div className='grid grid-cols-3 gap-8'>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input  
                disabled={loading}
                placeholder="Category name" 
                {...field} />
              </FormControl>
              <FormDescription>
              Type a unique name for the category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billboardId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billboard</FormLabel>
              <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a billboard" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {
                        billboards.map(billboard => (
                            <SelectItem 
                            key={billboard.id}
                            value={billboard.id}>
                                {billboard.label}
                            </SelectItem>
                        ))
                    }                  
                </SelectContent>
              </Select>
              
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

export default CategoryForm