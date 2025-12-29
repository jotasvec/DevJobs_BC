import React from 'react'
import { useNavigate } from 'react-router'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <>
      <div className="" style={{ paddingTop:'10rem'}}>
          
          <div className="">
            <div className="">
              <span className="" >
                <svg xmlns="http://www.w3.org/2000/svg" width={100} height={100} viewBox="0 0 24 24" fill="none" stroke="rgba(0, 153, 255)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-link-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 15l3 -3m2 -2l1 -1" /><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" /><path d="M3 3l18 18" /><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" /></svg>
              </span>
            </div>
          <div className="">
            <h2 className=" " style={{fontSize:'xxx-large' }} >404</h2>
            <h3 className="" style={{fontSize:'xx-large' }} >Página no encontrada</h3>
            <p className="">
                                        Oops! Parece que has hecho un `git push --force` a la URL equivocada.
                                    </p>
          </div>
          <button
            style={{marginTop: '2rem' }} 
            onClick={() => navigate('/')} >Back Home</button>
          
        </div>
      </div>
    </>
  )
}

export default NotFound