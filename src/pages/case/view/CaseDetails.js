// ** Reactstrap Imports
import { 
  Input,
  Label
} from 'reactstrap'

// Translation
import { useTranslation } from 'react-i18next'

// ** Utils
import { getTransformDate } from '@utils'

// ** Icons Import
import {
  X, 
  Paperclip,
  Check 
} from 'react-feather'

const CaseDetails = ({details}) => {
  // ** Hooks
  const { t } = useTranslation()
  
  return (
    <div>
      {(details.subject || details.Subject) &&
        <div className="row mb-1">
          <div className="col-3">
            <strong>{t("Subject")}: </strong>
          </div>
          <div className="col-9">
            {details.subject ?? details.Subject}
          </div>
        </div>
      }
      {details.title &&
        <div className="row mb-1">
          <div className="col-3">
            <strong>{t("Title")}: </strong>
          </div>
          <div className="col-9">
            {details.title}
          </div>
        </div>
      }
      {details.Content &&
        <div className="row mb-1">
          <div className="col-3">
            <strong>{t("Content")}: </strong>
          </div>
          <div className="col-9">
            {details.Content}
          </div>
        </div>
      }
      {details.description &&
        <div className="row mb-1">
          <div className="col-3">
            <strong>{t("Content")}: </strong>
          </div>
          <div className="col-9">
            {details.description}
          </div>
        </div>
      }
      {details.message &&
        <div className="row mb-1">
          <div className="col-3">
            <strong>{t("Message")}: </strong>
          </div>
          <div className="col-9">
            <div dangerouslySetInnerHTML={{__html: details.message}} />
          </div>
        </div>
      }
      {(details.CreatedAt || details.created_at) &&
        <div className="row mb-1">
          <div className="col-3">
            <strong>{t("Date")}: </strong>
          </div>
          <div className="col-9">
            {getTransformDate(details.CreatedAt ?? details.created_at, "DD.MM.YYYY")}
          </div>
        </div>
      }
      {details.attachment && typeof (details.attachment) === 'object' && details.attachment.length > 0 &&
        <div className="row mb-1">
          <div className="col-3">
            <strong>{t("Files")}: </strong>
          </div>
          <div className="col-9">
            {details.attachment.map((item, index) => {
              return (
                <div className="inline" key={`attachment_${index}`}>
                  <Paperclip className='cursor-pointer ms-50 me-1' size={17} />
                  {item && item.path ? (<a href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${item.path}`} target="_blank" className="me-1">{item.name}</a>) : null}
                </div>
              )
            })}
          </div>
        </div>
      }
      {details.attachment && typeof (details.attachment) === 'string' &&
        <div className="row mb-1">
          <div className="col-3">
            <strong>{t("File")}: </strong>
          </div>
          <div className="col-9">
            <div className="inline">
              <Paperclip className='cursor-pointer ms-50 me-1' size={17} />
              <a href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${details.attachment}`} target="_blank" className="me-1">attachment</a>
            </div>
          </div>
        </div>
      }
      {details.isErledigt &&
        <div className="row mb-1">
          <div className="col-3">
            <strong>{t("Done?")}: </strong>
          </div>
          <div className="col-9">
            <div className='form-switch form-check-primary'>
              <Input
                type='switch'
                checked={details.isErledigt}
                className="cursor-pointer"
                readOnly={true}
              />
              <Label className='form-check-label' htmlFor="icon-primary">
                <span className='switch-icon-left'>
                  <Check size={14} />
                </span>
                <span className='switch-icon-right'>
                  <X size={14} />
                </span>
              </Label>
            </div>
          </div>
        </div>
      }
      {(details.interval_time) &&
        <div className="row mb-1">
          <div className="col-3">
            <strong>{t("Interval Tiime")}: </strong>
          </div>
          <div className="col-9">
            {details.interval_time} S
          </div>
        </div>
      }
      
    </div>
  )
}

export default CaseDetails