import { RouterProvider } from 'react-router-dom'
import './global.css'
import { Toaster } from 'sonner'
import { router } from './routes/root'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/auth/authContext'

const queryClient = new QueryClient()
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}

