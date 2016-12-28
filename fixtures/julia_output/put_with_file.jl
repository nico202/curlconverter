import Requests

data = readall(open("new_file", "r"))
Requests.put("http://awesomeurl.com/upload", data=data)