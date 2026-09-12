import React from 'react'

const Avatar = ({service, username}) => {
    const url = `https://unavatar.io/${service ?? 'github'}/${username ?? 'jotasvec'}`
    return (  
        <img 
            src={url} 
            alt={username} 
            className="border-2 border-white w-10 h-10 rounded-full"
        />      
    )
}

export default Avatar
