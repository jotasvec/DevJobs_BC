import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Jobs from './components/Jobs/index.jsx'
import Home from './components/Home.jsx'
import NotFound from './components/NotFound.jsx'

// import { useRouter } from './hooks/useRouter.jsx'
import { Route } from './router/Route.jsx'
import JobsDetails from './components/JobsDetails.jsx'



function App() {
  return (
    <>
      <Header />
      <main>
        <Route path='/' children={<Home />} />
        <Route path='/jobs' children={<Jobs />} />
        <Route path='/jobsdetails' children={<JobsDetails />} />
        
      </main>
      <Footer />
    </>
  )
}

export default App
