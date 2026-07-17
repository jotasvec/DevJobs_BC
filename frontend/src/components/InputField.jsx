import React from 'react'

const InputField = ({ 
    name, 
    label, 
    placeholder, 
    type = 'text', 
    register, 
    validation, 
    disabled=false, 
    value, 
    error 
}) => {
    return (
        <div className='auth-field'>
            <label htmlFor={name} className=''> {label} </label>
            <input 
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                className={``}
                {...(register ? register(name, validation) : {})}
            />
            {error && <p>{error.message}</p> }
        </div>
    )
}

export default InputField