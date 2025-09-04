import csv
from jobspy import scrape_jobs

#site_name=["indeed",] #"google", # "glassdoor", "bayt", "naukri", "bdjobs"
#search_term='"engineer" software hardware manager director sales marketing project',
    #google_search_term="software engineer jobs near San Francisco, CA since yesterday",
    #location="Beijing,Shanghai,Shenzhen,Guangzhou,Tianjin,Chengdu,Suzhou,Hangzhou,Xian",
#job_type="fulltime"
#results_wanted=100  
#hours_old=24
#country_indeed='China'

for search in ("software","hardware","tester","QA","automation","software manager","project"):
    jobs = scrape_jobs(site_name=["indeed"],
                       search_term=search,
                       results_wanted=100,
                       hours_old=24,
                       country_indeed='China',
                       description_format="html")

    print(f"Found {len(jobs)} jobs")
    print(jobs.head())
    jobs.to_csv("jobs.csv", quoting=csv.QUOTE_NONNUMERIC, escapechar="\\", index=False, mode='a') # to_excel