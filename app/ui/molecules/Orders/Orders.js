import { useEffect, useState } from "react"
import Apis from '@/app/libs/apis'

const Orders = () => {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState(null)

  const handleCompleteOrder = (uid) => {
    try {
      Apis.orders.RTSOrder(uid)
    } catch (error) {
      console.info('molecules/Orders/Orders.js handleCompleteOrder')
      console.error(`Error al crear order: ${error}`)
    }
  }

  useEffect(() => {
    setLoading(true)
    const getOrders = () => {
      try {
        Apis.orders.GetAllOrders((data) => {
          setOrders(data)
        })
      } catch (error) {
        console.info('molecules/Orders/Orders.js')
        console.error(`Error al obtener ordenes: ${error}`)
      } finally {
        setLoading(true)
      }
    }
    getOrders()
  }, [])

  useEffect(() => {
    if (orders) {
      const audio = new Audio('/media/reception-bell-14620.mp3')
      audio.play()
    }
  }, [orders])

  return (
    <>
      <div className="xo__getOrders mb-24">
        {orders ? (
          <>
            <div className="xo__getOrders__items">
              {orders.filter(order => order.status !== 'Listo para servir').filter(order => order.status !== 'Completado').map(order => (
                <div 
                  className="item mb-4 pb-6 pl-6 pr-6"
                  key={order.uid}
                >
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-6/12">
                          <span className="text-xl">
                            {order.mesa}
                          </span>
                        </td>
                        <td className="text-right pb-4 pt-4 w-6/12">
                          <button 
                            className="btn btn-success uppercase"
                            onClick={() => handleCompleteOrder(order.uid)}
                          >
                            Completar
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <td className="w-1/12">
                          Cant
                        </td>
                        <td className="w-3/12">
                          Nombre
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map(item => (
                        <tr key={item.uid}>
                          <td>
                            {item.cantidad}
                          </td>
                          <td>
                            {item.nombre}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default Orders
