import Requests

headers = Dict{}(
    "Content-type"=> "application/sparql-query",
    "Accept"=> "application/sparql-results+json",
)

data = readall(open("./sample.sparql", "r"));
Requests.post("http://lodstories.isi.edu:3030/american-art/query", headers=headers, data=data)