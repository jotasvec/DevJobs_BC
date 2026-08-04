import { PacmanLoader, PulseLoader } from 'react-spinners'

const Loading = ({isLoading = true}) => {
  return (
    <div className="page-loading flex-col gap-6">
        <h1 className="text-accent flex items-center gap-2">
            Loading ... <PulseLoader
                color="var(--accent, #38bdf8)"
                loading={isLoading}
                size={8}
            />
        </h1>
        <PacmanLoader
            color="var(--accent, #38bdf8)"
            loading={isLoading}
            aria-label='... Loading'
        />
    </div>
  )
}

export default Loading
