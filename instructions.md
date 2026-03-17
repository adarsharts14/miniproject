# College Attendance Management System

Thank you for requesting this production-level College Attendance Management System. 

The application is cleanly structured into a Spring Boot backend and a React (Vite) frontend.

## 1. Prerequisites
- Java 17
- Maven 3.6+
- Node.js 18+
- MySQL Server running on `localhost:3306`

## 2. Database Setup
1. Log in to your MySQL root user.
2. The application is configured to connect using:
   - **Username**: `root`
   - **Password**: `Adarshy@3005`
3. Create the database manually if the auto-create does not work (though it is configured to `createDatabaseIfNotExist=true`):
   ```sql
   CREATE DATABASE attendance_db;
   ```

## 3. Running the Backend
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd attendance-system/backend
   ```
2. Build and run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The backend API will be available at `http://localhost:8080`.
4. **Swagger API Documentation** is available at:
   - `http://localhost:8080/swagger-ui.html`
   - You can use this to explore and test the raw REST endpoints.

## 4. Running the Frontend
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd attendance-system/frontend
   ```
2. Install the required Node dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL (usually `http://localhost:5173`).

## 5. Sample Data & Testing Flow
1. **Register a Teacher Account**: Go to the frontend register page, create an account (e.g., John Doe, `john@school.com`, Password: `password123`).
2. **Login**: Use these credentials to log in.
3. **Dashboard**: You will see your dashboard.
4. **Add Class**: Go to 'Classes' from sidebar -> 'Add Class' (e.g., Mathematics, CS-A, Mon 10 AM).
5. **Add Students**: Go to 'Students' -> 'Add Student' (e.g., Alice, Roll No: 1, Section: CS-A).
6. **Mark Attendance**: Go to 'Attendance', select 'Mathematics', select today's Date, and mark Alice as Present or Absent.
7. **View Reports**: Go to 'Reports', search for 'Alice', and select her profile to see her overall attendance percentage and history donut chart.
