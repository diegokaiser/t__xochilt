import { PrimeReactProvider } from 'primereact/api'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'

export default function RootLayout({ children }) {
  return (
    <PrimeReactProvider>
      {children}
    </PrimeReactProvider>
  )
}