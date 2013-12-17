namespace :app do
  desc <<-DESC
   This task will close the bid for taxi,
   whose hire_time is less than or equal to 24 hrs from current_time difference.
  DESC
  task :close_bid_for_taxi => [:environment] do
    begin
      Taxi.where(:hire_time.lte =>  Time.now+24.hour, :open_for_bidding => true).update_all(:open_for_bidding => false)
    rescue Exception => e
      raise e.message.inspect
    end
  end
end