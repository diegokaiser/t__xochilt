'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';

const Nav = () => {
  const cookies = new Cookies
  const [loading, setLoading] = useState(false)
  const [thisUser, setThisUser] = useState({})
  const router = useRouter()

  const handleLogout = () => {
    setLoading(true)
    cookies.set('xochitl-user', '', { path: '/' })
    router.push('/')
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
      <div className='xo__nav'>
        <div className='flex items-center justify-between mx-auto my-0 w-11/12'>
          <div className='xo__nav__avatar flex items-center'>
            <Image 
              alt={`${thisUser.nombre ? thisUser.nombre : 'Usuario'}`}
              src={thisUser.genero == 'masculino'
                ? '/images/avatarUserMale.png'
                : '/images/avatarUserFem.png'}
              height={35}
              width={35}
              loading='lazy'
            />
            <p className='ml-3'>
              {thisUser.nombre}
            </p>
          </div>
          <div className='xo__nav__actions'>
            <button
              className='btn btn-danger uppercase'
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav
