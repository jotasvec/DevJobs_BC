import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router";


import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Loading from './components/Loading.jsx';
/* import Home from './pages/Home.jsx'
import Jobs from './pages/Jobs/index.jsx';
import JobsDetails from './pages/Detail/JobsDetails.jsx'
import SignIn from './pages/signIn/index.jsx';
import NotFound from './pages/NotFound.jsx' */

// import { useRouter } from './hooks/useRouter.jsx'
// import { Route } from './router/Route.jsx' created by us, no longer used, learning porpuses

/* lazy lets you defer loading component’s code until it is rendered for the first time. */
const HomePage = lazy( () => import('./pages/Home.jsx') )
const Jobs = lazy(()=> import('./pages/Jobs/index.jsx'))
const JobsDetails = lazy(()=> import('./pages/Detail/JobsDetails.jsx'))
const SignIn = lazy(()=> import('./pages/signIn/index.jsx'))
const NotFound = lazy(()=> import('./pages/NotFound.jsx'))




function App() {
  return (
    <>
      <Header />
      {/* <Suspense> lets you display a fallback until its children have finished loading. */}
      <main>
        <Suspense fallback={
          <div style={{maxWidth: '1280px', margin: '3rem auto', padding: '0 1rem'}} >
            <Loading />
          </div>
        } >
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/jobs' element={<Jobs />} />
              <Route path='/jobs/:jobID' element={<JobsDetails />} />
              {/* <Route path='/jobsdetails' element={<JobsDetails />} /> */}
              <Route path='*' element={ <NotFound /> } />
              <Route path='/signin' element={<SignIn />} />

            </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default App
