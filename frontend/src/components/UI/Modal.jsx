import { X } from 'lucide-react';
import React, { useCallback, useEffect, useRef } from 'react'

const Modal = ({
    isOpen,
    onClose,
    children,
    className = ''
}) => {
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose()
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return
        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, handleKeyDown])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className={`${className} bg-card border border-white/10 rounded-xl shadow-xl w-full max-w-md mx-4`}>
                {children}
            </div>
        </div>
    )
}

Modal.Header = function ModalHeader({ children, onClose }) {
    return (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/6">
            <h3 className="font-heading text-xl font-semibold text-text">{children}</h3>
            {onClose && (
                <X
                    size={20}
                    onClick={onClose}
                    className="cursor-pointer p-1 rounded-md text-text-muted hover:text-text hover:bg-white/5 transition-colors"
                />
            )}
        </div>
    )
}

Modal.Body = function ModalBody({ children }) {
    return (
        <div className="px-6 py-5 text-text-secondary text-sm leading-relaxed">
            {children}
        </div>
    )
}

Modal.Footer = function ModalFooter({
    confirmText = 'Confirm',
    onConfirm,
    cancelText = 'Cancel',
    onClose,
    variant = 'primary',
    confirmDisabled = false
}) {
    const confirmRef = useRef(null)

    useEffect(() => {
        confirmRef.current?.focus()
    }, [])

    return (
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/6">
            <button
                ref={confirmRef}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none ${
                    variant === 'danger'
                        ? 'bg-error text-white hover:bg-error/80'
                        : 'bg-accent hover:opacity-90'
                }`}
                onClick={onConfirm}
                disabled={confirmDisabled}
            >
                {confirmText}
            </button>
            <button
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-white/4 border border-white/8 rounded-lg hover:bg-white/8 transition-colors"
                onClick={onClose}
            >
                {cancelText}
            </button>
        </div>
    )
}

export default Modal
