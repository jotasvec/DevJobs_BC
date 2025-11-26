import { useState } from 'react'
import './App.css'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Jobs from './components/Jobs.jsx'


function App() {
  return (
    <main>
      <Header />
      <Jobs />
      <Footer />
    </main>
  )
}

export default App
