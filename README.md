# Welcome to My Basecamp 1
***

## Task
Building a simple Basecamp-style project management app where users can register, log in, and manage their own projects. The challenge is handling user roles (admin vs regular), secure authentication, and clean session management.

## Description
The problem is solved using Node.js with Express for routing, EJS for server-side templating, Sequelize ORM with SQLite for data persistence, and bcrypt for password hashing. Sessions are managed via express-session, and middleware handles role-based access control.

## Installation
To install the project, make sure you have Node.js installed on your machine. Then clone the repository and navigate into the project directory. Run the following command to install all required dependencies listed in package.json:

```
npm install
```

This will install Express, EJS, Sequelize, SQLite3, bcrypt, and express-session automatically.

## Usage
To start the application, run the following command from the root of the project directory:

```
npm start
```

Once the server is running, openb your browser and navigate to http://localhost:3000. You can register a new account or log in using the default admin credentials (admin@admin.com / admin123). Regular users can create, view, edit, and delete their own projects. Admin users can view all registered users and grant or revoke admin privileges.
```
./my_project argument1 argument2
```

### The Core Team
liyeva_x azizova_n

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
