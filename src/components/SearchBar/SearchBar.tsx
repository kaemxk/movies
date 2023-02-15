import React from 'react'
import { Input } from 'antd'

import './SearchBar.css'

const SearchBar = ({ onInputChange, value }: any) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onInputChange(e.target.value)
  }

  return (
    <div className="input">
      <Input placeholder="Type to search" onChange={onChangeHandler} value={value} />
    </div>
  )
}

export default SearchBar
