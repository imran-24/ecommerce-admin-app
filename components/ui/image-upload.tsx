'use client'

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './button';
import { ImagePlus, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import Image from 'next/image';

interface ImageUploadInterface{
    disabled: boolean,
    onCancel: (value: string) => void,
    onChange: (value: string) => void,
    values?: string[]
}

const ImageUpload: React.FC<ImageUploadInterface> = ({
    disabled,
    onCancel,
    onChange,
    values
}) => {
  
    const handleUpload = useCallback((result: any) => {
        onChange(result?.info.secure_url)
    },[onChange])

  return (
    <div> 
        <div>
        {
            values?.map(value => (
            <div
                key={value}
                className='
                w-[200px]
                h-[200px]
                rounded-lg 
                relative
                hover:opacity-75
                mb-4
                '>
                <div className='
                absolute 
                top-2 
                right-2
                z-10
                '>
                    <Button 
                    type='button'
                    size='icon'
                    variant='destructive'
                    onClick={()=> onCancel(value)}>
                    <Trash 
                    className='w-4 h-4'
                    />
                    </Button>
                </div>
                <Image
                alt='upload'
                fill
                src={value}
                className='object-cover mb-4 rounded-sm'
                />
            </div>
        ))}
        </div> 
        <CldUploadWidget
        onUpload={handleUpload} uploadPreset='njx1dxbk'>
            {({ open }) => {
                const handleOnClick = () => {
                open();
                }
                return (
                    <Button
                    variant='secondary'
                    disabled={disabled}
                    onClick={handleOnClick}
                    >
                        <ImagePlus className={cn('w-4 h-4 mr-2', values && "mt-2")} />
                        Uplaod Image
                    </Button>
                );
            }}
        </CldUploadWidget>
    </div>
  )
}

export default ImageUpload