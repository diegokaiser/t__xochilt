'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { PlusCircle, Trash } from '@phosphor-icons/react/dist/ssr';
import Apis from '@/app/libs/apis'
import { parsePrice, timeFormat } from '@/app/libs/utils'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

export default function OrdenPage() {
  const params = useParams()
  const uid = params.id
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [table, setTable] = useState(null)

  const [menu, setMenu] = useState(false)
  const [items, setItems] = useState(null) // items registrados en la orden, por si la orden se modifica
  const [itemsOrder, setItemsOrder] = useState([]) // items locales, previos a registrar la orden o modificarla
  const [searchTerm, setSearchTerm] = useState('')

  const router = useRouter()

  const getItems = (type) => {
    try {
      Apis.menu.GetMenuesByType(type, (data) => {
        setItems(data)
      })
    } catch (error) {
      console.info('ordenes/crear/page.js getItems')
      console.error(`Error al obtener items: ${error}`)
    }
  }

  const openItems = (e) => {
    let type = e.target.dataset.tipo
    getItems(type)
    setMenu(true)
  }

  const closeItems = () => {
    setMenu(false)
    setItems(null)
    setSearchTerm('')
  }

  const filteredItems = items?.filter(
    item => item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectionItem = (item) => {
    setItemsOrder(prevItemsOrder => {
      const existingItem = prevItemsOrder.find(orderItem => orderItem.uid === item.uid)
      if (existingItem) {
        return prevItemsOrder.map(orderItem =>
          orderItem.uid === item.uid
            ? {
                ...orderItem,
                cantidad: orderItem.cantidad + 1,
                precioTotal: orderItem.precioUnitario * (orderItem.cantidad + 1)
              }
            : orderItem
        )
      } else {
        return [
          ...prevItemsOrder,
          {
            uid: item.uid,
            cantidad: 1,
            nombre: item.nombre,
            precioUnitario: item.precio,
            precioTotal: item.precio
          }
        ]
      }
    })
  }

  const handleRemoveItem = (uid) => {
    setItemsOrder(prevItemsOrder => {
      const existingItem = prevItemsOrder.find(orderItem => orderItem.uid === uid)
      if (existingItem) {
        if (existingItem.cantidad === 1) {
          return prevItemsOrder.filter(orderItem => orderItem.uid !== uid)
        } else {
          return prevItemsOrder.map(orderItem =>
            orderItem.uid === uid
              ? {
                ...orderItem,
                cantidad: orderItem.cantidad - 1,
                precioTotal: orderItem.precioUnitario * (orderItem.cantidad - 1)
              }
              : orderItem
          )
        }
      }
      return prevItemsOrder
    })
  }

  const handleModifyOrder = async (e) => {
    e.preventDefault()
    setLoading(true)

    const modifiedItems = [...order.items]

    itemsOrder.forEach(item => {
      const existingItemIndex = modifiedItems.findIndex(orderItem => orderItem.uid === item.uid)

      if (existingItemIndex !== -1) {
        modifiedItems[existingItemIndex].cantidad += item.cantidad
        modifiedItems[existingItemIndex].precioTotal += item.precioTotal
      } else {
        modifiedItems.push(item)
      }
    })

    const modifiedOrder = {
      ...order,
      items: modifiedItems,
      subtotal: modifiedItems.reduce((acc, item) => acc + item.precioTotal, 0),
      total: modifiedItems.reduce((acc, item) => acc + item.precioTotal, 0),
    }
    try {
      await Apis.orders.PatchOrder(uid, modifiedOrder)
    } catch (error) {
      console.info(`ordenes/${uid}/page.js handleModifyOrder`)
      console.error(`Error al modificar order: ${error}`)
    } finally {
      setLoading(false)
      router.push('/mesas')
    }
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
        <div className='grid gap-4 xo__mesas mx-auto my-0 w-10/12'>
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
                    <td className='py-1' style={{ verticalAlign: 'top' }}>
                      {order.mesa}
                    </td>
                  </tr>
                </tbody>
              </table>
              {order.status == 'Abierto' && (
                <>
                  <form onSubmit={handleModifyOrder}>
                    <div className='mb-3 text-sm'>Agregar a la orden existente:</div>
                    { !menu ? (
                      <>
                        <div className="mb-4">
                          <button
                            className='btn btn-info w-full uppercase'
                            data-tipo='Dúos'
                            type='button'
                            onClick={(e) => openItems(e)}
                          >
                            <PlusCircle size={21} />
                            Dúos
                          </button>
                        </div>
                        <div className="mb-4">
                          <button
                            className='btn btn-info w-full uppercase'
                            data-tipo='Entrantes'
                            type='button'
                            onClick={(e) => openItems(e)}
                          >
                            <PlusCircle size={21} />
                            Entrantes
                          </button>
                        </div>
                        <div className="mb-4">
                          <button
                            className='btn btn-info w-full uppercase'
                            data-tipo='Platos'
                            type='button'
                            onClick={(e) => openItems(e)}
                          >
                            <PlusCircle size={21} />
                            Platos
                          </button>
                        </div>
                        <div className="mb-4">
                          <button
                            className='btn btn-info w-full uppercase'
                            data-tipo='Postres'
                            type='button'
                            onClick={(e) => openItems(e)}
                          >
                            <PlusCircle size={21} />
                            Postres
                          </button>
                        </div>
                        <div className="mb-4">
                          <button
                            className='btn btn-info w-full uppercase'
                            data-tipo='Bebidas y Cocktails'
                            type='button'
                            onClick={(e) => openItems(e)}
                          >
                            <PlusCircle size={21} />
                            Bebidas y Cocktails
                          </button>
                        </div>
                        <div className="mb-4">
                          <button
                            className='btn btn-info w-full uppercase'
                            data-tipo='Menús'
                            type='button'
                            onClick={(e) => openItems(e)}
                          >
                            <PlusCircle size={21} />
                            Menu
                          </button>
                        </div>
                        <div className="mb-4">
                          <button
                            className='btn btn-info w-full uppercase'
                            data-tipo='Extras'
                            type='button'
                            onClick={(e) => openItems(e)}
                          >
                            <PlusCircle size={21} />
                            Extras
                          </button>
                        </div>
                        <div className="mb-4">
                          <button
                            className='btn btn-info w-full uppercase'
                            data-tipo='Aguas frescas'
                            type='button'
                            onClick={(e) => openItems(e)}
                          >
                            <PlusCircle size={21} />
                            Aguas frescas
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='mb-4'>
                          <div className='xo__search'>
                            <input
                              type='text'
                              placeholder='Buscar...'
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className='mb-4'>
                          <div className='flex flex-wrap gap-4 xo__results'>
                            {filteredItems ? (
                              <>
                                {filteredItems.map(item => (
                                  <div 
                                    key={item.uid} 
                                    className={`xo__results__item`}
                                  >
                                    <button
                                      className='xo__results__button'
                                      type='button'
                                      onClick={() => handleSelectionItem(item)}
                                    >
                                      <strong>
                                        {item.nombre}
                                        <span>{item.precio}€</span>
                                        <span>Cantidad: {itemsOrder.find(orderItem => orderItem.uid === item.uid)?.cantidad || 0}</span>
                                      </strong>
                                    </button>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        <div className='mb-4'>
                          <button
                            className='btn btn-primary w-full uppercase'
                            type='button'
                            onClick={closeItems}
                          >
                            Listo
                          </button>
                        </div>
                      </>
                    )}
                    { itemsOrder.length > 0 && (
                      <>
                        <div className='mb-3 text-sm'>Elementos agregados:</div>
                        <div className='mb-3 text-sm'>--------------------------------------</div>
                        <table className='w-full'>
                          <tbody>
                            {itemsOrder.map(item => (
                              <tr
                                key={item.uid}
                              >
                                <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                                  {item.cantidad}
                                </td>
                                <td className='px-2 py-1' style={{ verticalAlign: 'top' }}>
                                  {item.nombre}
                                </td>
                                <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                                  {item.precioUnitario}€
                                </td>
                                <td className='px-2 py-1 text-right'>
                                  <button
                                    onClick={() => handleRemoveItem(item.uid)}
                                  >
                                    <Trash size={28} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className='mb-3 text-sm'>======================================</div>
                      </>
                    )}
                    <button
                      className='btn btn-success w-full uppercase'
                      type='submit'
                    >
                      Modificar orden
                    </button>        
                  </form>
                </>
              )}
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
                  {/**
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
                  */}
                  <tr>
                    <td className='pr-2 py-1' style={{ verticalAlign: 'top' }}>
                      <span className='text-2xl'>
                        Total
                      </span>
                    </td>
                    <td className='px-2 py-1 text-right' style={{ verticalAlign: 'top' }}>
                      <span className='text-2xl'>
                        {parsePrice(order.total)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className='text-sm'>--------------------------------------</div>
            </>
          ) : (
            <>
            </>
          )}
          {/**
           * 
          <button
            className='btn btn-success uppercase'
            onClick={handleGenerateTicket}
          >
            Finalizar orden
          </button>
           */}
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
