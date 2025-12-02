import React, { useState } from 'react';
import { FaSearch, FaShare, FaMapMarkerAlt, FaBriefcase, FaClock, FaChevronDown, FaChevronUp, FaArrowRight, FaUser } from 'react-icons/fa';
import './JobExchange.css';

const JobExchange = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedSalary, setSelectedSalary] = useState('$120,000 - $180,000');
  const [showIndustryFilter, setShowIndustryFilter] = useState(true);
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock job data related to our course database
  const jobs = [
    {
      id: 1,
      title: 'AI Product Manager',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full Time',
      joining: 'Immediate Start',
      salary: '$120,000 - $180,000 / year',
      tag: 'AI & Product Management',
      experience: '3-5 years'
    },
    {
      id: 2,
      title: 'Senior Data Scientist',
      company: 'DataFlow Analytics',
      location: 'New York, NY',
      type: 'Full Time',
      joining: '2 weeks notice',
      salary: '$130,000 - $200,000 / year',
      tag: 'Data Science',
      experience: '5-7 years'
    },
    {
      id: 3,
      title: 'Machine Learning Engineer',
      company: 'AI Solutions Corp',
      location: 'Seattle, WA',
      type: 'Full Time',
      joining: 'Immediate Start',
      salary: '$140,000 - $220,000 / year',
      tag: 'Machine Learning',
      experience: '4-6 years'
    },
    {
      id: 4,
      title: 'Full-Stack Developer',
      company: 'WebTech Solutions',
      location: 'Austin, TX',
      type: 'Full Time',
      joining: '1 month notice',
      salary: '$100,000 - $160,000 / year',
      tag: 'Full-Stack Development',
      experience: '3-5 years'
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'CloudFirst Systems',
      location: 'Denver, CO',
      type: 'Full Time',
      joining: 'Immediate Start',
      salary: '$110,000 - $170,000 / year',
      tag: 'DevOps',
      experience: '3-6 years'
    },
    {
      id: 6,
      title: 'Computer Vision Engineer',
      company: 'VisionAI Labs',
      location: 'Boston, MA',
      type: 'Full Time',
      joining: '2 weeks notice',
      salary: '$130,000 - $190,000 / year',
      tag: 'Computer Vision',
      experience: '4-7 years'
    },
    {
      id: 7,
      title: 'NLP Research Scientist',
      company: 'LanguageTech Inc.',
      location: 'Palo Alto, CA',
      type: 'Full Time',
      joining: 'Immediate Start',
      salary: '$150,000 - $250,000 / year',
      tag: 'Natural Language Processing',
      experience: '5-8 years'
    },
    {
      id: 8,
      title: 'Business Intelligence Analyst',
      company: 'InsightCorp',
      location: 'Chicago, IL',
      type: 'Full Time',
      joining: '1 month notice',
      salary: '$80,000 - $130,000 / year',
      tag: 'Business Analytics',
      experience: '2-4 years'
    },
    {
      id: 9,
      title: 'Backend Developer (Node.js)',
      company: 'ServerTech Solutions',
      location: 'Portland, OR',
      type: 'Full Time',
      joining: 'Immediate Start',
      salary: '$90,000 - $150,000 / year',
      tag: 'Backend Development',
      experience: '3-5 years'
    },
    {
      id: 10,
      title: 'Cloud Solutions Architect',
      company: 'AWS Partner Network',
      location: 'Remote (US)',
      type: 'Full Time',
      joining: '2 weeks notice',
      salary: '$140,000 - $220,000 / year',
      tag: 'Cloud Computing',
      experience: '6-10 years'
    },
    {
      id: 11,
      title: 'AI Healthcare Specialist',
      company: 'MedTech Innovations',
      location: 'San Diego, CA',
      type: 'Full Time',
      joining: 'Immediate Start',
      salary: '$120,000 - $180,000 / year',
      tag: 'AI in Healthcare',
      experience: '4-6 years'
    },
    {
      id: 12,
      title: 'Robotics AI Engineer',
      company: 'RoboTech Industries',
      location: 'Pittsburgh, PA',
      type: 'Full Time',
      joining: '1 month notice',
      salary: '$130,000 - $200,000 / year',
      tag: 'AI & Robotics',
      experience: '5-7 years'
    }
  ];

  const industries = [
    'AI & Product Management',
    'Data Science',
    'Machine Learning',
    'Full-Stack Development',
    'DevOps',
    'Computer Vision',
    'Natural Language Processing',
    'Business Analytics',
    'Backend Development',
    'Cloud Computing',
    'AI in Healthcare',
    'AI & Robotics',
    'AI Coding'
  ];

  const salaryRanges = [
    '$80,000 - $120,000',
    '$120,000 - $180,000',
    '$180,000+'
  ];

  return (
    <div className="job-exchange">
      {/* Header */}
             <div className="job-exchange-header">
         <h1>Job Exchange</h1>
         <p>Discover tech opportunities aligned with your learning path</p>
       </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Job exchange"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs
          </button>
          <button
            className={`tab-btn ${activeTab === 'apprenticeships' ? 'active' : ''}`}
            onClick={() => setActiveTab('apprenticeships')}
          >
            Apprenticeships
          </button>
        </div>

        <div className="salary-filters">
          {salaryRanges.map((range) => (
            <button
              key={range}
              className={`salary-filter ${selectedSalary === range ? 'active' : ''}`}
              onClick={() => setSelectedSalary(range)}
            >
              {range}
            </button>
          ))}
          <button className="more-arrow">→</button>
        </div>

        <div className="sort-container">
          <button className="sort-btn">
            Sort <FaChevronDown />
          </button>
        </div>
      </div>

      <div className="job-exchange-content">
        {/* Left Sidebar - Filters */}
        <div className="filters-sidebar">
          {/* Industry Filter */}
          <div className="filter-section">
            <div 
              className="filter-header"
              onClick={() => setShowIndustryFilter(!showIndustryFilter)}
            >
              <h3>Industry</h3>
              {showIndustryFilter ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showIndustryFilter && (
              <div className="filter-content">
                <div className="filter-search">
                  <input
                    type="text"
                    placeholder="Find Sector"
                    className="filter-search-input"
                  />
                </div>
                <div className="filter-options">
                  {industries.map((industry) => (
                    <label key={industry} className="filter-option">
                      <input type="checkbox" />
                      <span>{industry}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Country Filter */}
          <div className="filter-section">
            <div 
              className="filter-header"
              onClick={() => setShowCountryFilter(!showCountryFilter)}
            >
              <h3>Country</h3>
              {showCountryFilter ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showCountryFilter && (
                             <div className="filter-content">
                 <div className="filter-options">
                   <label className="filter-option">
                     <input type="checkbox" defaultChecked />
                     <span>United States</span>
                   </label>
                 </div>
               </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="filter-section">
            <div 
              className="filter-header"
              onClick={() => setShowLocationFilter(!showLocationFilter)}
            >
              <h3>Location</h3>
              {showLocationFilter ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showLocationFilter && (
              <div className="filter-content">
                <div className="filter-options">
                  <label className="filter-option">
                    <input type="checkbox" />
                    <span>All Locations</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Job Listings */}
        <div className="jobs-content">
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <button className="share-btn">
                    <FaShare />
                  </button>
                  <span className="job-tag">{job.tag}</span>
                </div>
                
                                 <div className="job-card-body">
                   <h3 className="job-title">{job.title}</h3>
                   <p className="job-company">{job.company}</p>
                   
                   <div className="job-details">
                     <div className="job-detail">
                       <FaMapMarkerAlt />
                       <span>{job.location}</span>
                     </div>
                     <div className="job-detail">
                       <FaBriefcase />
                       <span>{job.type}</span>
                     </div>
                     <div className="job-detail">
                       <FaClock />
                       <span>{job.joining}</span>
                     </div>
                     <div className="job-detail">
                       <FaUser />
                       <span>{job.experience}</span>
                     </div>
                   </div>
                   
                   <div className="job-salary">
                     <span className="dollar-sign">$</span>
                     <span>{job.salary}</span>
                   </div>
                 </div>
                
                <div className="job-card-footer">
                  <a href="#" className="view-details">
                    View Details <FaArrowRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobExchange;
