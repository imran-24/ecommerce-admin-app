

import { UserButton, auth } from '@clerk/nextjs'
import React from 'react'

import { redirect } from 'next/navigation'
import prismadb from '@/lib/prismadb'
// import StoreSwitcher from './store-switcher'
import MainNav from './main-nav'
import StoreSwitcher from './store-switcher'
import { ModeToggle } from './toggle-mode'

const Navbar = async() => {

  const {userId} = auth()
  if(!userId) return redirect('/sign-in')

  const stores = await prismadb.store.findMany({
    where: {userId: userId},
    // orderBy:{
    //     createdAt: 'desc'
    // }
  })
  // if(stores.length === 0) return redirect('/')

  return (
    <div className='border-b'>
        <div className='flex h-16 items-center px-4 gap-4'>
            <StoreSwitcher stores={stores} />
            <MainNav /> 
            <div className='ml-auto flex items-center gap-x-4 '>
                <ModeToggle />
                <UserButton afterSignOutUrl='/' />
            </div>
        </div>
        
    </div>
  )
}

export default Navbar