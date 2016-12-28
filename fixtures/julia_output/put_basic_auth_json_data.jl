import Requests

data = "{\"admins\":{\"names\":[], \"roles\":[]}, \"readers\":{\"names\":[\"joe\"],\"roles\":[]}}"

Requests.put("http://admin:123@localhost:5984/test/_security", data=data)