// ** React Imports
import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'

// ** Store
import { useSelector } from 'react-redux'

// ** Configs
import menuConfig from '@configs/menuConfig'

const RoleWrapper = ({ children, route }) => {
  
  let hasRole = true
  const RoleName = useSelector(state => state.auth.userItem.role?.RoleName || null)

  if (route.meta && route.meta.id) {
    hasRole = RoleName ? menuConfig[RoleName][route.meta.id] !== false : false
  }
  
  if (!hasRole) {
    return <Navigate to='/error-page' />
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default RoleWrapper
