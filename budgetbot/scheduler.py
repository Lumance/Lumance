from apscheduler.schedulers.blocking import BlockingScheduler
from budget_analyzer import load_transactions, get_weekly_summary

def send_weekly_summary():
    df = load_transactions()
    this, last = get_weekly_summary(df)
    print(f"[Reminder] Last week you spent ₹{this}. ({this - last:+.0f} compared to the week before)")

sched = BlockingScheduler()
sched.add_job(send_weekly_summary, 'cron', day_of_week='sun', hour=20)
sched.start()
