'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import Cookies from "universal-cookie";
import Apis from '@/app/libs/apis'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

export default function Home() {
  const cookies = new Cookies
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await Apis.users.Login(email, password)
      if ( res ) {
        cookies.set('xochitl-user', JSON.stringify(res), { path: '/' })
        router.push('/dashboard')
      } else {
        cookies.set('xochitl-user', '', { path: '/' })
      }
      setLoading(false)
    } catch (error) {
      console.info('page.js')
      console.error(`Error al authenticarse: ${error}`)
    }
  }

  useEffect(() => {
    setLoading(true)
    const user = cookies.get('xochitl-user')
    if ( user ) {
      router.push('/dashboard')
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <div className="h-screen grid grid-cols-12 grid-rows-1 gap-0 login">
      <div className="col-span-7 h-full hidden relative lg:block">
        <div className="image__background h-full">
          <Image 
            src='/images/bkg.jpg'
            alt=""
            priority
            height={0}
            width={0}
            sizes="100vw"
            style={{
              height: '100%',
              objectFit: 'cover',
              width: '100%'
            }}
          />
        </div>
        <div className="absolute bottom-0 image__cortain left-0 right-0 top-0 z-10">
        </div>
        <div className="absolute bottom-0 flex items-center justify-center left-0 right-0 top-0 z-20">
          <Image
            src='/images/logo_web.png'
            alt="El Pastor"
            priority
            height={263}
            width={350}
          />
        </div>
      </div>
      <div className="col-span-12 flex flex-col h-full items-center justify-center lg:col-start-8 lg:col-span-5">
        <div className="form pl-8 pr-8 w-11/12 lg:w-7/12">
          <h2 className="font-semibold mb-6 text-3xl">Hola de nuevo!</h2>
          <p className="mb-8 text-xl">Bienvenido</p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input 
                type="email"
                placeholder="correo electrónico"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input 
                type="password"
                placeholder="**********"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <button 
                className="btn btn-primary w-full"
                type="submit"
                disabled={!password}
              >
                Acceder
              </button>
            </div>
          </form>
          {/**
           * 
          <div>
            <Link href="#">Olvidé mi contraseña</Link>
          </div>
           */}
          3MiJ6R2glGF2Ql

          cB&A(H5QQTsWXMgf
        </div>
      </div>
    </div>
  );
}
