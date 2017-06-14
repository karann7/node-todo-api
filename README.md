# Node-Todo-Api

App is Live [Here](shrouded-sea-12359.herokuapp.com)

A Full CRUD API, with JWT's for authentication. This API is fully production ready, and includes a config.json file with envirnment variables. For protection this file is not uploaded to this repository. This API first requires a user to signup, once user is created they must login. A JWT token is issued and must be pasted in Postman headers to be able to make queries.
# Routes!
1. POST /users/ - "email", "password"
// signup
2. POST /users/login - "email", "password"
// login
3. GET /users/me
// profile page
4. POST /todos/
// make a todo
5. GET /todos/ or /todos/:id
// get todos
5. PATCH /todos/:id/ "text", "completed"
// updated the todo or if it's completed or not
6. DELETE /todos/:id/ 
// deletes the todos and return what you just deleted
8. DELETE /users/me/token
//Signs a user out and deletes the JWT token
