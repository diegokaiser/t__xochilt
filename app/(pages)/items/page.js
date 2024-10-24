'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Apis from '@/app/libs/apis'
import { parsePrice } from '@/app/libs/utils'
import LoadingScreen from "@/app/ui/molecules/LoadingScreen";

export default function ItemsPage() {

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState(null)
  const router = useRouter()

  const handleCreateItem = () => {
    router.push('/items/crear')
  }

  useEffect(() => {
    setLoading(true)
    const fetchItems = () => {
      try {
        Apis.menu.GetMenues((menues) => {
          setItems(menues)
        })
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  return (
    <>
      {loading && <LoadingScreen />}
      <div className='mb-24 pt-6'>
        <div className='grid gap-4 xo__items mx-auto my-0 w-11/12'>
          <h3
            className='font-semibold mb-4 text-xl text-center'
          >
            Nuestro menú
          </h3>
          <button
            className='btn btn-success uppercase'
            onClick={handleCreateItem}
          >
            Crear Item
          </button>
          <div className='xo__items__grid mb-4'>
            <div className='xo__items__item'>
              {items ? (
                <>
                  {
                    items.map(item => (
                      <div
                        key={item.uid}
                        className='item flex items-center justify-between pb-3 pt-3'
                      >
                        <span>{item.nombre}</span>
                        <span>{parsePrice(item.precio)}€</span>
                        {/**
                        <Link
                          href={`/items/${item.uid}`}
                          key={item.uid}
                          className='item flex items-center justify-between pb-3 pt-3'
                        >
                          <span>{item.nombre}</span>
                          <span>{parsePrice(item.precio)}€</span>
                           * 
                          <span>{item.tipo}</span>
                        </Link>
                        */}
                      </div>
                    ))
                  }
                </>
              ) : (
                <></>
              )}
            </div>
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
