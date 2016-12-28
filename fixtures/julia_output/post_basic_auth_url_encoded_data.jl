import Requests

data = Dict{}(
  "grant_type"=> "client_credentials"
)

Requests.post("http://foo:bar@localhost/api/oauth/token/", data=data)