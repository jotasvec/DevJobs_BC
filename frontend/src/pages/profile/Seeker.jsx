import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { useRouter } from '../../hooks/useRouter';

const Seeker = () => {
    const { userID } = useParams()
    const [seeker, setSeeker] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const { navigateTo } = useRouter();



    useEffect(() => {
        fetch(`http://localhost:3050/users/${userID}`, {credentials: 'include'})
            .then(response => {
                if (!response.ok) throw new Error(`User Profile not found \nStatus: ${response.statusText}` );
                return response.json()
            }).then( json => setSeeker(json.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))

    }, [userID])

    if (error || !seeker) {
        return (
            <div className="page-header">
                <h1>Seeker Profile Not Found</h1>
                <p>The User Profile doesn't exist or has been removed.</p>
                <button className="auth-submit" onClick={() => navigateTo('/')}>Go Home</button>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="page-loading">
                <span>Loading User details...</span>
            </div>
        )
    }
    console.log('response : ', seeker)

  return (
    <div>
        <h2>Welcome {seeker.name}</h2>
        <h3>Data</h3>
        <ul>
            <li>name    : {seeker.name}</li>
            <li>email   : {seeker.email}</li>
            <li>bio   :{seeker.bio}</li> 
        </ul>
    </div>


  )
}

export default Seeker