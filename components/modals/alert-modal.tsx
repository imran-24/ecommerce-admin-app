'use client'


import Modal from '../ui/modal';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';

interface AlertModalInterface{
    isOpen: boolean;
    loading: boolean; 
    onConfirm: ()=> void,
    onClose: ()=> void
}
export const AlertModal: React.FC<AlertModalInterface> = ({
    isOpen,
    loading,
    onConfirm,
    onClose
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(()=>{
   setIsMounted(true)
  },[])

  if(!isMounted) return null
  
  return (
    <Modal
    isOpen={isOpen}
    title='Are you sure?' 
    description='This action cannot be undone.' 
    onClose={onClose}>
      <div className='py-2 space-y-4 pb-4'>
        <div className='flex items-center justify-end gap-3'>
            <Button 
            disabled={loading}
            onClick={onClose}
            variant={'outline'}>
                Cancel
            </Button>
            <Button 
            disabled={loading}
            onClick={onConfirm}
            variant={'destructive'}>
                Delete
            </Button>
        </div>
      </div>
    </Modal>
  )
}

