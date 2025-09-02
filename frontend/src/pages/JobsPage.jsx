import React, { useState } from 'react'
import JobList from '../components/job/JobList'
import JobDetail from '../components/job/JobDetail'
import '../components/job/JobStyles.css'

const JobsPage = () => {
  const [selectedJob, setSelectedJob] = useState(null)

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        <div className="jobs-sidebar">
          <JobList onJobSelect={setSelectedJob} />
        </div>
        <div className="jobs-main">
          <JobDetail job={selectedJob} />
        </div>
      </div>
    </div>
  )
}

export default JobsPage