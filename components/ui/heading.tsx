'use client'
import React from 'react'

interface HeadingInterface{
    title: string,
    description: string
}

const Heading: React.FC<HeadingInterface> = ({
    title,
    description
}) => {
  return (
    <div>
        <div className='text-3xl font-bold tracking-tighter'>
            {title}
        </div>
        <div className='text-sm text-muted-foreground'>
            {description}
        </div>
    </div>
  )
}

export default Heading