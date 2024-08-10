'use client'

import { useState } from 'react';
import Link from 'next/link';
import { serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation';
import Apis from '@/app/libs/apis'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

export default function TableCrear() {

  const [loading, setLoading] = useState(false)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const router = useRouter()

  const handleCreateTable = async (e) => {
    e.preventDefault()
    setLoading(true)

    const table = {
      nombre,
      descripcion,
      status: 'Abierto',
      createdAt: serverTimestamp()
    }
    try {
      await Apis.tables.PostTable(table)
    } catch (error) {
      console.info('mesas/crear/page.js handleCreateTable')
      console.error(`Error al crear mesa: ${error}`)
    } finally {
      setLoading(false)
      router.push('/mesas')
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
            Crear Mesa
          </h3>
          <form onSubmit={handleCreateTable}>
            <div className="mb-4">
              <input
                type='text'
                placeholder='Nombre'
                onChange={(e) => setNombre(e.target.value)}
                required
              />
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
                href={'/mesas'}
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
