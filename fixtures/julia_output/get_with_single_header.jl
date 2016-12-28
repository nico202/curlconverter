import Requests

headers = Dict{}(
    "foo"=> "bar",
)

Requests.get("http://example.com/", headers=headers)