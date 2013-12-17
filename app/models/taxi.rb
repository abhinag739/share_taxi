class Taxi
  include Mongoid::Document
  field :operator, :type => String
  field :hire_time, :type => DateTime
  field :source_street, :type => String
  field :source_city, :type => String
  field :source_state, :type => String
  field :source_country, :type => String

  field :destination_street, :type => String
  field :destination_city, :type => String
  field :destination_state, :type => String
  field :destination_country, :type => String
  field :open_for_bidding, :type => Boolean, :default => true

  field :user_id, :type => Integer

  has_many :bids
  belongs_to :user
  after_create :send_email_to_near_users


  def send_email_to_near_users
    User.near(address).where(:_id.ne => user_id).each do |user|
      UserMailer.send_taxi_detail(self, user).deliver
    end
  end

  def address
    [source_street, source_city, source_state, source_country].join(',')
  end

  def destination_address
    [destination_street, destination_city, destination_state, destination_country].join(',')
  end


  def source
    [source_street, source_city, source_state, source_country].join(",")
  end

  def destination
    [destination_street, destination_city, destination_state, destination_country].join(",")
  end
end
