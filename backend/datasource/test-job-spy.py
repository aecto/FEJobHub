import csv
import os
import shutil
from datetime import datetime
from jobspy import scrape_jobs

# 检查jobs.csv是否存在，如果存在则备份
csv_file = "jobs.csv"
if os.path.exists(csv_file):
    # 创建备份目录
    backup_dir = "../databackup"
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    # 生成带时间戳的备份文件名
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f'jobs_backup_{timestamp}.csv'
    backup_path = os.path.join(backup_dir, backup_filename)
    
    # 移动文件
    shutil.move(csv_file, backup_path)
    print(f"已备份 {csv_file} 到 {backup_path}")

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
                       results_wanted=10,
                       hours_old=24,
                       country_indeed='China',
                       description_format="html")

    print(f"Found {len(jobs)} jobs")
    print(jobs.head())
    jobs.to_csv("jobs.csv", quoting=csv.QUOTE_NONNUMERIC, escapechar="\\", index=False, mode='a') # to_excel