import Requests

data = Dict{}(
  "foo"=> "\'bar\'"
)

Requests.post("http://example.com/", data=data)