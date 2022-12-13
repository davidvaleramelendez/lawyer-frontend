// ** Third Party Components
import { MoreHorizontal } from 'react-feather'

// ** Translation
import { T } from '@localization'

const VerticalNavMenuSectionHeader = ({ item }) => {
  return (
    <li className='navigation-header'>
      <span>{T(item.header)}</span>
      <MoreHorizontal className='feather-more-horizontal' />
    </li>
  )
}

export default VerticalNavMenuSectionHeader
