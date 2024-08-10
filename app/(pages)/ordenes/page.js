'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

export default function OrdenesPage() {

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreateOrder = () => {
    router.push('/ordenes/crear')
  }

  const handleSeeOrders = () => {
    setLoading(true)
    try {
      setLoading(false)
      
    } catch (error) {
      console.info('ordenes/page.js handleSeeOrders')
      console.error(`Error al crear orden: ${error}`)
    }
  }
  
  return (
    <>
      <div className='mb-24 pt-6'>
        <div className='grid gap-4 xo__mesas mx-auto my-0 w-11/12'>
          <h3
            className='font-semibold mb-4 text-xl text-center'
          >
            Ordenes
          </h3>
          <button
            className='btn btn-success uppercase'
            onClick={handleCreateOrder}
          >
            Crear Orden
          </button>
          {/*
              <button
                className='btn btn-primary uppercase'
                onClick={handleSeeOrders}
              >
                Ver orden asignadas
              </button>
          */}
          <Link
            className='btn btn-info uppercase mb-4'
            href='/dashboard'
          >
            Regresar
          </Link>
        </div>
      </div>
    </>
  )
}
