"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
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


import useStoreModal from '@/hooks/use-store-modal'
import Modal from '../ui/modal';
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "react-hot-toast"

const formSchema = z.object({
  name: z.string().min(2),
})

const StoreModal = () => {
  const storeModal = useStoreModal();
  const [loading, setLoading] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try{
      setLoading(true)
      const response = await axios.post('/api/stores', values);
      window.location.assign(`/${response.data.id}`)
    }
    catch(error){
      setLoading(false)
      toast.error("Somethis went wrong")
    }
    finally{
      setLoading(false)
    }
  }


  return (
    <Modal
      isOpen={storeModal.isOpen}
      title='Create store' 
      description='Add a new store to manage products and categories' 
      onClose={storeModal.onClose}>
      <div className='py-2 space-y-4 pb-4'>
      <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="E-commerce" {...field} />
                </FormControl>
                <FormDescription>
                  Type a unique name for your store
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex items-center justify-end gap-3'>
            <Button 
              disabled={loading}
              variant={'outline'} 
              onClick={storeModal.onClose} >
              cancel
            </Button>
            <Button  
              disabled={loading}
              type="submit">
              continue
            </Button>
          </div>
        </form>
      </Form>
      </div>
    </Modal>

  )
}

export default StoreModal