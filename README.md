# Nelgiri Campus Service

A web application designed for campus management, providing a unified platform for students and administration. Built with Node.js, Express, MongoDB, and EJS.

## Features

- **User Authentication**: Secure login and signup functionality using Passport.js (Local Strategy and GitHub OAuth).
- **Notices**: View campus announcements and notices.
- **Issues / Complaints**: Raise and track campus-related issues.
- **Lost & Found**: Dedicated sections for reporting lost items and listing found items.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Frontend**: EJS, HTML, CSS (Vanilla)
- **Authentication**: Passport.js (Local, GitHub)
- **Session Management**: express-session, connect-mongo

## Prerequisites

- Node.js installed on your machine.
- MongoDB running locally (default setup is `mongodb://127.0.0.1:27017/campus`).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nishant259-hub/nelgiri-campus-service.git
   ```
2. Navigate to the project directory:
   ```bash
   cd nelgiri-campus-service
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:
```
PORT=3000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```
Replace the GitHub credentials with your own OAuth app details. 

## Running the Application

Start the server:
```bash
npm start
```
(If `npm start` is not configured, run `node app.js`)

The application will be accessible at `http://localhost:3000`.
