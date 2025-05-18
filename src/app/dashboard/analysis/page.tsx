'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import Loading from '@/app/Components/Loading'
export const dynamic = 'force-dynamic'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  CellContext
} from '@tanstack/react-table'
import axios from 'axios'
interface Item {
  _id: string
  date: string
  totalRevenue: number
  totalProfit: number
  totalQuantitySold: number
  productName: string
  productCategory: string
  productPrice: number
  productProfit: number
}

type ProductSummary = {
  date: string
  productName: string
  productCategory: string
  totalProfit: number
  totalRevenue: number
  totalQuantitySold: number
}

const Ai = () => {
  const [prompt, setPrompt] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<ProductSummary[]>([])
  const [clicked, setClicked] = useState<boolean>(false)

  const fetchData = async () => {
    const res: Item[] = (await axios.get("/api/analytics/datebased")).data
    console.log("This is the response from the product performance route", res)

    let promptText = ""
    res.forEach((item) => {
      promptText += `On ${item.date}, the total revenue is ${item.totalRevenue}, quantity sold is ${item.totalQuantitySold}, and profit is ${item.totalProfit}.\n`
    })
    promptText += "What is the trend of the product considering leaves, market conditions, and financial factors?"
    setPrompt(promptText)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleClick = async () => {
    if (!prompt) return
    setLoading(true)
    const res = await axios.post("/api/ai", { prompt })
    // console.log("AI response:", res.data)
    setMessage(res.data.choices[0].message.content)
    setPrompt("")
    setLoading(false)
  }

  const handleKeyDown = async () => {
    const res = await axios.get("/api/allData")
    setData(res.data)
    // console.log("All Data Response:", res.data)
    setClicked(true)
  }

  const analysisTable = async () => {
    setPrompt("")
    let promptText = ""
    data.forEach((item) => {
      promptText += `On ${item.date} for the product ${item.productName} of ${item.productCategory} category the profit is ${item.totalProfit}, and revenue is ${item.totalRevenue}, `
    })
    promptText += "Analyze this data and give me a report that includes key points, pain points, causes, and suggestions for the future."
    setPrompt(promptText)
    // handleClick() // Uncomment if you want to call AI immediately
  }

  const columns: ColumnDef<ProductSummary>[] = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (info: CellContext<ProductSummary, unknown>) =>
        new Date(info.getValue() as string).toLocaleDateString()
    },
    {
      header: 'Name',
      accessorKey: 'productName',
      cell: (info: CellContext<ProductSummary, unknown>) =>
        info.getValue() as string
    },
    {
      header: 'Profit',
      accessorKey: 'totalProfit',
      cell: (info: CellContext<ProductSummary, unknown>) =>
        `₹${info.getValue() as number}`
    },
    {
      header: 'Revenue',
      accessorKey: 'totalRevenue',
      cell: (info: CellContext<ProductSummary, unknown>) =>
        `₹${info.getValue() as number}`
    },
    {
      header: 'Quantity Sold',
      accessorKey: 'totalQuantitySold',
      cell: (info: CellContext<ProductSummary, unknown>) =>
        info.getValue() as number
    }
  ]

  const table = useReactTable<ProductSummary>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='md:ml-40 top-20 h-auto dark:bg-gray-800 bg-white rounded shadow p-4'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>AI Insights</h1>
        <p className='text-sm text-gray-500'>Get trends based on sales data</p>

        {loading ? (
          <div className='flex items-center gap-2'>
            <Loading height={200} weidth={200}/>
          </div>
        ) : (
          <ReactMarkdown>{message}</ReactMarkdown>
        )}

        <textarea
          rows={7}
          className='w-full text-gray-700 border dark:text-white border-gray-300 p-3 rounded'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Enter or edit prompt...'
        />
        <div className="flex gap-2">
          <Button onClick={handleClick} className='bg-blue-500 text-white cursor-pointer'>Ask AI</Button>
          <Button onClick={handleKeyDown} className='bg-green-500 text-white cursor-pointer'>Fetch Sales Table</Button>
          {clicked && (
            <Button onClick={analysisTable} className='bg-rose-500 text-white cursor-pointer'>Analyse Table</Button>
          )}
        </div>
      </div>

      {data.length > 0 && (
        <div className="mt-6 overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:text-black dark:bg-amber-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-3 font-semibold">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-t hover:bg-gray-50 dark:hover:bg-amber-50 dark:hover:text-black">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Ai
