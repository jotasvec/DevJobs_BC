import React from 'react'
import styles from "./SearchField.module.css"
import { Search } from 'lucide-react'

const SearchField = ({ onChange, onSubmit, value }) => {
  const handleOnChange = (event) => {
    onChange(event)
  }
  const handleOnSubmit = (event) => {
    event.preventDefault()
    onSubmit(value)
  }
  return (
    <form className={styles.searchBar} action=""  onSubmit={handleOnSubmit}>
      <Search size={24} />
      <input 
        name="search" 
        type="text"
        value={value}
        placeholder="search jobs" 
        onChange={handleOnChange} 
        required
        autoComplete='off'
      />
      <button type='submit'>Search</button>
    </form>
  )
}

export default SearchField