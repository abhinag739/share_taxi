namespace :app do
  desc <<-DESC
   This will generate the top 5 bids and send the email to the person who has booked the taxi.
  DESC
  task :generate_top_5_bids => [:environment] do
    #begin
      Taxi.where(:open_for_bidding => false).each do |taxi|
        UserMailer.report_email(taxi).deliver
      end
    #rescue Exception => e
    #  raise e.message.inspect
    #end
  end
end