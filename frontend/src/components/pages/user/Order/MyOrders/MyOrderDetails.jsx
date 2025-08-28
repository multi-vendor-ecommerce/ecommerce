import { useContext } from "react"
import OrderContext from "../../../../../context/orders/OrderContext"

const MyOrderDetails = () => {
  const { OrderById } = useContext(OrderContext);

  return (
    <div>
      my order details page 
    </div>
  )
}

export default MyOrderDetails