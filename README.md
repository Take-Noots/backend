# Noot Application

## Getting Started

Follow these steps to start the server:

1. **Install Dependencies**:
   Run the following command to install all required dependencies:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Set up the .env file with following:
   ```
   DB_CONN_STRING = <your-database-connection-string>
   ACCESS_TOKEN_SECRET = <random-string>
   REFRESH_TOKEN_SECRET = <random-string>
   ACCESS_TOKEN_DURATION = 900
   REFRESH_TOKEN_DURATION = 604800
   ```

3. **Start the Server**:
   Use the following command to start the server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000`.

## Project Structure

### Shared Folder
The `shared` folder contains code that is reused across multiple modules. For example:
- **middleware**: Contains reusable middleware functions like `authenticateJWT`.
- **connection**: Contains database connection logic.
- **helper**: Contains utility functions that simplify common tasks across the application.

### Modules Folder
The `modules` folder is organized into subfolders, each representing a specific feature or domain of the application in order to adhere to modular monolithic architecture. Demo Module is a example module created to elaborate the purpose of each file in a module. I suggest you give it a read.
