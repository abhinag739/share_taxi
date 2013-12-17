class UserMailer < ActionMailer::Base

  def report_email(taxi)
    @user = taxi.user
    @top_5_bids = taxi.bids.order("amount DESC").limit(5)
    mail(:to => @user.email, :from => "taxi@share.com", :subject => 'Report for taxi')
  end

  def send_taxi_detail(taxi, user)
    @taxi = taxi
    mail(:to => user.email, :from => "taxi@share.com", :subject => 'Taxi booked in near location')
  end
end
