//import React, { useEffect, useState } from 'react'
import { PacmanLoader, PulseLoader } from 'react-spinners'


const Loading = (isLoading = true) => {
    const color = '#37d7b7'
  return (
    <> 
        <div style={{display: 'flex', flexDirection: 'column' ,margin: '3rem auto'}}>
            <h1 style={{color:color}}>
                Loading <span> <PulseLoader 
                    color={color}
                    loading={isLoading}/> </span>
            </h1>
            <PacmanLoader 
                color={color}
                loading={isLoading}
                aria-label='... Loading'
                margin={'auto'}

            />
        </div>
    </>
  )
}

export default Loading