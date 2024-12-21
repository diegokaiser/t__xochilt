'use client'

import { useState } from 'react';
import Link from 'next/link';
import { serverTimestamp } from 'firebase/firestore'
import { storage } from '@/app/libs/utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Apis from '@/app/libs/apis'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

export default function ItemCrear() {

  const [loading, setLoading] = useState(false)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [imagen, setImagen] = useState(null)
  const [tipo, setTipo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const router = useRouter()

  const handleCreateItem = async (e) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = ''
    if ( imagen ) {
      const imageRef = ref(storage, `images/${imagen.name}`)
      await uploadBytes(imageRef, imagen)
      imageUrl = await getDownloadURL(imageRef)
    }

    const menu = {
      nombre,
      precio: parseFloat(precio),
      tipo,
      descripcion,
      imagen: imageUrl,
      status: 'Activo',
      createdAt: serverTimestamp()
    }
    try {
      await Apis.menu.PostMenu(menu)
    } catch (error) {
      console.info('items/crear/page.js handleCreateItem')
      console.error(`Error al crear item: ${error}`)
    } finally {
      setLoading(false)
      router.push('/items')
    }
  }

  return (
    <>
      { loading && <LoadingScreen/> }
      <div className='mb-24 pt-6'>
        <div className='grid gap-4 xo__mesas mx-auto my-0 w-10/12'>
          <h3
            className='font-semibold mb-4 text-xl text-center'
          >
            Crear Item
          </h3>
          <form onSubmit={handleCreateItem}>
            <div className="mb-4">
              <input
                type='text'
                placeholder='Nombre'
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type='number'
                step='0.01'
                placeholder='Precio'
                onChange={(e) => setPrecio(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type='file'
                onChange={(e) => setImagen(e.target.files[0])}
              />
            </div>
            <div className="mb-4">
              <select
                onChange={(e) => setTipo(e.target.value)}
                required
              >
                <option value=''>Seleccionar tipo</option>
                <option value='Duos'>Duos</option>
                <option value='Entrantes'>Entrantes</option>
                <option value='Platos'>Platos</option>
                <option value='Postres'>Postres</option>
                <option value='Bebidas y Cocktails'>Bebidas y Cocktails</option>
                <option value='Aguas frescas'>Aguas frescas</option>
                <option value='Menús'>Menús</option>
                <option value='Extras'>Extras</option>
                <option value='Buffet'>Buffet</option>
              </select>
            </div>
            <div className="mb-4">
              <textarea
                placeholder='Descripción'
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
                Registrar
              </button>
            </div>
            <div className="mb-4">
              <Link
                href={'/items'}
                className='btn btn-danger w-full uppercase'
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
