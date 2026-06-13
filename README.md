# Buzzvel Payment Requests Management

This is a web application for refund/payment request management developed with **Laravel 12**, **React (Vite)**, and **PostgreSQL**. The application performs automatic currency conversions to Euro (EUR) by querying an external exchange rates API in real-time.

---

## 🚀 System Requirements

Make sure you have the following installed locally:
*   **PHP** >= 8.3
*   **Composer** (PHP dependency manager)
*   **Node.js** >= 18 and **npm**
*   **PostgreSQL** (Relational database)

---

## 🛠️ Installation & Configuration (Step-by-Step)

### 1. Clone the Repository
```bash
git clone https://github.com/Antony-Anderson/Buzzvel.git
cd buzzvel
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Open the `.env` file and configure the connection to your local PostgreSQL database:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=buzzvel
DB_USERNAME=buzzvel
DB_PASSWORD=buzzvel
```

### 4. Generate the Application Key
```bash
php artisan key:generate
```

### 5. Run Migrations and Seed the Database
Run migrations to create the tables and seeders to populate the database with default test accounts and fake payment requests:
```bash
php artisan migrate --seed
```

### 6. Install Frontend Dependencies
```bash
npm install
```

---

## 💻 Running the Application Locally

You will need two terminals open to run both the backend and frontend servers simultaneously, or you can use the integrated Composer shortcut:

### Integrated Shortcut (Recommended)
To start both the PHP Artisan server and Vite dev server with a single command:
```bash
composer dev
```

### Manual Method
*   **Backend Server (PHP):**
    ```bash
    php artisan serve
    ```
*   **Frontend Server (Vite/Hot Reload):**
    ```bash
    npm run dev
    ```

Access the application in your browser at: `http://localhost:8000` (or the URL displayed in the PHP server terminal).

---

## 🧑‍💻 Test Accounts (Mock Accounts)

The database is pre-populated with the following default test accounts (all of them use the password `test123`):

| Name | Email | Password | Role | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Antony Anderson** | `user@buzzvel.com` | `test123` | `user` | Create and view their own payment requests. |
| **Client User** | `client@buzzvel.com` | `test123` | `user` | Create and view their own payment requests. |
| **Finance Director** | `finance@buzzvel.com` | `test123` | `finance` | View, approve, or reject all payment requests on the platform. |
| **Finance Analyst** | `finance2@buzzvel.com` | `test123` | `finance` | View, approve, or reject all payment requests on the platform. |

---

## 🧪 Running Tests

To keep testing database credentials secure and prevent committing them to Git, tests use a separate local environment file (`.env.testing`) which is ignored by Git.

### 1. Setup Testing Database
Copy the `.env.testing.example` file to `.env.testing`:
```bash
cp .env.testing.example .env.testing
```
Configure your local Postgres credentials in the newly created `.env.testing` file.
You will need have the `.ini` extension configured on your system, check extension=pdo_sqlite and extension=sqlite3.

### 2. Execute the Test Suite
To run the full suite of 27 tests with PHPUnit:
```bash
php artisan test
```

---

## ⚙️ Automated Tasks (Artisan Commands)

The application includes a custom artisan command to automatically expire pending requests that were created more than 48 hours ago.

*   **Command:**
    ```bash
    php artisan payment-requests:expire
    ```
*   **Scheduling:** This command is configured to run daily in the background via the Laravel Task Scheduler (`routes/console.php`).

---

## 📖 API Documentation

For technical details regarding request payloads, success and error JSON responses, and HTTP authorization headers, please refer to the complementary API documentation file:
👉 [api_documentation.md](file:///c:/dev/buzzvel/api_documentation.md)
