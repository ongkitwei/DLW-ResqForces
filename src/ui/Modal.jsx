import React from "react";

function Modal({
  modalId,
  onClickFunction,
  modalTitle,
  modalDescription,
  modalButton,
}) {
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box text-center">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">{modalTitle}</h3>
        <p className="py-4">{modalDescription}</p>
        <form
          className="btn btn-error mt-4 px-8"
          onClick={onClickFunction}
          method="dialog"
        >
          {modalButton}
        </form>
      </div>
    </dialog>
  );
}

export default Modal;
