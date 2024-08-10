'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Apis from '@/app/libs/apis'
import { parsePrice, timeFormat } from '@/app/libs/utils'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

export default function OrdenPage() {
  const params = useParams()
  const uid = params.id
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [table, setTable] = useState(null)
  const router = useRouter()

  const handleGenerateTicket = () => {

  }

  useEffect(() => {
    setLoading(true)
    const getOrder = (uid) => {
      try {
        Apis.orders.GetOrder(uid, (data) => {
          setOrder(data)
        })
      } catch (error) {
        console.info('ordenes/[id]/page.js getOrder')
        console.error(`Error al obtener data: ${error}`)
      }
    }
    getOrder(uid)
    const getTable = (table) => {
      try {
        Apis.tables.GetTable(order.mesa, (data) => {
          setTable(data)
        })
      } catch (error) {
        console.info('ordenes/[id]/page.js getTable')
        console.error(`Error al obtener mesa: ${error}`)
      }
    }
    if (order) getTable(order.mesa)
    setLoading(false)
  }, [])

  return (
    <>
      {loading && <LoadingScreen />}
      <div className='mb-24 pt-6'>
        <div className='grid gap-3 xo__items mx-auto my-0 w-10/12'>
          <h3
            className='font-semibold mb-4 text-xl text-center'
          >
            Detalle de Orden
          </h3>
          {order ? (
            <>
              <table className='w-full'>
                <tbody>
                  <tr>
                    <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                      {timeFormat(order.createdAt)}
                    </td>
                    <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                      {table && (
                        <>
                          {table.nombre}
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                      Orden: 00001
                    </td>
                    <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                      Camarero: {order.encargado.nombre}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className='text-sm'>--------------------------------------</div>
              <table className='w-full'>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.uid}>
                      <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                        {item.cantidad}
                      </td>
                      <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                        {item.nombre}
                      </td>
                      <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                        {parsePrice(item.precioUnitario)}
                      </td>
                      <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                        {parsePrice(item.precioTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='text-sm'>======================================</div>
              <table className='w-full'>
                <tbody>
                  <tr>
                    <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                      <span>
                        Subtotal
                      </span>
                    </td>
                    <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                      <span>
                        {parsePrice(order.total)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                      <span>
                        IVA 10%
                      </span>
                    </td>
                    <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                      <span>
                        {parsePrice(order.total * 0.1)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                      <span className='text-2xl'>
                        Total
                      </span>
                    </td>
                    <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                      <span className='text-2xl'>
                        {parsePrice(order.total + (order.total * 0.1))}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className='text-sm'>--------------------------------------</div>
            </>
          ) : (
            <></>
          )}
          <button
            className='btn btn-success uppercase'
            onClick={handleGenerateTicket}
          >
            Finalizar orden
          </button>
          <Link
            className='btn btn-info uppercase mb-4'
            href='/ordenes'
          >
            Regresar
          </Link>
        </div>
      </div>
    </>
  )
}
