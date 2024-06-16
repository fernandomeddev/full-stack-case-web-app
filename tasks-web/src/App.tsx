import { RouterProvider } from 'react-router-dom'
import './global.css'
import { Toaster } from 'sonner'
import { router } from './routes/root'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}

