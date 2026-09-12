import React, { useState } from 'react'

export const useConfirm = () => {
    const [target, setTarget] = useState(null)
    const open = (item) => setTarget(item)
    const close = () => setTarget(null)

    return {
        target,
        open,
        close,
        isOpen: !!target
    }
}