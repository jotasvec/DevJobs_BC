import { ROUTES, UI, API } from '../constants.js';

const ApplyButton = ({ 
    children= "Apply",
    type = 'button',
    disabled=false,
    className = '',
    ...props 
}) => {    
    return (
        <button
            type={type}
            className={`detail-apply-btn ${className}`}
            disabled={disabled}
            {...props}
        >
            {
                children
            }
        </button>
    )
}

export default ApplyButton;