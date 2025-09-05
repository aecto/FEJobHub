import React, { useState } from 'react'

const JobSearch = ({ onSearch }) => {
  const [searchTerms, setSearchTerms] = useState({
    company: '',
    title: '',
    skills: '',
    location: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchTerms({
      ...searchTerms,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerms)
  }

  const handleReset = () => {
    setSearchTerms({
      company: '',
      title: '',
      skills: '',
      location: ''
    })
    onSearch({
      company: '',
      title: '',
      skills: '',
      location: ''
    })
  }

  return (
    <div className="job-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-fields">
          <input
            type="text"
            name="company"
            placeholder="公司名称"
            value={searchTerms.company}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()} // 防止事件冒泡
          />
          <input
            type="text"
            name="title"
            placeholder="职位标题"
            value={searchTerms.title}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()} // 防止事件冒泡
          />
          <input
            type="text"
            name="skills"
            placeholder="技能关键词"
            value={searchTerms.skills}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()} // 防止事件冒泡
          />
          <input
            type="text"
            name="location"
            placeholder="工作地点"
            value={searchTerms.location}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()} // 防止事件冒泡
          />
          <div className="search-buttons">
            <button type="submit">搜索</button>
            <button type="button" onClick={handleReset}>重置</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default JobSearch