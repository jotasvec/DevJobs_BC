import React from 'react'

const InputField = ({ 
    name="", 
    label="", 
    placeholder, 
    type = 'text', 
    register, 
    validation, 
    disabled=false, 
    error, 
    defaultValue,
    inputCN="",
    labelCN="",
    ...inputProps
}) => {
    return (
        <div className='auth-field'>
            <label htmlFor={name} className={labelCN}> {label} </label>
            <input 
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                defaultValue={defaultValue}
                className={inputCN}
                {...inputProps}
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

export default InputField