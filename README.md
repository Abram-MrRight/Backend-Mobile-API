# Student Management System API
This repository contains the API for a Student Management System. The main functionality includes retrieving student details, their payments, and financial status. The API is built using Node.js with Express and Sequelize for database management.

# Table of Contents
Installation
Usage
Endpoints
Models
Controllers
License
Installation
Clone the repository:


git clone https://github.com/Abram-MrRight/Backend-Mobile-API.git
cd student-management-system-api
Install dependencies:


npm install
Set up your environment variables:

Create a .env file in the root of the project and add your database configuration and other necessary environment variables.

env

DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
Run the database migrations:


npx sequelize-cli db:migrate
Start the server:


npm start
# Usage
To use the API, send HTTP requests to the endpoints described below. The base URL for the API is http://localhost:7050.

# Endpoints
Get All Students
URL: /api/students

Method: GET

Description: Retrieves all student details including their payments and financial status.

Models
# Student
Attributes:
id
first_name
gender
age
class
physical_address
parent_phone_number
# Payment
Attributes:
id
amount
payment_date
studentId (Foreign Key)
# Finance
Attributes:
id
expected_fees
studentId (Foreign Key)
# Controller
student.controller.js
This controller handles the logic for retrieving all students along with their payments and financial status.

const db = require('../models');
const Student = db.Student;
const Payment = db.Payment;
const Finance = db.Finance;


# License
This project is licensed under the MIT License. See the LICENSE file for details.