import Requests

headers = Dict{}(
    "Content-Type"=> "application/json",
    "key"=> "abcdefg",
)

Requests.post("http://1.2.3.4/endpoint", headers=headers)