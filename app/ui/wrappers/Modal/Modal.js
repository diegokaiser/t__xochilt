'use client'
import { useState } from "react"
import ReactModal from "react-modal"
import { PlusCircle } from '@phosphor-icons/react/dist/ssr';

export default function Modal ({ modalIsOpen }) {


  const [showModal, setShowModal] = useState(modalIsOpen)

  return (
    <>
      <ReactModal
        isOpen={showModal}
      >
        <div
          className="xo__modal__body"
        >
          <div className="mb-4">
            <button
              className='btn btn-danger w-full uppercase'
              type='button'
              onChange={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  )
}
