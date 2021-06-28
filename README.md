# group-user-color
Follow below steps to run the application

download the repository
direct to the path in cmd
npm install
npm run dev
go to browser and run "http://localhost:8080/v1/node/ping"
You need to get {"status":"OK","message":"pong"} as response
Click this link https://www.getpostman.com/collections/04761d08f04973ac8f24 to get the postman collection of apis
In the postman register a user using the Register User api
Sigin with the created user email and password
You will get the token in the signin response
Use the token for the remaining apis as the "auth-token" value.
