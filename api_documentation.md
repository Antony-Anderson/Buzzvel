# API Documentation

This document describes all API endpoints registered in the application, including authentication, user management, and payment request management.

All request and response bodies are formatted as `application/json`. 

---

## Authentication Endpoints

### 1. User Registration

Creates a new user and returns a Sanctum API token.

*   **URL:** `/api/register`
*   **Method:** `POST`
*   **Auth Required:** No

#### Request Headers
```http
Accept: application/json
Content-Type: application/json
```

#### Request Body Parameters
| Parameter  | Type     | Required | Rules / Description                                                     |
| :--------- | :------- | :------- | :---------------------------------------------------------------------- |
| `name`     | `string` | **Yes**  | Max 255 chars. Automatically title-cased during validation (e.g. "John Doe"). |
| `email`    | `string` | **Yes**  | Valid email, max 255 chars, must be unique in the `users` table.        |
| `password` | `string` | **Yes**  | Minimum 8 characters.                                                   |

#### Response (201 Created)
```json
{
  "success": true,
  "type": "success",
  "message": "User created",
  "data": {
    "token": "1|sanctum_token_string_here..."
  }
}
```

#### Response (422 Unprocessable Entity)
```json
{
  "message": "The email has already been taken. (and/or other validation messages)",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  }
}
```

---

### 2. User Login

Authenticates a user and returns a Sanctum API token.

*   **URL:** `/api/login`
*   **Method:** `POST`
*   **Auth Required:** No

#### Request Headers
```http
Accept: application/json
Content-Type: application/json
```

#### Request Body Parameters
| Parameter  | Type     | Required | Description              |
| :--------- | :------- | :------- | :----------------------- |
| `email`    | `string` | **Yes**  | Registered email address |
| `password` | `string` | **Yes**  | User password            |

#### Response (200 OK)
```json
{
  "success": true,
  "type": "success",
  "message": "Login success",
  "data": {
    "token": "2|sanctum_token_string_here..."
  }
}
```

#### Response (422 Unprocessable Entity)
```json
{
  "message": "Email or password are incorrect",
  "errors": {
    "email": [
      "Email or password are incorrect"
    ]
  }
}
```

---

### 3. User Logout

Invalidates and deletes all tokens associated with the authenticated user.

*   **URL:** `/api/logout`
*   **Method:** `POST`
*   **Auth Required:** Yes (Sanctum)

#### Request Headers
```http
Accept: application/json
Authorization: Bearer <your_token>
```

#### Response (200 OK)
```json
{
  "success": true,
  "type": "success",
  "message": "Logout success",
  "data": null
}
```

#### Response (401 Unauthorized)
```json
{
  "message": "Unauthenticated."
}
```

---

### 4. Authenticated User Profile

Retrieves the profile data of the currently logged-in user.

*   **URL:** `/api/users/show`
*   **Method:** `GET`
*   **Auth Required:** Yes (Sanctum)

#### Request Headers
```http
Accept: application/json
Authorization: Bearer <your_token>
```

#### Response (200 OK)
```json
{
  "success": true,
  "type": "success",
  "data": {
    "id": 1,
    "name": "Antony Anderson",
    "email": "user@buzzvel.com",
    "role": "user",
    "created_at": "2026-06-13T12:00:00.000000Z",
    "updated_at": "2026-06-13T12:00:00.000000Z"
  }
}
```

---

## Payment Request Endpoints

### 5. List Payment Requests

Lists payment requests. Regular users see only their own requests, while finance users see all requests.

*   **URL:** `/api/payment-requests`
*   **Method:** `GET`
*   **Auth Required:** Yes (Sanctum)

#### Request Headers
```http
Accept: application/json
Authorization: Bearer <your_token>
```

#### Query Parameters
| Parameter  | Type      | Required | Description                                                         |
| :--------- | :-------- | :------- | :------------------------------------------------------------------ |
| `status`   | `string`  | No       | Filter by status. Must be: `pending`, `approved`, `rejected`, or `expired`. |
| `per_page` | `integer` | No       | Pagination page size. Default is 15.                                |
| `page`     | `integer` | No       | Page number for pagination. Default is 1.                          |

#### Response (200 OK)
```json
{
  "success": true,
  "type": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "amount": "600.00",
        "currency": "BRL",
        "exchange_rate": "6.000000",
        "exchange_rate_source": "https://api.exchangerate-api.com",
        "exchange_rate_timestamp": "2026-06-13T12:55:00.000000Z",
        "converted_amount_eur": "100.00",
        "status": "pending",
        "description": "Serviços de desenvolvimento backend",
        "created_at": "2026-06-13T12:55:00.000000Z",
        "updated_at": "2026-06-13T12:55:00.000000Z",
        "user": {
          "id": 1,
          "name": "Antony Anderson",
          "email": "user@buzzvel.com",
          "role": "user"
        }
      }
    ],
    "first_page_url": "http://localhost/api/payment-requests?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/payment-requests?page=1",
    "next_page_url": null,
    "path": "http://localhost/api/payment-requests",
    "per_page": 15,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```

---

### 6. Create Payment Request

Creates a new payment request and performs automatic exchange rate conversion to EUR via an external API.

*   **URL:** `/api/payment-requests/create`
*   **Method:** `POST`
*   **Auth Required:** Yes (Sanctum)

#### Request Headers
```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <your_token>
```

#### Request Body Parameters
| Parameter     | Type     | Required | Rules / Description                                                                          |
| :------------ | :------- | :------- | :------------------------------------------------------------------------------------------- |
| `amount`      | `numeric`| **Yes**  | Must be greater than 0.                                                                      |
| `currency`    | `string` | **Yes**  | 3-letter currency code (e.g., "USD", "BRL", "EUR"). Case-insensitive (auto capitalized).      |
| `description` | `string` | No       | Text, max 1000 characters.                                                                   |

#### Response (201 Created)
```json
{
  "success": true,
  "type": "success",
  "message": "Payment request created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "amount": 120,
    "currency": "BRL",
    "exchange_rate": 6,
    "exchange_rate_source": "https://api.exchangerate-api.com",
    "exchange_rate_timestamp": "2026-06-13 12:55:00",
    "converted_amount_eur": 20,
    "description": "Serviços de Desenvolvimento",
    "status": "pending",
    "updated_at": "2026-06-13T12:55:00.000000Z",
    "created_at": "2026-06-13T12:55:00.000000Z"
  }
}
```

#### Response (503 Service Unavailable)
*Occurs when the external currency converter API cannot be reached or fails to return exchange rates.*
```json
{
  "success": false,
  "type": "error",
  "message": "Exchange rate service unavailable"
}
```

---

### 7. View Payment Request Details

Retrieves details for a specific payment request by ID.

*   **URL:** `/api/payment-requests/{id}/show`
*   **Method:** `GET`
*   **Auth Required:** Yes (Sanctum)

#### Request Headers
```http
Accept: application/json
Authorization: Bearer <your_token>
```

#### Route Parameters
| Parameter | Type      | Required | Description            |
| :-------- | :-------- | :------- | :--------------------- |
| `id`      | `integer` | **Yes**  | ID of the payment request |

#### Response (200 OK)
```json
{
  "success": true,
  "type": "success",
  "data": {
    "id": 1,
    "user_id": 1,
    "amount": "600.00",
    "currency": "BRL",
    "exchange_rate": "6.000000",
    "exchange_rate_source": "https://api.exchangerate-api.com",
    "exchange_rate_timestamp": "2026-06-13T12:55:00.000000Z",
    "converted_amount_eur": "100.00",
    "status": "pending",
    "description": "Serviços de desenvolvimento backend",
    "created_at": "2026-06-13T12:55:00.000000Z",
    "updated_at": "2026-06-13T12:55:00.000000Z",
    "user": {
      "id": 1,
      "name": "Antony Anderson",
      "email": "user@buzzvel.com",
      "role": "user"
    }
  }
}
```

#### Response (403 Forbidden)
*Occurs when the authenticated user is not the owner of the payment request and does not have the `finance` role.*
```json
{
  "success": false,
  "type": "error",
  "message": "You are not authorized to view this payment request."
}
```

#### Response (404 Not Found)
```json
{
  "message": "Record not found."
}
```

---

### 8. Update Payment Request Status

Approves or rejects a pending payment request. Only accessible to users with the `finance` role.

*   **URL:** `/api/payment-requests/{id}/update`
*   **Method:** `PATCH`
*   **Auth Required:** Yes (Sanctum, `finance` role required)

#### Request Headers
```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <your_token>
```

#### Route Parameters
| Parameter | Type      | Required | Description            |
| :-------- | :-------- | :------- | :--------------------- |
| `id`      | `integer` | **Yes**  | ID of the payment request |

#### Request Body Parameters
| Parameter | Type     | Required | Rules / Description                  |
| :-------- | :------- | :------- | :----------------------------------- |
| `status`  | `string` | **Yes**  | Must be either `approved` or `rejected` |

#### Response (200 OK)
```json
{
  "success": true,
  "type": "success",
  "message": "Payment request status updated to approved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "amount": "600.00",
    "currency": "BRL",
    "exchange_rate": "6.000000",
    "exchange_rate_source": "https://api.exchangerate-api.com",
    "exchange_rate_timestamp": "2026-06-13T12:55:00.000000Z",
    "converted_amount_eur": "100.00",
    "status": "approved",
    "description": "Serviços de desenvolvimento backend",
    "created_at": "2026-06-13T12:55:00.000000Z",
    "updated_at": "2026-06-13T12:55:00.000000Z"
  }
}
```

#### Response (403 Forbidden)
*Occurs when the authenticated user does not have the `finance` role.*
```json
{
  "success": false,
  "type": "error",
  "message": "Only finance users can approve or reject payment requests."
}
```

#### Response (422 Unprocessable Entity)
*Occurs when the request has validation errors, or if the target payment request's status is not `pending`.*
```json
{
  "success": false,
  "type": "error",
  "message": "Only pending payment requests can be updated."
}
```
