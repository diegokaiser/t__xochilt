import React, { useEffect, useRef, useState } from "react"
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import Apis from '@/app/libs/apis'
import { parsePrice, timeFormat } from '@/app/libs/utils'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";
import { TemplateContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

const Checkout = () => {
  const [loading, setLoading] = useState(false)
  const [printers, setPrinters] = useState(null)
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

  const getPrinters = async () => {
    try {
      const { data } = await Apis.print.GetPrinters()
      setPrinters(data.toString())
    } catch (error) {
      console.info('molecules/Checkout/generateTP.js getOrders')
      console.error(`Error al obtener impresoras: ${error}`)
    }
  }

  const postPrinters = async (template) => {
    try {
      const { data } = await Apis.print.PostPrinters(template)
      setPrintInfo(data)
    } catch (error) {
      console.info('molecules/Checkout/generateTP.js getOrders')
      console.error(`Error al obtener impresoras: ${error}`)
    }
  }

  const generateTP = async () => {
    getPrinters()
    const thisElement = document.querySelector('.clonethis')
    const htmlAImprimir = thisElement.innerHTML
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ticket</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
          }

          table {
            border-collapse: collapse;
          }

          table,
          th,
          td {
            border: 1px solid black;
          }

          th,
          td {
            padding: 5px;
          }

          th {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        ${htmlAImprimir}
      </body>
      </html>
    `
    const template = JSON.stringify({
      nombreImpresora: printers,
      serial: '',
      operaciones: [
        {
          nombre: "Iniciar",
          argumentos: []
        },
        {
          nombre: "GenerarImagenAPartirDeHtmlEImprimir",
          "argumentos": [
            html,
            580,
            580,
            0
          ]
        }
      ]
    })
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
                            {timeFormat(orders.createdAt)}
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
