import React, { useEffect, useState } from "react"
import Apis from '@/app/libs/apis'
import { hourFormat, parsePrice, timeFormat } from '@/app/libs/utils'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

const Checkout = () => {
  const [loading, setLoading] = useState(false)
  const [printInfo, setPrintInfo] = useState(false)
  const [tables, setTables] = useState(null)
  const [orders, setOrders] = useState(null)

  const getOrders = (uid) => {
    try {
      Apis.orders.GetOrdersByTable(uid, (data) => {
        setOrders(data[0])
      })
    } catch (error) {
      console.info('molecules/Checkout/Checkout.js getOrders')
      console.error(`Error al obtener ordenes: ${error}`)
    }
  }

  const handleGetTableInfo = async (e) => {
    let uid = e.target.dataset.uid
    setPrintInfo(false)
    getOrders(uid)
  }

  const postPrinters = async (template) => {
    try {
      const res = await Apis.print.PostPrint({ print: { template } })
      console.log(res)
      if ( res.code == 200 ) {
        // TODO: toast success
        console.log('Se imprimio correctamente')
      }
    } catch (error) {
      console.info('molecules/Checkout/Checkout.js postPrinters')
      console.error(`Error al imprimir ticket: ${error}`)
    }
  }

  const generateTP = async () => {
    const items = orders.items.map(item => ({
      quantity: item.cantidad,
      description: item.nombre,
      unitPrice: parsePrice(item.precioUnitario),
      totalPrice: parsePrice(item.precioTotal )
    }))

    const template = {
      header: [
        { text: `FECHA: ${timeFormat(orders.createdAt)}` },
        { text: `MESA: ${orders.mesa}` },
        { text: `CAMARERO: ${orders.encargado.nombre}` }
      ],
      items: items.map(item => [
        { quantity: `${item.quantity}` },
        { description: `${item.description}` },
        { unitPrice: `${item.unitPrice}` },
        { totalPrice: `${item.totalPrice}` },
      ]),
      footer: `TOTAL: ${parsePrice(orders.total)}`
    }
    postPrinters(template)
  }

  const terminateOrderAndOpenTable = async (table, order) => {
    console.log(table, order)
    try {
      Apis.orders.TerminateOrder(order)
    } catch (error) {
      console.info('molecules/Checkout/Checkout.js terminateOrderAndOpenTable')
      console.error(`Error al terminar la orden: ${error}`)
    }
    try {
      Apis.tables.OpenTable(table)
    } catch (error) {
      console.info('molecules/Checkout/Checkout.js terminateOrderAndOpenTable')
      console.error(`Error al abrir la mesa: ${error}`)
    }
  }

  useEffect(() => {
    setLoading(true)
    const fetchData = () => {
      try {
        Apis.tables.GetTables((table) => {
          setTables(table)
        })
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="mb-24 pt-6">
        <div className="xo__mesas flex gap-4 items-start justify-between">
          <div className="w-6/12">
            <h3
              className='font-semibold mb-4 text-xl text-center'
            >
              Nuestras mesas
            </h3>
            <div className='flex flex-wrap gap-4 mb-4 mt-4'>
              {tables ? (
                <>
                  {tables.map(table => (
                    <button
                      key={table.uid}
                      className={`xo__mesas__item ${table.status}`}
                      data-uid={table.uid}
                      onClick={(e) => handleGetTableInfo (e)}
                    >
                      <strong style={{ pointerEvents: 'none' }}>
                        {table.nombre}
                        <span style={{ pointerEvents: 'none' }}>
                          {table.descripcion}
                        </span>
                      </strong>
                    </button>
                  ))}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="w-6/12">
            <div className="w-full flex gap-4 items-start justify-between">
              <div className="w-6/12">
                {orders && (
                  <>
                    {orders.status !== 'Completado' ? (
                      <>
                        <h3
                          className='font-semibold mb-4 text-xl text-center'
                        >
                          Información
                        </h3>
                        <div className="clonethis">
                          <p>
                            {timeFormat(orders.createdAt)} - {hourFormat(orders.createdAt)}
                          </p>
                          <p>
                            {orders.mesa}
                          </p>
                          <p>
                            <strong>Camarero:</strong> {orders.encargado.nombre}
                          </p>
                          <br />
                          <table style={{ width: '100%' }}>
                            <tbody>
                              {orders.items.map(item => (
                                <tr key={item.uid}>
                                  <td style={{ padding: '0.25rem 0.5rem 0.25rem 0', verticalAlign: 'top' }}>
                                    {item.cantidad}
                                  </td>
                                  <td style={{ padding: '0.25rem 0.5rem', verticalAlign: 'top' }}>
                                    {item.nombre}
                                  </td>
                                  <td style={{ padding: '0.25rem 0.5rem', textAlign: 'right', verticalAlign: 'top' }}>
                                    {parsePrice(item.precioUnitario)}
                                  </td>
                                  <td style={{ padding: '0.25rem 0 0.25rem 0.5rem', textAlign: 'right', verticalAlign: 'top' }}>
                                    {parsePrice(item.precioTotal)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <br />
                          {/**
                           * 
                          <p>
                            <strong>Subtotal: </strong> {parsePrice(orders.total)}
                          </p>
                          <p>
                            <strong>IVA 10%: </strong> {parsePrice(orders.total * 0.1)}
                          </p>
                          */}
                          <p>
                            <strong>Total: </strong> {parsePrice(orders.total)}
                          </p>
                        </div>
                        <br />
                        <div className="mb-4">
                          <button
                            className='btn btn-primary uppercase w-full'
                            onClick={generateTP}
                          >
                            Imprimir ticket
                          </button>
                        </div>
                        <div className="mb-4">
                          <button
                            className='btn btn-success uppercase w-full'
                            disabled={!printInfo}
                            onClick={() => terminateOrderAndOpenTable(orders.mesaUid, orders.uid)}
                          >
                            Terminar y abrir mesa
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3
                          className='font-semibold mb-4 text-xl text-center'
                        >
                          Mesa abierta
                        </h3>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="w-6/12">
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout
