import React from 'react'
import { Link as RRLink } from "react-router";
// import { useRouter } from '../hooks/useRouter.jsx'; -> NOTE: no longer used, replaced for React Router Link component, 

export const Link = ({href, children, ...restProps}) => {
    return (
      <RRLink 
        style={{textDecoration: 'none', textDecorationColor: '#FFF', color: '#FFF'}}
        to={href} 
        {...restProps} 
      >
        {children} 
      </RRLink>
  )
}
