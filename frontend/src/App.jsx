import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router";


import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Loading from './components/Loading.jsx';
import { ProtectedRole, ProtectedRoute } from './router/ProtectedRoute.jsx';
import { ROLES, ROUTES } from './constants.js';
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
const Companies = lazy(()=> import('./pages/companies'))
const JobsDetails = lazy(()=> import('./pages/Detail/JobsDetails.jsx'))
const SignIn = lazy(()=> import('./pages/signIn/index.jsx'))
const SignUp = lazy(()=> import('./pages/signUp/SeekerSignUp.jsx'))
const RecruitersSignUp = lazy(()=> import('./pages/signUp/RecruiterSignUp.jsx'))
const NotFound = lazy(()=> import('./pages/NotFound.jsx'))
const UserProfile = lazy(()=> import('./pages/profile/User.jsx'))
const MyApplications = lazy(()=> import('./pages/applications/MyApplications.jsx'))
const MyJobs = lazy(()=> import('./pages/applications/JobsPosted.jsx'))
const JobApplicants = lazy(()=> import('./pages/applications/ApplicationsPerJob.jsx'))
const ApplicantDashboard = lazy(()=> import('./pages/applications/ApplicantDashboard.jsx'))
const SidebarLayout = lazy(() => import('./components/SidebarLayout.jsx'))
const CreateJob = lazy(() => import('./pages/createJobs/index.jsx'))
const CompanyProfile = lazy(() => import('./pages/companies/CompanyProfile.jsx'))
const SavedJobs = lazy(() => import('./pages/savedJobs/index.jsx'))

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
              <Route path={ROUTES.COMPANIES} element={<Companies />} />
              <Route path={`${ROUTES.JOBS}/:jobID`} element={<JobsDetails />} />
              <Route path='*' element={ <NotFound /> } />
              <Route path={ROUTES.SIGNIN} element={<SignIn />} />
              <Route path={ROUTES.SIGNUP_SEEKER} element={<SignUp />} />
              <Route path={ROUTES.SIGNUP_RECRUITER} element={<RecruitersSignUp />} />
              {/* protected routes */}
              <Route element={<ProtectedRoute/> } >
                <Route element={ <SidebarLayout /> } >
                   {/* together */}
                  <Route path={`${ROUTES.PROFILE}/:userID`} element={<UserProfile />} />
                  {/* seeker */}
                  <Route element={<ProtectedRole roles={ROLES.SEEKER} />} >
                    <Route path={`${ROUTES.MY_APPLICATIONS}`} element={<MyApplications />} />
                    <Route path={ROUTES.SAVED_JOBS} element={<SavedJobs />} />
                  </Route>
                  {/* Recruiter */}
                  <Route element={<ProtectedRole roles={ROLES.RECRUITER} />} >
                    <Route path={`${ROUTES.DASHBOARD}`} element={<ApplicantDashboard />} />
                    <Route path={`${ROUTES.MY_JOBS}`} element={<MyJobs />} />
                    <Route path={`${ROUTES.MY_JOBS}/:jobId/applicants`} element={<JobApplicants />} />
                    <Route path={`${ROUTES.CREATE_JOB}`} element={<CreateJob />} />
                    <Route path={`${ROUTES.COMPANY_PROFILE}`} element={<CompanyProfile />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default App
