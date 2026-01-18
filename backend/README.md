# Alumni Club Backend

## Overview

This project is a backend application for the Alumni Club, built using TypeScript and Express. It utilizes Prisma ORM for database interactions, providing a robust and type-safe way to manage data.

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- A database (e.g., PostgreSQL, MySQL, SQLite)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd Alumni-Club/backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Install Prisma and the necessary database connector:

   ```
   npm install prisma --save-dev
   npm install @prisma/client
   ```

4. Initialize Prisma:

   ```
   npx prisma init
   ```

5. Update the `.env` file with your database connection string:

   ```
   DATABASE_URL="your_database_connection_string"
   ```

6. Define your data model in `prisma/schema.prisma`.

7. Generate the Prisma client:

   ```
   npx prisma generate
   ```

8. Run migrations if necessary:

   ```
   npx prisma migrate dev
   ```

9. How to run tests

   ```
   To run all:
   npm test
   ```

   To run one of each:

   ```
   npx jest testing/enroll.tests.ts --runInBand
   npx jest testing/contact.tests.ts --runInBand
   npx jest testing/profile-visibillity.tests.ts --runInBand
   npx jest testing/login.tests.ts --runInBand
   npx jest testing/messages.tests.ts --runInBand
   npx jest testing/posts.tests.ts --runInBand

   ```

### Usage

- Start the server:

  ```
  npm run dev
  ```

- The application will be running on `http://localhost:3000`.

### Directory Structure

- **src/**: Contains the source code for the application.
  - **controllers/**: Handles incoming requests and responses.
  - **routes/**: Defines the API endpoints.
  - **services/**: Contains business logic and interacts with the database.
  - **middlewares/**: Contains middleware functions for request processing.
  - **types/**: Type definitions for TypeScript.
  - **prisma.ts**: Initializes and exports the Prisma client.

- **prisma/**: Contains the Prisma schema and migration files.

- **db/**: Contains SQL files for database schema and seeding.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License

This project is licensed under the MIT License. See the LICENSE file for details.
