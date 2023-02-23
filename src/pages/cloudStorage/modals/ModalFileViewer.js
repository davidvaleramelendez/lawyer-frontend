// ** Third Party Components
import FileViewer from "react-file-viewer"

// ** Reactstrap Import
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap"

// ** Translation
import { T } from '@localization'

// ** Utils
import {
  getWebPreviewUrl
} from '@utils'

import { ExternalLink, Share2 } from "react-feather"

const ModalFileViewer = ({
  closeModal,
  fileViewInfo,
  handleMarkShare
}) => {

  /* Rendering file preview web url */
  const renderFileWebUrlPreview = (path) => {
    if (path) {
      return getWebPreviewUrl(path)
    }

    return false
  }

  const handleShare = () => {
    handleMarkShare(fileViewInfo)
    closeModal()
  }

  return (
    <div className="disabled-backdrop-modal">
      <Modal
        isOpen={fileViewInfo !== null}
        toggle={closeModal}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={closeModal}>
          {T("File Viewer")}
        </ModalHeader>
        <ModalBody>
          <div className="mt-1 mb-2">
            <FileViewer
              fileType={fileViewInfo?.extension}
              filePath={renderFileWebUrlPreview(fileViewInfo?.path)}
              errorComponent={null}
            />
          </div>
          <div className="text-end">
            {renderFileWebUrlPreview(fileViewInfo?.path) !== false && (
              <a
                href={renderFileWebUrlPreview(fileViewInfo?.path)}
                className="btn btn-primary me-2"
                target="_blank"
              >
                <div className="d-flex align-items-center">
                  <ExternalLink size={17} className="me-1" /> {T("View")}
                </div>
              </a>
            )}
            <Button color="primary" onClick={handleShare}>
              <div className="d-flex align-items-center">
                <Share2 size={17} className="me-1" /> {T("Share")}
              </div>
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalFileViewer