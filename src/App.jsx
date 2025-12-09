import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Jobs from './components/Jobs/index.jsx'
import Home from './components/Home.jsx'
import NotFound from './components/NotFound.jsx'
// import { useRouter } from './hooks/useRouter.jsx'
import { Route } from './router/Route.jsx'



function App() {
  return (
    <>
      <Header />
      <main>
        <Route path='/' children={<Home />} />
        <Route path='/jobs' children={<Jobs />} />
        
      </main>
      <Footer />
    </>
  )
}

export default App
