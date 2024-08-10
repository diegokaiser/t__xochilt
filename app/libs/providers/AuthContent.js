'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "universal-cookie"

const AuthProvider = ({ children }) => {
  const router = useRouter()
  const cookies = new Cookies()

  useEffect(() => {
    const user = cookies.get('xochitl-user')
    if ( !user ) {
      router.push('/')
    }
  }, [router])

  return (
    <>
      { children }
    </>
  )
}

export default AuthProvider
