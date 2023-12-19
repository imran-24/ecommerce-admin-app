import { getGraphRevenue } from '@/action/get-graph-revenue'
import { getSalesCount } from '@/action/get-sales-count'
import { getStockCount } from '@/action/get-stock-count'
import { getTotalRevenue } from '@/action/get-total-revenue'
import { Overview } from '@/components/overview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { formatter } from '@/lib/utils'
import { CreditCard, DollarSign, Package } from 'lucide-react'
import React from 'react'

interface DashboardPageProps{
  params:{storeId: string}
}
const DashboardPage = async({params}: DashboardPageProps) => {
  const totalRevenue = await getTotalRevenue(params.storeId)
  const stockCount = await getStockCount(params.storeId)
  const saleCount = await getSalesCount(params.storeId)
  const graphData = await getGraphRevenue(params.storeId)
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <Heading 
            subtitle='Overview of your store'
            title='Overview'
            />
            <Separator />
            <div className='grid grid-cols-3 gap-4'> 
              <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <CardTitle className='text-sm font-semibold'>Total Revenue</CardTitle>
                  <DollarSign className='h-4 w-4 text-muted-foreground'/>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'> 
                    {formatter.format(totalRevenue)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <CardTitle className='text-sm font-semibold'>Sales</CardTitle>
                  <CreditCard className='h-4 w-4 text-muted-foreground'/>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'> 
                    +{saleCount}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <CardTitle className='text-sm font-semibold'>Products In Stocks</CardTitle>
                  <Package className='h-4 w-4 text-muted-foreground'/>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'> 
                    {stockCount}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Overview data={graphData} />
              </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default DashboardPage