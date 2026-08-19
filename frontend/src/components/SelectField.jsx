import React from 'react'

const SelectField = ({ 
    name="", 
    label="", 
    register, 
    validation,
    error,
    inputCN="",
    labelCN="",
    placeholder="Select...",
    options=[],
    ...inputProps
}) => {
  return (
    <div className='auth-field'>
            <label htmlFor={name} className={labelCN}> { label } </label>
            <select 
                id={name}
                name={name}
                className={inputCN}
                {...inputProps}
                {...(register ? register(name, validation) : {})}
            >
                <option value="">{ placeholder }</option>
                {
                    options.map(o => {
                        const value = typeof o === 'string' ? o : o.value
                        const display = typeof o === 'string' ? o : o.label
                        return <option key={value} value={value}>{display}</option>
                    })
                }
            </select>
            {error && (
                <p className="input-error">
                    {error.message}
                </p>
            )}
        </div>
  )
}

export default SelectField