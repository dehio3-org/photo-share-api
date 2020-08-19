```
❯ node -v                                  
v14.8.0
❯ npm -v                                   
6.14.7
```

# 5.1
```bash
npm install apollo-server graphql nodemon
```

# 5.2
```bash
❯ npm start

> photo-share-api@1.0.0 start /Users/tomohide/github/photo-share-api
> nodemon -e js,json,graphql

[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json,graphql
[nodemon] starting `node index.js`
GraphQL Service running on http://localhost:4000/
```

# 5.2.1
## Query
```graphql
mutation newPhoto{
  postPhoto(name: "sample photo")
}
```
## Query
```graphql
mutation newPhoto($name: String!, $description: String){
  postPhoto(name: $name, description: $description)
}
```
```
{
    "name": "sample photo A",
  	"description": "A sample photos for our dataset"
}
```
