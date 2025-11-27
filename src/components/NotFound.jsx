import React from 'react'

const NotFound = () => {
  return (
    <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center gap-8 text-center">
        <div className="text-primary text-6xl">
        <span className="material-symbols-outlined !text-9xl">
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-link-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 15l3 -3m2 -2l1 -1" /><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" /><path d="M3 3l18 18" /><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" /></svg>
        </span>
        </div>
        <div className="flex max-w-lg flex-col items-center gap-2">
        <p className="text-5xl md:text-6xl font-bold leading-tight tracking-tighter text-gray-900 dark:text-white">404</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Página no encontrada</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Oops! Parece que has hecho un `git push --force` a la URL equivocada.
                                </p>
        </div>
        <a className="" href="/">
        <button onClick=''>Back Home</button>
        </a>
        </div>
    </div>
  )
}

export default NotFound