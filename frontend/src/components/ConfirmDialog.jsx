import React from 'react'
import Modal from './UI/Modal'

const ConfirmDialog = ({
    isOpen,
    close,
    title = '',
    onConfirm,
    children
}) => {
  return (
    <Modal isOpen={isOpen} onClose={close}>
        <Modal.Header onClose={close}>{title}</Modal.Header>
        <Modal.Body>
            <p>{children}</p>
        </Modal.Body>
        <Modal.Footer
            variant='danger'
            onConfirm={() => {
                onConfirm()
                close()
            }}
            onClose={close}
        />
    </Modal>
  )
}

export default ConfirmDialog