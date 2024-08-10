'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import Apis from '@/app/libs/apis'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

export default function MesasPage() {
  const cookies = new Cookies
  const [loading, setLoading] = useState(false)
  const [tables, setTables] = useState(null)
  const router = useRouter()

  const handleCreateTable = async () => {
    router.push('/mesas/crear')
  }

  useEffect(() => {
    cookies.set('xochitl-mesa', '', { path: '/' })
    setLoading(true)
    const fetchTables = () => {
      try {
        Apis.tables.GetTables((table) => {
          setTables(table)
        })
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchTables()
  }, [])
 
  return (
    <>
      {loading && <LoadingScreen />}
      <div className="mb-24 pt-6">
        <div className="grid xo__mesas mx-auto my-0 w-11/12">
          <h3
            className='font-semibold mb-4 text-xl text-center'
          >
            Nuestras mesas
          </h3>
          <button
            className='btn btn-success uppercase'
            onClick={handleCreateTable}
          >
            Crear Mesa
          </button>
          <div className='flex flex-wrap gap-4 mb-4 mt-4'>
            {tables ? (
              <>
                {tables.map(table => (
                  <Link
                    href={`/mesas/${table.uid}`}
                    key={table.uid}
                    className={`xo__mesas__item ${table.status}`}
                  >
                    <strong>
                      {table.nombre}
                      <span>
                        {table.descripcion}
                      </span>
                    </strong>
                  </Link>
                ))}
              </>
            ) : (
              <></>
            )}
          </div>
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
