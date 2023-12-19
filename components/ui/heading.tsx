'use client'
import React from 'react'

interface HeadingInterface{
    title: string,
    subtitle: string
}

const Heading: React.FC<HeadingInterface> = ({
    title,
    subtitle
}) => {
  return (
    <div>
        <div className='text-3xl font-bold tracking-tighter'>
            {title}
        </div>
        <div className='text-sm text-muted-foreground'>
            {subtitle}
        </div>
    </div>
  )
}

export default Heading