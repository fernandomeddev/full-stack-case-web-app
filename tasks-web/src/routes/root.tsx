import { AuthLayout } from '@/layouts/authLayout'
import { DefaultLayout } from '@/layouts/defaultLayout'
import { Home } from '@/pages/app/Home'
import { ProjectTasks } from '@/pages/app/ProjectTasks'
import { Signin } from '@/pages/auth/Signin'
import { Signup } from '@/pages/auth/Signup'

import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/project/:projectId',
        element: <ProjectTasks />,
      },
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'signin',
        element: <Signin />,
      },
    ],
  }
])