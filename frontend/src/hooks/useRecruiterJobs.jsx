import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobsbyUserId, deleteJob } from '../services/jobs.services'

export function useRecruiterJobs(userId) {
    const queryClient = useQueryClient()

    const jobsQuery = useQuery({
        queryKey: ['recruiter-jobs', userId],
        queryFn: () => getJobsbyUserId(userId),
        enabled: !!userId
    })

    const deleteMutation = useMutation({
        mutationFn: (jobId) => deleteJob(jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruiter-jobs', userId] })
        }
    })

    return {
        jobs: jobsQuery.data?.data?.data || [],
        isLoading: jobsQuery.isLoading,
        error: jobsQuery.error,
        deleteJob: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    }
}
