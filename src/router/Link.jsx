import React from 'react'
import { useRouter } from '../hooks/useRouter.jsx';

export const Link = ({href, children, ...restProps}) => {
    const { navigateTo } = useRouter()
    const handleClick = (e) =>{
        e.preventDefault();
        navigateTo(href);
    }
    return (
    <a 
      style={{textDecoration: 'none', textDecorationColor: '#FFF', color: '#FFF'}}
      href={href} 
      {...restProps} 
      onClick={handleClick}
    >
       {children} 
    </a>
  )
}
