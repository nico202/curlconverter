import Requests

headers = Dict{}(
    "Authorization"=> "Bearer ACCESS_TOKEN",
)

files = Dict{}(
    "attributes"=> "{'name':'tigers.jpeg', 'parent':{'id':'11446498'}}",
    "file"=> open("myfile.jpg")
)

Requests.post("https://upload.box.com/api/2.0/files/content", headers=headers, files=files)