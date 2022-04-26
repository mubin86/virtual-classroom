# **Virtual Classroom Project**

- To run the project successfully, first of all we need to put the environment variable properly in the config.env file. Here, for the database connection we have to give any Mongodb Atlas credentials. For the Email sending, we need a Sendgrid Api Key and the Sendgrid account holders Email. After putting all the info, we can start our project by running the command npm start.

```
MONGO_USER=
MONGO_PASSWORD=
MONGO_DEFAULT_DATABASE=
PORT=
NODE_ENV=development
JWT_SECRET=
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
SENDGRID_API_KEY=
SENDGRID_VERIFIED_EMAIL=
```
- At first we need an Admin role, by which we can create a Teacher in our system. So, for Admin creation we can manually give an insert query with proper email, password and role in the user table. In the code, User model gives hints about this. After created, the Admin can login into the system by hitting the endpoint ```/api/v1/teachers/login```.  Then Admin can create an Teacher according to the busineess logic and after getting the password from the email the teacher can also login into the system by hitting the same ```/api/v1/teachers/login``` endpoint.

- After successfully Login, A teacher can create Classroom and can perform various types of task/operation with the Classroom according to the condition. All the API's are implemented properly in the code.

- When a student give a specific code for a particular classroom then the student is registered and enrolled in that classroom. But performing some other operation like upload submission, view classroom post, view result etc, the student must be logged in to any kind of operations. 

- According to our business logic when a student wants to enter in a classroom, every time ne needs to give a ```Code, Name, Email, Password.```. That means one student can enrolled in many Classroom and every time he is giving the sign up info. Now We can think a case like one student registered into two separate classroom with the same email but with two different password. In this case one student with one email containing two different password so when he try to login into the Main website portal(**If any**) then this case become ambiguous for us to maintain the Login case. So for resolving this we take an approach, for any student registration at first we check if the given code for the classroom is right or wrong. if ok, next we check if that requested email already enrolled in any other class or not because email is unique always. if exist we actually omit the currently requested registration info like(**password, schoolId**) bcz if we register the same email again with different password then that will be not a good choice i think. So for preventing this, we enrolled the student in a new Classroom with the previously existed info which he already given before. By this One ```Student/email``` can not have more than one set of registration info and Login works proeprly. ```[Note: If there is no Login system for the Student then there can be some other aspect but normally it always demand a Login system in real time thats why actually implemented this logic.]```. After first tie successfully registration Students can simply login into the system by hitting the endpoint ```/api/v1/students/login.```

- For File uploads, A folder should be crated in the project root directory named ```uploads```

- All the other features are implemented according to business logic properly. Various types of APIs are implemented for the Students and Teachers with some good filtering criteria with proper authentication and autorization. Such as, When any student try to perform a operation in any classroom at first it is checked that the student has access or not in the choosen classroom. This sort of small checks are tried to implemented in every case where it was needed.

