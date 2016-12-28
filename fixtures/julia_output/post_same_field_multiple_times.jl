import Requests

data = Dict{}(
  "foo"=> ["bar", "", "barbar"]
)

Requests.post("http://example.com/", data=data)