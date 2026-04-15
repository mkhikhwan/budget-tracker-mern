import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    buttons?: {
        onConfirm?: { label: string; action: () => void };
        onClose?: { label: string; action: () => void };
        onDeny?: { label: string; action: () => void };
    };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, buttons }) => {
    // Handle Escape key and scroll lock
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalRoot = document.getElementById('modal-root');
    
    // Fallback if modal-root is missing, though it should be in index.html
    if (!modalRoot) {
        console.warn("Target element 'modal-root' not found for Portal.");
        return null;
    }

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    {title && <h2 className={styles.title}>{title}</h2>}
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
                {buttons && (
                    <div className={styles.footer}>
                        {buttons.onDeny && <button className={styles.denyButton} onClick={buttons.onDeny.action}>{buttons.onDeny.label}</button>}
                        
                        {buttons.onClose && <button className={styles.closeActionBtn} onClick={buttons.onClose.action}>{buttons.onClose.label}</button>}
                        
                        {buttons.onConfirm && <button className={styles.confirmButton} onClick={buttons.onConfirm.action}>{buttons.onConfirm.label}</button>}
                    </div>
                )}
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;