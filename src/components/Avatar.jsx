import React from 'react'

const Avatar = ({service, username}) => {
    const url = `https://unavatar.io/${service ?? 'github'}/${username ?? 'jotasvec'}`
    const imgStyle = {
            border: '2px solid white',
            width: '40px', 
            height: '40px', 
            borderRadius: '9999px', 
        }
    return (  
        <img 
            src={url} 
            alt={username} 
            style={imgStyle}
        />      
    )
}

export default Avatar