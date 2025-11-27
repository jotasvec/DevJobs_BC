import { useEffect, useState } from "react"


// custom Router Hook
export function useRouter() {
  const [ currentPath, setCurrentPath ] = useState(window.location.pathname)

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePathChange)

    return () => {
      window.removeEventListener('popstate', handlePathChange)
    }

  },[])

  function navigateTo(path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'))
  }
  return {
    currentPath,
    navigateTo
  }
}