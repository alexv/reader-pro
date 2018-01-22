import React from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({
  open, header, onClose, children,
}) =>
  (open ? (
    <div>
      <div className="modal-background" />
      <div role="dialog" className="modal-dialog">
        <header>
          <span>{header}</span>
          <button onClick={() => onClose()} type="button" aria-label="close">
            X
          </button>
        </header>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  ) : null);

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  header: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
