// ** React Imports
import { Navigate } from 'react-router-dom'

// ** Store
import { useSelector } from 'react-redux'

const RoleRestriction = ({ route }) => {
  const roleId = useSelector(state => state.auth.userItem.role_id || null)

  if (route.meta && route.meta.restrictRole) {
    if (route.meta.restrictRole.indexOf(roleId) !== -1) {
      return <Navigate to='/forbidden' />
    }
  }
}

export default RoleRestriction
