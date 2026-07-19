import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router";


import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Loading from './components/Loading.jsx';
import { ProtectedRoute } from './router/ProtectedRoute.jsx';
import { ROUTES } from './constants.js';
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
const SignUp = lazy(()=> import('./pages/signUp/SeekerSignUp.jsx'))
const RecruitersSignUp = lazy(()=> import('./pages/signUp/RecruiterSignUp.jsx'))
const NotFound = lazy(()=> import('./pages/NotFound.jsx'))
const SeekerProfile = lazy(()=> import('./pages/profile/Seeker.jsx'))




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
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.JOBS} element={<Jobs />} />
              <Route path={`${ROUTES.JOBS}/:jobID`} element={<JobsDetails />} />
              <Route path='*' element={ <NotFound /> } />
              <Route path={ROUTES.SIGNIN} element={<SignIn />} />
              <Route path={ROUTES.SIGNUP_SEEKER} element={<SignUp />} />
              <Route path={ROUTES.SIGNUP_RECRUITER} element={<RecruitersSignUp />} />
              {/* protected routes */}
              <Route element={<ProtectedRoute/> } >
                <Route path={`${ROUTES.PROFILE}/:userID`}element={<SeekerProfile />} />
              </Route>
            </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default App
