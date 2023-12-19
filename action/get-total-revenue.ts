import prismadb from "@/lib/prismadb"


export const getTotalRevenue = async(storeId: string)=>{
    const paidOrder = await prismadb.order.findMany({
        where:{
            storeId,
            isPaid: true
        },
        include:{
            orderItems:{
                include:{
                    product: true
                }
            }
        }
    })

    const totalRevenue = paidOrder.reduce((revenue, order) => {
        const orderSum = order.orderItems.reduce((total, item) => {
            return total + Number(item.product.price)
        }, 0)
        return revenue + orderSum
    }, 0)

    return totalRevenue
}