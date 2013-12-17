class Bid
  include Mongoid::Document
  field :taxi_id, :type => Integer
  field :amount, :type => Integer
  field :user_id, :type => Integer

  belongs_to :taxi
  belongs_to :user
end
