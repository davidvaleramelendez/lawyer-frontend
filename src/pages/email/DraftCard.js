/* eslint-disable object-shorthand */

// ** Custom Components & Plugins
import classnames from 'classnames'

// ** Icons Import
import { Star, Paperclip } from 'react-feather'

// ** Reactstrap Imports
import { Input, Label } from 'reactstrap'

// ** Translation
import { T } from '@localization'

const DraftCard = (props) => {
  // ** Props
  const {
    draftItem,
    dispatch,
    selectDraft,
    selectedDrafts,
    handleDraftClick,
    getTransformDate
  } = props


  // ** Function to handle read & mail click
  const onDraftClick = () => {
    handleDraftClick(draftItem)
  }

  return (
    <li onClick={() => onDraftClick(draftItem.id)} className={classnames('d-flex user-mail')}>
      <div className='mail-left pe-50'>
        <div className='user-action'>
          <div className='form-check'>
            <Input
              type='checkbox'
              id={`${draftItem.id}`}
              onChange={(event) => event.stopPropagation()}
              checked={selectedDrafts && selectedDrafts.length && selectedDrafts.findIndex(x => x.id === draftItem.id) !== -1}
              onClick={(event) => {
                dispatch(selectDraft(draftItem))
                event.stopPropagation()
              }}
            />
          </div>
        </div>
      </div>

      <div className='mail-body'>
        <div className='mail-details'>
          <div className='mail-items'>
            <h5 className='mb-25'>
              <span className='text-truncate'>
              {draftItem && draftItem.subject && draftItem.subject !== "" ? draftItem.subject : `(${T('no subject')})`}
              </span>
            </h5>
          </div>

          <div className='mail-meta-item'>
            {draftItem && draftItem.attached_ids !== "" ? <Paperclip size={14} /> : null}
            <span className='mail-date'>
              {draftItem && draftItem.updated_date ? getTransformDate(draftItem.updated_date, "DD MMM YYYY") : draftItem && draftItem.created_at ? getTransformDate(draftItem.created_at, "DD MMM YYYY") : null}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}

export default DraftCard
