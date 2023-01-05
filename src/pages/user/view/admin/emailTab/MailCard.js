/* eslint-disable object-shorthand */

// ** Custom Components & Plugins
import classnames from 'classnames'

// ** Icons Import
import { Star, Paperclip } from 'react-feather'

// ** Reactstrap Imports
import { Input, Label } from 'reactstrap'

const MailCard = (props) => {
  // ** Props
  const {
    folder,
    mailItem,
    dispatch,
    selectMail,
    labelColors,
    selectedMails,
    handleMailClick,
    getTransformDate,
    markEmailImportant
  } = props

  // ** Function to render labels
  const renderLabels = (labels) => {
    if (labels && labels.length) {
      return labels.map(label => (
        <span key={label} className={`bullet bullet-${labelColors[label]} bullet-sm mx-50`}></span>
      ))
    }
  }

  // ** Function to handle read & mail click
  const onMailClick = () => {
    handleMailClick(mailItem)
  }

  // ** Function to handle important
  const handleMailImportant = (mail) => {
    let type = 'email'
    if (mail && mail.type) {
      type = 'notification'
    }
    dispatch(markEmailImportant({ id: mail.id, type: type }))
  }

  return (
    <li onClick={() => onMailClick(mailItem.id)} className={classnames('d-flex user-mail', { 'mail-read': mailItem.is_read })}>
      <div className='mail-left pe-50'>
        <div className='user-action'>
          <div className='form-check'>
            <Input
              type='checkbox'
              id={`${mailItem.from_data && mailItem.from_data.name}-${mailItem.id}`}
              onChange={(event) => event.stopPropagation()}
              checked={selectedMails && selectedMails.length && selectedMails.findIndex(x => x.id === mailItem.id) !== -1}
              onClick={(event) => {
                dispatch(selectMail(mailItem))
                event.stopPropagation()
              }}
            />
            <Label onClick={e => e.stopPropagation()} for={`${mailItem.from_data && mailItem.from_data.name}-${mailItem.id}`}></Label>
          </div>

          <div
            className='email-favorite'
            onClick={(event) => {
              event.stopPropagation()
              handleMailImportant(mailItem)
            }}
          >
            <Star
              size={14}
              className={classnames({
                favorite: mailItem && mailItem.important
              })}
            />
          </div>
        </div>
      </div>

      <div className='mail-body'>
        <div className='mail-details flex-wrap'>
          <div className='mail-items'>
            <h5 className='mb-25 text-break'>
              {folder === 'sent' ? (
                mailItem && mailItem.receiver && mailItem.receiver.id ? mailItem.receiver.name : null
              ) : (
                mailItem && mailItem.sender && mailItem.sender.id ? mailItem.sender.name : null
              )}

              {mailItem && mailItem.email_group && mailItem.email_group.length ? <span className='text-truncate ms-1 me-1' style={{ color: '#0000FF' }}>({mailItem.email_group.length})</span> : null}
              <span className='text-truncate'>
                {mailItem && mailItem.subject ? mailItem.subject : mailItem.data && mailItem.data.data && mailItem.data.data.subject ? mailItem.data.data.subject : null}
              </span>
            </h5>
          </div>

          <div className='mail-meta-item'>
            {mailItem && mailItem.attachment_id ? <Paperclip size={14} /> : null}
            {mailItem && mailItem.label ? (renderLabels(mailItem.label.split(','))) : null}
            <span className='mail-date'>
              {mailItem && mailItem.date ? getTransformDate(mailItem.date, "DD MMM YYYY") : mailItem && mailItem.created_at ? getTransformDate(mailItem.created_at, "DD MMM YYYY") : null}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}

export default MailCard
