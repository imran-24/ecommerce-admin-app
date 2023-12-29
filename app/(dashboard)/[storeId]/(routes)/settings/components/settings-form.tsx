'use client'

import { Store } from '@prisma/client'

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
import ApiAlert from '@/components/ui/api-alert'
import useOrigin from '@/hooks/use-origin'


interface SettingsFormInterface{
    initialData: Store
}

// form schema
const formSchema = z.object({
    name: z.string().min(2),
  })
 
  
const SettingsForm: React.FC<SettingsFormInterface> = ({
    initialData
}) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const origin = useOrigin()
    const params = useParams()
    const router = useRouter()

   // 1. Define your form.
   const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        setLoading(true);
        const response = await axios.patch(`/api/stores/${params.storeId}`, values)
        router.refresh()        
        toast.success("Store updated successfully");
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
        const response = await axios.delete(`/api/stores/${params.storeId}`)
        toast.success("Successfully deleted")
        router.refresh()
        router.push('/')
    }catch(error){
        setLoading(false)
        console.log(error)
        toast.error('Make sure you removed all products and categories first.');
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
        title="Settings"
        subtitle="Manage store preferences"
        />
        <Button
        size='icon'
        onClick={()=> setOpen(true)}
        variant='destructive'>
            <Trash className='h-4 w-4' />
        </Button>
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
                placeholder="Store name" 
                {...field} />
              </FormControl>
              <FormDescription>
              Type a unique name of your store
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <Button 
        disabled={loading}
        type="submit">
            Save changes
        </Button>
      </form>
    </Form>
    <Separator />
    <ApiAlert 
    title='NEXT_PUBLIC_API_URL'
    description={`${origin}/api/${params.storeId}`}
    variant='admin'
    />
    </div>
    </>
  )
}

export default SettingsForm