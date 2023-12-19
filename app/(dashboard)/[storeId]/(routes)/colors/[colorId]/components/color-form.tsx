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

interface ColorFormInterface{
    initialData: Size | null
}

const formSchema = z.object({
    name: z.string().min(2),
    value: z.string().min(1),
  })

const ColorForm: React.FC<ColorFormInterface> = ({
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
  const title = initialData ? "Edit Color" : "Create Color"
  const subtitle = initialData ? "Edit this Color" : "Create a new Color"
  const toastMessage = initialData ? "Color updated" : "Color created"
  const actionLabel = initialData ? "Save changes": "Create"

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        setLoading(true);
        if(initialData){
          const response = await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values)
        }else{
          const response = await axios.post(`/api/${params.storeId}/colors`, values)
        } 
        router.refresh()      
        toast.success(toastMessage);
        router.push(`/${params.storeId}/colors`)
        
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
        const response = await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
        router.refresh()      
        toast.success("Successfully deleted");
        router.push(`/${params.storeId}/colors`)
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
                placeholder="Color name" 
                {...field} />
              </FormControl>
              <FormDescription>
              Type a unique color name
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
                placeholder="Color value" 
                {...field} />
              </FormControl>
              <FormDescription>
              Type a hex value for the color
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

export default ColorForm