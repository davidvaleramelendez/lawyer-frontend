const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-start d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a href='https://1.envato.market/pixinvent_portfolio' target='_blank' rel='noopener noreferrer'>
          Conectia
        </a>
        <span className='d-none d-sm-inline-block'>, All rights Reserved</span>
      </span>
    </p>
  )
}

export default Footer
