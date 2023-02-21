// ** Router imports
import { lazy } from 'react'

// ** Router imports
import { useRoutes, Navigate } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

// ** Utils
import {
  getCurrentUser
} from '@utils'

import authenticationConfig from '@src/configs/authenticationConfig'

// ** GetRoutes
import { getRoutes } from './routes'

// ** Components
const Error = lazy(() => import('@src/pages/auth/Error'))
const ForgotPassword = lazy(() => import('@src/pages/auth/ForgotPassword'))
const NotAuthorized = lazy(() => import('@src/pages/auth/NotAuthorized'))
const Forbidden = lazy(() => import('@src/pages/auth/Forbidden'))
const FormBuilderPublish = lazy(() => import('@src/pages/formBuilder/publish'))

let Login = lazy(() => import('@src/pages/auth/login/LoginCover'))
if (authenticationConfig && authenticationConfig.LoginTemplate) {
  if (authenticationConfig.LoginTemplate.basic) {
    Login = lazy(() => import('@src/pages/auth/login/LoginBasic'))
  }

  if (authenticationConfig.LoginTemplate.cover) {
    Login = lazy(() => import('@src/pages/auth/login/LoginCover'))
  }

  if (authenticationConfig.LoginTemplate.simple) {
    Login = lazy(() => import('@src/pages/auth/login/LoginSimple'))
  }
}

const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)
  const getHomeRoute = () => {
    const user = getCurrentUser()
    if (user) {
      return `/dashboard`
    } else {
      return '/login'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    {
      path: '/login',
      element: <BlankLayout />,
      children: [{ path: '/login', element: <Login /> }]
    },
    {
      path: '/forgot-password',
      element: <BlankLayout />,
      children: [{ path: '/forgot-password', element: <ForgotPassword /> }]
    },
    {
      path: '/auth/not-auth',
      element: <BlankLayout />,
      children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    {
      path: '/forbidden',
      element: <BlankLayout />,
      children: [{ path: '/forbidden', element: <Forbidden /> }]
    },
    {
      path: '/form/:formLink',
      element: <BlankLayout />,
      children: [{ path: '/form/:formLink', element: <FormBuilderPublish status={true} />}]
    },
    ...allRoutes
  ])

  return routes
}

export default Router
