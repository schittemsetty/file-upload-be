# group-user-color
Follow below steps to run the application

1. download the repository
2. direct to the path in cmd
3. npm install
4. npm run dev
5. go to browser and run "http://localhost:8080/v1/node/ping"
6. You need to get {"status":"OK","message":"pong"} as response
7. Click this link https://www.getpostman.com/collections/04761d08f04973ac8f24 to get the postman collection of apis
8. In the postman register a user using the Register User api
9. Sigin with the created user email and password
10. You will get the token in the signin response
11. Use the token for the remaining apis as the "auth-token" value.
