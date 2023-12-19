"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import prismadb from "@/lib/prismadb"
import { StoreApi } from "zustand"
import { Store } from "@prisma/client"
import { CheckIcon, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import useStoreModal from "@/hooks/use-store-modal"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"



const StoreSwitcher = (
   {stores}: {stores: Store[]}
    ) => {
        
  
  const frameworks = stores.map(store =>({
    label: store.name,
    value: store.id
  }))
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const storeModal = useStoreModal();
  const params = useParams()
  const router = useRouter()

  const currentStore = frameworks.find((framework) => framework.value === params.storeId)

  const onSelectStore = ((store: { label: string, value: string})=>{
        setValue(store.value === value ? "" : store.label)
        setOpen(false)
        router.push(`/${store.value}`)
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Store"
          className="w-[300px] justify-between"
        >
          <StoreIcon className="mr-3 h-4 w-4 " />

          {currentStore?.label }          
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]  ">
        <Command>
          <CommandInput placeholder="Search store..." className="h-9" />
          <CommandEmpty>No Store found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
              className="cursor-pointer"
                key={framework.value}
                onSelect={()=> onSelectStore(framework)}
              >
                <StoreIcon className="mr-3 h-4 w-4 " />
                {framework.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    currentStore?.value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
            <Separator />
            <CommandItem
            className="cursor-pointer"
            onSelect={()=> storeModal.onOpen()}>
                <div className="font-medium">Create store</div>
                <PlusCircle className="ml-auto h-4 w-4" />
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default StoreSwitcher
