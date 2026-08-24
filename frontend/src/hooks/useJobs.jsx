import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { PAGINATION } from '../constants';
import { getAllJobs } from '../services/jobs.services';
import { useCallback } from 'react';
import { useRef } from 'react';

const useJobs = ({ limit, page, filters }) => {
    const [jobs, setJobs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const controllerRef = useRef(null)


    const fetchJobs = useCallback(async (signal) => {
        
        try {    
             const params = new URLSearchParams({
                 limit: String(limit),
                 offset: String((page - 1) * limit),
                 ...(filters.search && { search: filters.search }),
                 ...(filters.technology && { technology: filters.technology }),
                 ...(filters.location && { location: filters.location }),
                 ...(filters.modality && { modality: filters.modality }),
                 ...(filters.level && { level: filters.level }),
             })
       

            const { data }= await getAllJobs(params.toString(), { signal : signal });
            setJobs(data)
            
        } catch (error) {
            // ignored abortController petition
            if (error.name === 'AbortError') {
                console.log('Petición cancelada (Race Condition prevenida)');
                return;
            }
            // asigning error
            console.error('Error fetching jobs: ', error)
            setError(error)
        } finally{
            // setLoading false when petition is not aborted
            if(!signal.aborted){
                setLoading(false)
            }
        }
    },[filters, limit, page])

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError(null)
            if(controllerRef.current){
                controllerRef.current.abort();
            }
            const controller = new AbortController();
            controllerRef.current = controller;
            await fetchJobs(controller.signal)
        }
        load()
        return () => controllerRef.current?.abort();
    },[fetchJobs]);


  return {
    loading,
    jobs,
    error
  }
}

export default useJobs