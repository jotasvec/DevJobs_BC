import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Jobs from './pages/Jobs/index.jsx';

import Home from './pages/Home.jsx'
import { Route, Routes } from "react-router";
import NotFound from './pages/NotFound.jsx'

// import { useRouter } from './hooks/useRouter.jsx'
// import { Route } from './router/Route.jsx' created by us, no longer used, learning porpuses
import JobsDetails from './pages/Detail/JobsDetails.jsx'
import SignIn from './pages/signIn/index.jsx';



function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/jobs' element={<Jobs />} />
          <Route path='/jobs/:jobID' element={<JobsDetails />} />
          {/* <Route path='/jobsdetails' element={<JobsDetails />} /> */}
          <Route path='*' element={ <NotFound /> } />
          <Route path='/signin' element={<SignIn />} />

        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
