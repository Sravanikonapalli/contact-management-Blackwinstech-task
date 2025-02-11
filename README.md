**Contact Management System**

Overview

This is a simple Contact Management Application built using **Node.js**, **Express.js**, and **SQLite** for the backend. 
The frontend is developed using **React.js**.The backend provides CRUD operations to manage contacts, and the frontend interacts with the 
API to display and manipulate the data.
_______________________________________________________________________________________________________________________________________________

**Backend Setup**

*Prerequisites*

Ensure you have the following installed on your system:
.Node.js (v14 or later)
.SQLite3

*Installation & Running the Backend*

1. Clone this repository:
git clone [https://github.com/Sravanikonapalli/contact-management-Blackwinstech-task]
cd contact_management/backend

2. Install dependencies:
npm install

3. Create the SQLite database:
Open a terminal and navigate to the backend folder.

*Run the following command:*
sqlite3 database.db

Inside SQLite shell, create the contact table:

CREATE TABLE IF NOT EXISTS contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    address TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
);

Insert sample data:
INSERT INTO contact (name, email, phone, address) VALUES ('John Doe', 'john@example.com', '1234567890', 'New York');

Exit SQLite:
.exit

*Start the backend server:*
node server.js

The backend will run at http://localhost:3000.
_____________________________________________________________________________________________________________________________________________
**Frontend Setup**

1. Navigate to the frontend folder:
cd ../frontend

2. Install dependencies:
npm install

3. Start the frontend:
npm start

This will start the frontend on http://localhost:3001. (or some available ports)
___________________________________________________________________________________________________________________________________
**API Endpoints**

**1. Get All Contacts**

Endpoint: GET /contacts
Response:
[
{
  "id":1,
  "name":"John Doe",
  "email":"jogn@eample.com",
  "phone:"12345567890",
  "address":"New York",
  "createdAt":"2024-02-2025 11.45AM"
}

**2. Get Contact by ID**

Endpoint: GET /contacts/:id
Response:

{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "New York",
  "createdAt": "2024-02-11T12:00:00.000Z"
}

**3. Add a New Contact**

Endpoint: POST /contacts
Request Body:

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "0987654321",
  "address": "Los Angeles"
}

Response:

{ "message": "Contact added successfully" }

**4. Update a Contact**

Endpoint: PUT /contacts/:id
Request Body:

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "1234567890",
  "address": "Chicago"
}

Response:

{ "message": "Contact updated successfully" }

**5. Delete a Contact**

Endpoint: DELETE /contacts/:id
Response: { "message": "Contact deleted successfully" }
______________________________________________________________________________________________________________________________________
**Thought Process and Design**

1.SQLite was chosen for simplicity and portability.
2..Express.js provides a lightweight backend framework with clear routing.
3.CORS is enabled to allow the frontend to communicate with the backend.
4.CreatedAt field is automatically generated using SQLite's datetime('now') function.
_________________________________________________________________________________________________________________________________
**Deployment**

For deployment:

Backend: Render
Frontend: Vercel
