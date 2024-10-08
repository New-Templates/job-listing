import Sidebar from "@/components/sidebar"
import Seperator from "@/components/seperator"
import Layout from "../layout/layout"
import Image from 'next/image'
import React, { createContext, useReducer, useEffect, useState } from 'react'
import Jobs from "./../jobs.json"

type initialCriteriaType = {
  filterState: []
  filterDispatch: React.Dispatch<React.SetStateAction<{filter: string, type: string} | null>>
}

export const FilterContext = createContext<initialCriteriaType | any>({
  filterState: [],
  filterDispatch: {
    filter: '',
    type: ''
  }
});

const reducer = (state: string[], action: {
  filter: string,
  type: string
}) => {
  switch(action.type) {
    case 'add':
      return [...state, action.filter];
    case 'remove':
      let index = state.indexOf(action.filter);
      state.splice(index, 1);
      return [...state];
    default:
      return state;
  }
}

const Home = () => {
  const [filter, dispatch] = useReducer(reducer, []);
  const [JobsFilterApplied, setJobsFilterApplied] = useState([]);
  
  useEffect(() => {
    let subscription = true;
    let allJobs = JSON.parse(JSON.stringify(Jobs));
    const jobs = filter.length ? allJobs.filter(job => filter.includes(job.category)) : allJobs;
    setJobsFilterApplied(jobs);
    return () => { subscription = false; }
  }, [filter]);

  const jobItem = JobsFilterApplied.map((job, index) => {
    const { icon, company, position, time, tags, link } = job;
    return <div className="job-listings-item" key={index}>
      <div className="job-listings-item__icon">
        <Image
          src={icon}
          alt={company}
          width={72}
          height={72}
        />
      </div>
      <div className="job-listings-item__content nu-u-me-8">
        <p className="job-listings-item__title nu-u-mb-1">{position}</p>
        <p className="job-listings-item__timeago">{company}{time}</p>
        <ul className="job-listings-tags__list">
          {
            [...tags].map((tag, index) => {
              return <li key={index}>
                <span className="btn tags-btn">{tag}</span>
              </li>
            })
          }
        </ul>
      </div>
      <div className="job-listings-item__btn">
        <a type="button" href={link} target="_blank" className="btn btn--secondary">
          Apply Now
        </a>
      </div>
    </div>;
  }
)

  return <FilterContext.Provider value={{ filterState: filter, filterDispatch: dispatch }}>
    <Layout>
      <div className="nu-c-spacer-13"></div>
      <section className="landing-page-intro">
        <div className="container">
          <div className="nu-c-spacer-8"></div>
          <h1 className="h1 nu-u-mx-auto text-center serif">
            Find you next <br /> work from home job
          </h1>

          <div className="nu-c-spacer-12"></div>
          <Seperator />
          <div className="nu-c-spacer-12"></div>
          <section className="main">
            
            <Sidebar />

            <div className="main-content">
              <p className="main-content__heading">Recent new opportunities</p>
              <div className="main-content-job-listings">
                {jobItem}

              </div>
            </div>
          </section>
          
        </div>
      </section>
    </Layout>
  </FilterContext.Provider>
}

export default Home