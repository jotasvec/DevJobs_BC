import { PacmanLoader, PulseLoader } from 'react-spinners'


const Loading = (isLoading = true) => {
  return (
    <div className="page-loading" style={{ flexDirection: 'column', gap: '1.5rem' }}>
        <h1 style={{color: 'var(--accent, #38bdf8)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            Loading <PulseLoader
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