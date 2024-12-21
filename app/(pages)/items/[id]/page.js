'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { serverTimestamp } from 'firebase/firestore';
import Apis from '@/app/libs/apis'

const PageItem = () => {
  const params = useParams()
  const uid = params.id
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [tipo, setTipo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [item, setItem] = useState(null)

  const handleUpdateItem = async (e) => {
    e.preventDefault()
    setLoading(true)

    const menu = {
      nombre,
      precio: parseFloat(precio),
      tipo,
      descripcion,
      uptatedAt: serverTimestamp()
    }
    try {
      await Apis.menu.PatchMenu(uid, menu)
      console.log('actualizado')
    } catch (error) {
      console.info(`items/${uid}/page.js handleUpdateItem`)
      console.error(`Error al crear item: ${error}`)
    } finally {
      setLoading(false)
      router.push('/items/list')
    }
  }

  useEffect(() => {
    const getItem = () => {
      Apis.menu.GetMenu(uid, (item) => {
        if (item) {
          setItem(item)
          setNombre(item.nombre || '')
          setPrecio(item.precio || '')
          setTipo(item.tipo || '')
          setDescripcion(item.descripcion || '')
        }
      })
    }
    getItem()
  },[uid])

  return (
    <div className='mb-24 pt-6'>
      <div className='grid gap-4 xo__mesas mx-auto my-0 w-10/12'>
        {item && (
          <>
            <h3
              className='font-semibold mb-4 text-xl text-center'
            >
              {item.nombre}
            </h3>
            <form onSubmit={handleUpdateItem}>
              <div className="mb-4">
                <input
                  type='text'
                  placeholder='Nombre'
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type='number'
                  step='0.01'
                  placeholder='Precio'
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                >
                  <option value=''>Seleccionar tipo</option>
                  <option value='Duos'>Duos</option>
                  <option value='Entrantes'>Entrantes</option>
                  <option value='Platos'>Platos</option>
                  <option value='Postres'>Postres</option>
                  <option value='Aguas frescas'>Aguas frescas</option>
                  <option value='Bebidas y Cocktails'>Bebidas y Cocktails</option>
                  <option value='Menús'>Menús</option>
                  <option value='Extras'>Extras</option>
                  <option value='Buffet'>Buffet</option>
                </select>
              </div>
              <div className="mb-4">
                <textarea
                  placeholder='Descripción'
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                >
                </textarea>
              </div>
              <div className="mb-4">
                <button
                  className='btn btn-success w-full uppercase'
                  type='submit'
                >
                  Actualizar
                </button>
              </div>
              <div className="mb-4">
                <Link
                  href={'/items/list'}
                  className='btn btn-danger w-full uppercase'
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default PageItem