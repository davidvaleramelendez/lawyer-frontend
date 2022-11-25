// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import NavbarUser from './NavbarUser'
import NavbarBookmarks from './NavbarBookmarks'
import Spinner from '@components/spinner/Simple-grow-spinner'

// ** Store & Actions
import { useSelector } from 'react-redux'

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** Store Vars
  const store = useSelector((state) => state.auth)

  return (
    <Fragment>
      {store && !store.loading ? (
        <Spinner
          className="d-flex justify-content-center position-fixed top-50 w-75 zindex-1"
        />
      ) : null}

      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
