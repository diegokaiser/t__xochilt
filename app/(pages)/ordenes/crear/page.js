'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { serverTimestamp } from 'firebase/firestore'
import { PlusCircle, Trash } from '@phosphor-icons/react/dist/ssr';
import Cookies from 'universal-cookie';
import Apis from '@/app/libs/apis'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

export default function OrderCrear() {
  const cookies = new Cookies
  const [loading, setLoading] = useState(false)
  const [thisUser, setThisUser] = useState({})
  const [thisMesa, setThisMesa] = useState(null)
  const [mesas, setMesas] = useState(null)
  const [nameMesa, setNameMesa] = useState(null)
  const [activeMesa, setActiveMesa] = useState(null)
  const [menu, setMenu] = useState(false)
  const [items, setItems] = useState(null) // items registrados en la orden, por si la orden se modifica
  const [itemsOrder, setItemsOrder] = useState([]) // items locales, previos a registrar la orden o modificarla
  const [searchTerm, setSearchTerm] = useState('')

  const [formMesa, setFormMesa] = useState('')
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

  const getMesas = (status) => {
    try {
      Apis.tables.GetTablesByStatus(status, (data) => {
        setMesas(data)
      })
    } catch (error) {
      console.info('ordenes/crear/page.js getMesas')
      console.error(`Error al obtener items: ${error}`)
    }
  }

  const getMesa = (table) => {
    try {
      Apis.tables.GetTable(table, (data) => {
        setActiveMesa(data.status)
        setNameMesa(data.nombre)
      })
    } catch (error) {
      console.info('ordenes/crear/page.js getMesa')
      console.error(`Error al obtener mesa: ${error}`)
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

  const openTable = async (table) => {
    try {
      await Apis.tables.ActivateTable(table)
    } catch (error) {
      console.info('ordenes/crear/page.js handleCreateOrder')
      console.error(`Error al modificar mesa: ${error}`)
    }
  }
  
  const handleCreateOrder = async (e) => {
    e.preventDefault()
    setLoading(true)

    const order = {
      mesa: nameMesa,
      mesaUid: formMesa,
      encargado: thisUser,
      items: itemsOrder,
      subtotal: itemsOrder.reduce((acc, item) => acc + item.precioTotal, 0),
      total: itemsOrder.reduce((acc, item) => acc + item.precioTotal, 0),
      status: 'Abierto',
      createdAt: serverTimestamp(),
      updatedAt: '',
      closedAt: ''
    }
    openTable(formMesa)
    try {
      await Apis.orders.PostOrder(order)
      // TODO, modificar el estado de la mesa a Activo
    } catch (error) {
      console.info('ordenes/crear/page.js handleCreateOrder')
      console.error(`Error al crear order: ${error}`)
    } finally {
      setLoading(false)
      router.push('/dashboard')
    }
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

  useEffect(() => {
    const getUser = () => {
      const user = cookies.get('xochitl-user')
      if ( user ) setThisUser(user)
    }
    getUser()
    getMesas('Abierto')
    const getFormMesa = () => {
      const mesa = cookies.get('xochitl-mesa')
      if ( mesa ) {
        getMesa(mesa)
        setFormMesa(mesa)
      } else {
        setFormMesa('0')
      }
    }
    getFormMesa()
  }, [])

  return (
    <>
      { loading && <LoadingScreen/> }
      <div className='mb-24 pt-6'>
        <div className='grid gap-4 xo__mesas mx-auto my-0 w-10/12'>
          <h3
            className='font-semibold mb-4 text-xl text-center'
          >
            Crear Orden
          </h3>
          <form onSubmit={handleCreateOrder}>
            <div className='mb-3 text-sm'>Mesa</div>
            <div className="mb-4">
              <select
                value={formMesa}
                onChange={e => setFormMesa(e.target.value)}
              >
                <option value='0'>Seleccionar mesa</option>
                {mesas && (
                  <>
                    {
                      mesas.map(mesa => (
                        <option 
                          key={mesa.uid}
                          value={mesa.uid}
                          data-mesa={mesa.nombre}
                        >
                          {mesa.nombre}
                        </option>
                      ))
                    }
                  </>
                )}
              </select>
            </div>
            <div className='mb-3 text-sm'>Agregar</div>
            { !menu ? (
              <>
                <div className="mb-4">
                  <button
                    className='btn btn-info w-full uppercase'
                    data-tipo='Buffet'
                    type='button'
                    onClick={(e) => openItems(e)}
                  >
                    <PlusCircle size={21} />
                    Buffet
                  </button>
                </div>
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
            { itemsOrder.length > 0 ? (
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
            ) : (
              <></>
            )}
            {activeMesa == 'Activo' ? (
              <>
                {/** 
                 * 
                <div className="mb-4">
                  <button
                    className='btn btn-primary w-full uppercase'
                    type='button'
                    onClick={handleModifyOrder}
                  >
                    Modificar Orden
                  </button>
                </div>
                <div className="mb-4">
                  <button
                    className='btn btn-success w-full uppercase'
                    type='button'
                    onClick={handleTerminateOrder}
                  >
                    Generar ticket
                  </button>
                </div>
                */}
              </>
            ) : (
              <>
                <div className="mb-4">
                  <button
                    className='btn btn-success w-full uppercase'
                    type='submit'
                  >
                    Registrar Orden
                  </button>
                </div>
                <div className="mb-4">
                  <Link
                    href={'/mesas'}
                    className='btn btn-danger w-full uppercase'
                  >
                    Cancelar Orden
                  </Link>
                </div>
              </>  
            )}
          </form>
        </div>
      </div>
    </>
  )
}
