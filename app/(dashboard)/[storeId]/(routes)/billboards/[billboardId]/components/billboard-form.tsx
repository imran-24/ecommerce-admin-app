'use client'

import { Billboard } from '@prisma/client'

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
import { Input } from "@/components/ui/input"
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import prismadb from '@/lib/prismadb'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AlertModal from '@/components/modals/alert-modal'
import ImageUpload from '@/components/ui/image-upload'


interface BillboardFormInterface{
    initialData: Billboard | null
}

// form schema
const formSchema = z.object({
    label: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    imageUrl: z.string().min(2, {
      message: "Billboard required an image",
    }),
  })
 
  
const BillboardForm: React.FC<BillboardFormInterface> = ({
    initialData
}) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const params = useParams()
    const router = useRouter()

   // 1. Define your form.
   const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
          label: '',
          imageUrl: ''
        }
    })

    const title = initialData ? "Edit billboard" : "Create billboard"
    const subtitle = initialData ? "Edit this billboard" : "Create a new billboard"
    const actionLabel = initialData ? "Save changes" : 'Create'
    const toastMessage = initialData ? 'Billboard updated' : 'Billboard created' 
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        setLoading(true);
        if(initialData){
          const response = await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values)
        }else{
          const response = await axios.post(`/api/${params.storeId}/billboards`, values)
        }       
        router.push(`/${params.storeId}/billboards`)
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
        const response = await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
        router.push('/')
        toast.success("Successfully deleted")
        router.refresh()
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
      <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image upload</FormLabel>
              <FormControl>
                <ImageUpload 
                disabled={loading}
                onCancel={(value) =>{field.onChange("")}}
                onChange={(value)=>  {field.onChange(value)}}
                values={field.value ? [field.value] : []}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
      />
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input  
                disabled={loading}
                placeholder="Billboard name" 
                {...field} />
              </FormControl>
              <FormDescription>
              Type a unique name for the billboard
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

export default BillboardForm