"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellActions from "./cell-actions"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorsColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

export const columns: ColumnDef<ColorsColumn>[] = [

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell:({row})=>(
      <div className="flex items-center gap-x-4">
        {row.original.value}
        <div
          className='border p-4 rounded-full'
          style={{ backgroundColor: `${row.original.value}`}}
        />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions row={row.original}/>
  },
]
