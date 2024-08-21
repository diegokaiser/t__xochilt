'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { serverTimestamp } from 'firebase/firestore'
import Cookies from 'universal-cookie';
import Apis from '@/app/libs/apis'
import { parsePrice } from '@/app/libs/utils'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

export default function MesasPage() {
  const cookies = new Cookies
  const params = useParams()
  const uid = params.id
  const [loading, setLoading] = useState(false)
  const [table, setTable] = useState(null)
  const [orders, setOrders] = useState(null)
  const router = useRouter()

  const handleCreateItem = () => {
    cookies.set('xochitl-mesa', JSON.stringify(uid), { path: '/' })
    router.push(`/ordenes/crear`)
  }

  const handleCloseTable = () => {
    try {
      Apis.tables.DisableTable(uid)
      router.push('/mesas')
    } catch (error) {
      console.info('mesas/[id]/page.js handleCloseTable')
      console.error(`Error al cerrar mesa: ${error}`)
    }
  }

  const handleEnableTable = () => {
    try {
      Apis.tables.OpenTable(uid)
      router.push('/mesas')
    } catch (error) {
      console.info('mesas/[id]/page.js handleEnableTable')
      console.error(`Error al habilitar mesa: ${error}`)
    }
  }

  const handleTerminateOrder = () => {
    try {
      Apis.orders.TerminateOrder(orders.uid)
    } catch (error) {
      console.info('mesas/[id]/page.js handleTerminateOrder')
      console.error(`Error al terminar orden: ${error}`)
    } finally {
      handleEnableTable()
    }
  }

  const gotoOrder = () => {
    router.push(`/ordenes/${orders.uid}`)
  }

  useEffect(() => {
    setLoading(true)
    const fetchData = () => {
      try {
        Apis.tables.GetTable(uid, (tableData) => {
          setTable(tableData)
        })
      } catch (error) {
        console.info('mesas/[id]/page.js fetchData')
        console.error(`Error al obtener data: ${error}`)
      }
    }
    const getOrders = (uid) => {
      try {
        Apis.orders.GetOrdersByTable(uid, (data) => {
          setOrders(data[0])
        })
      } catch (error) {
        console.info('mesas/[id]/page.js getOrders')
        console.error(`Error al obtener ordenes: ${error}`)
      }
    }
    fetchData()
    getOrders(uid)
    setLoading(false)
  }, [uid])

  return (
    <>
      {loading && <LoadingScreen />}
      <div className='mb-24 pt-6'>
        <div className='grid gap-4 xo__items mx-auto my-0 w-10/12'>
          {table ? (
            <>
              <h3
                className='font-semibold mb-4 text-xl text-center'
              >
                {table.nombre}
              </h3>
              <h5 className='text-center'>
                - {table.descripcion} -
              </h5>
              {table.status == 'Abierto' && (
                <>
                  <button
                    className='btn btn-success uppercase'
                    onClick={handleCreateItem}
                  >
                    Crear Orden
                  </button>
                  <button
                    className='btn btn-danger uppercase'
                    onClick={handleCloseTable}
                  >
                    Cerrar mesa
                  </button>
                </>
              )}
              {table.status == 'Cerrado' && (
                <button
                  className='btn btn-primary uppercase'
                  onClick={handleEnableTable}
                >
                  Abrir mesa
                </button>
              )}
              {orders ? (
                <>
                  <div className='text-sm'>--------------------------------------</div>
                  <table className='w-full'>
                    <tbody>
                      {orders.items.map(item => (
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
                      {/**
                       * 
                      <tr>
                        <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                          <span>
                            Subtotal
                          </span>
                        </td>
                        <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                          <span>
                            {parsePrice(orders.total)}
                          </span>
                        </td>
                      </tr>
                       */}
                      <tr>
                        <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                          <span className='text-2xl'>
                            Total
                          </span>
                        </td>
                        <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                          <span className='text-2xl'>
                            {parsePrice(orders.total)}
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
              {table.status == 'Activo' && (
                <>
                  <button
                    className='btn btn-success uppercase'
                    onClick={gotoOrder}
                  >
                    Modificar orden
                  </button>
                  <button
                    className='btn btn-primary uppercase'
                    onClick={handleTerminateOrder}
                  >
                    Finalizar orden
                  </button>
                </>
              )}
              <Link
                className='btn btn-info uppercase mb-4'
                href='/mesas'
              >
                Regresar
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  )
}
