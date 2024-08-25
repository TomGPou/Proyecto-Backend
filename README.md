# Backend Project - Ecommerce

## Introduction

This project is a backend system for an e-commerce platform, developed as part of the Backend course at Coderhouse. The system is built with Node.js and includes various features to manage an online store.

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Running Tests](#running-tests)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Technologies

The following technologies and tools are used in this project:

- **JavaScript**: Programming language used for backend development.
- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Node.js framework for building web applications and APIs.
- **Handlebars**: Templating engine for rendering dynamic views.
- **Socket.io**: Library for real-time communication between client and server.
- **MongoDB**: NoSQL database used to store application data.
- **Mongoose**: Node.js library for modeling and managing MongoDB data.
- **Bcrypt**: Tool for password hashing.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.
- **Dotenv**: Loads environment variables from a `.env` file.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TomGPou/Proyecto-Backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Proyecto-Backend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

### Starting the Server

- **Development Mode:**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm run prod
  ```

## Running Tests

To run tests, use the following command:

```bash
npm run test
```

Ensure all dependencies are installed before running tests. The test framework used is Mocha (replace with the actual framework if different).

## Environment Variables

The project requires the following environment variables. Create a .env file in the root directory and add:

```bash
DB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=<your-preferred-port>
```

Replace <your-mongodb-uri>, <your-jwt-secret>, and <your-preferred-port> with your actual credentials.

## API Documentation

The API documentation is available via Swagger. Once the server is running, you can access it at:

```bash
http://localhost:<PORT>/api-docs
```

This documentation provides detailed information on all available endpoints, their parameters, and responses.

## Features

- RESTful API for managing products, users, and orders.
- Real-time communication with Socket.io.
- Dynamic views rendered with Handlebars.
- Integration with MongoDB database.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.
