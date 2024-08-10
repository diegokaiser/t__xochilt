'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";
import Orders from '@/app/ui/molecules/Orders';
import { Checkout } from '@/app/ui/molecules';

export default function OrdenesPage() {
  const cookies = new Cookies
  const [loading, setLoading] = useState(false)
  const [thisUser, setThisUser] = useState({})
  const router = useRouter()

  const gotoOrdenes = () => {
    router.push('/ordenes')
  }

  const gotoMesas = () => {
    router.push('/mesas')
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      if ( true ) router.push('/')
    } catch (error) {
      console.info('dashboard/page.js')
      console.error(`Error al cerrar sesion: ${error}`)
    }
    setLoading(false)
  }

  useEffect(() => {
    const getUser = () => {
      const user = cookies.get('xochitl-user')
      if ( user ) setThisUser(user)
    }
    getUser()
  }, [])
  
  return (
    <>
      <div className='pt-6'>
        <div className='grid gap-4 xo__mainmenu mx-auto my-0 w-11/12'>
          {thisUser && (
            <>
              {thisUser.rol == 'Admin' && (
                <>
                  {
                    /*
                      <Link
                        href={'/ordenes'}
                        className='btn btn-primary uppercase'
                      >
                        Ordenes
                      </Link>
                    */
                  }
                  <Link
                    href={'/mesas'}
                    className='btn btn-primary uppercase'
                  >
                    Mesas
                  </Link>
                  <Link
                    href={'/items'}
                    className='btn btn-primary uppercase'
                  >
                    Items
                  </Link>
                  {
                    /**
                     * 
                      <button
                        className='btn btn-secondary uppercase'
                        onClick={handleLogout}
                      >
                        Cerrar turno
                      </button>
                     */
                  }
                </>
              )}
              {thisUser.rol == 'Cocinero' && (
                <>
                  <Orders />
                </>
              )}
              {thisUser.rol == 'Caja' && (
                <>
                  <Checkout />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
