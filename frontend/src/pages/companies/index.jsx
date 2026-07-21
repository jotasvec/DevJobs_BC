import React, { useEffect, useState } from 'react'
import { API } from '../../constants'
import Loading from '../../components/Loading'

const Companies = () => {
    const [companies, setCompanies] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {

        const loadCompanies = async () => {
            try {
                const res = await fetch(`${API.COMPANIES}`);
                
                if(!res.ok) throw new Error(`Company reuqest failed: ${res.statusText}`);
                const json = await res.json()

                setCompanies(json.data)

            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }

        }
        loadCompanies();
    }, [])
    

    if(loading) return (
        <Loading />
    )

    if(error) return (
        <p>An Error has occurred - {error} </p>
    )



  return (
    <>
        <h2>Companies</h2>
        {
            companies.map(company => (
                <div key={company.id} >
                    <h4>{company.name}</h4>
                </div>
            ))
            
        }
    </>
  )
}

export default Companies