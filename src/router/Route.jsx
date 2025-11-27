import { useRouter } from "../hooks/useRouter";

export function Route({ path, children}) {
    const { currentPath } = useRouter()
    if (currentPath !== path) return null

    return children
}   