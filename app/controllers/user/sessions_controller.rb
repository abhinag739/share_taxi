class User::SessionsController < Devise::SessionsController

  skip_before_filter :authenticate_user!, :only => [:create]

end