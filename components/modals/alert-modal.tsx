'use client'

import React from 'react'
import Modal from '../ui/modal';
import { Button } from '../ui/button';

interface AlertModalInterface{
    isOpen: boolean;
    disabled: boolean; 
    onConfirm: ()=> void,
    onCancel: ()=> void
}
const AlertModal: React.FC<AlertModalInterface> = ({
    isOpen,
    disabled,
    onConfirm,
    onCancel
}) => {
  return (
    <Modal
    isOpen={isOpen}
    title='Are you sure?' 
    description='This action cannot be undone.' 
    onClose={onCancel}>
      <div className='py-2 space-y-4 pb-4'>
        <div className='flex items-center justify-end gap-3'>
            <Button 
            disabled={disabled}
            onClick={onCancel}
            variant={'outline'}>
                Cancel
            </Button>
            <Button 
            disabled={disabled}
            onClick={onConfirm}
            variant={'destructive'}>
                Delete
            </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AlertModal