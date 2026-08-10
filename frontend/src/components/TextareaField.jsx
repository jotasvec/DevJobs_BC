import React from 'react'

const TextareaField = ({
    name = "",
    label = "",
    placeholder,
    register,
    validation,
    disabled = false,
    error,
    defaultValue,
    rows = 6,
    textareaCN = "",
    labelCN = "",
    ...textareaProps
}) => {
    return (
        <div className='auth-field'>
            <label htmlFor={name} className={labelCN}> {label} </label>
            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                defaultValue={defaultValue}
                className={textareaCN}
                rows={rows}
                {...textareaProps}
                {...(register ? register(name, validation) : {})}
            />
            {error && (
                <p className="input-error">
                    {error.message}
                </p>
            )}
        </div>
    )
}

export default TextareaField
