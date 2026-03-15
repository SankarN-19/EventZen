# EventZen — Event Management System

> A full-stack microservices-based Event Management Platform built as part of the Deloitte Training Assignment.

---

## Overview

EventZen is a digital platform that enables an **Admin** to manage venues, vendors, events, bookings, attendees, and budgets — while providing **Customers** a seamless self-service portal to browse events and make bookings.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Service 1 | Spring Boot 3, Spring Security, JPA, MySQL |
| Backend Service 2 | Spring Boot 3, Spring Security, JPA, MySQL |
| Backend Service 3 | Node.js, Express.js, Mongoose, MongoDB |
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Authentication | JWT (shared secret across all services) |
| Containerization | Docker, Docker Compose |

---

## Microservices Architecture

```
eventzen-frontend/               → React + Vite          → Port 5173
EventZenUserAttendeeService/     → Spring Boot           → Port 8081  →  MySQL (eventzen_users)
EventZenVenueService/            → Spring Boot           → Port 8082  →  MySQL (eventzen_venues)
EventZenEventBookingService/     → Node.js + Express     → Port 8083  →  MongoDB (eventzen_events)
```

Each service is **independently deployable** and owns its own database. JWT tokens are issued only by the User Service and validated by all other services using a shared secret.

---

## Project Structure

```
EventZen/
├── EventZenUserAttendeeService/    # Spring Boot — Auth, Users, Attendees
├── EventZenVenueService/           # Spring Boot — Venues, Vendors
├── EventZenEventBookingService/    # Node.js — Events, Bookings, Budgets
└── eventzen-frontend/              # React — Admin Dashboard + Customer Portal
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8
- MongoDB
- Maven

### 1. Database Setup

```sql
CREATE DATABASE eventzen_users;
CREATE DATABASE eventzen_venues;
```

MongoDB database `eventzen_events` is created automatically on first run.

### 2. User & Attendee Service

```bash
cd EventZenUserAttendeeService
# Update src/main/resources/application.properties with your DB credentials
mvn spring-boot:run
# Runs on http://localhost:8081
```

### 3. Venue Service

```bash
cd EventZenVenueService
# Update src/main/resources/application.properties with your DB credentials
mvn spring-boot:run
# Runs on http://localhost:8082
```

### 4. Event & Booking Service

```bash
cd EventZenEventBookingService
cp .env.example .env
# Update .env with your credentials
npm install
npm run dev
# Runs on http://localhost:8083
```

### 5. Frontend

```bash
cd eventzen-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Environment Variables

### Spring Boot Services — `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/eventzen_users
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
jwt.secret=YOUR_JWT_SECRET
```

### Node.js Service — `.env`

```env
PORT=8083
MONGO_URI=mongodb://localhost:27017/eventzen_events
JWT_SECRET=YOUR_JWT_SECRET
```

> JWT secret must be identical across all three services.

---

## API Endpoints Summary

### User & Attendee Service (Port 8081)

| Method | Endpoint | Access |
|---|---|---|
| POST | /auth/register | Public |
| POST | /auth/login | Public |
| POST | /auth/logout | Public |
| GET | /users/{id} | JWT Required |
| PUT | /users/{id} | JWT Required |
| DELETE | /users/{id} | Admin Only |
| GET | /users/all | Admin Only |
| POST | /attendees | Admin Only |
| GET | /attendees | Admin Only |
| GET | /attendees/{id} | Admin Only |
| DELETE | /attendees/{id} | Admin Only |

### Venue Service (Port 8082)

| Method | Endpoint | Access |
|---|---|---|
| POST | /venues | Admin Only |
| GET | /venues | Public |
| GET | /venues/all | Admin Only |
| GET | /venues/{id} | Public |
| PUT | /venues/{id} | Admin Only |
| DELETE | /venues/{id} | Admin Only |
| PUT | /venues/{id}/reactivate | Admin Only |
| GET | /venues/{id}/availability | Public |
| POST | /vendors | Admin Only |
| GET | /vendors | Admin Only |
| PUT | /vendors/{id} | Admin Only |
| DELETE | /vendors/{id} | Admin Only |

### Event & Booking Service (Port 8083)

| Method | Endpoint | Access |
|---|---|---|
| POST | /events | Admin Only |
| GET | /events | Public |
| GET | /events/{id} | Public |
| PUT | /events/{id} | Admin Only |
| DELETE | /events/{id} | Admin Only |
| POST | /bookings | JWT Required |
| GET | /bookings | JWT Required |
| GET | /bookings/{id} | JWT Required |
| PUT | /bookings/{id}/cancel | JWT Required |
| GET | /bookings/admin/bookings | Admin Only |
| PUT | /bookings/admin/bookings/{id}/approve | Admin Only |
| PUT | /bookings/admin/bookings/{id}/reject | Admin Only |
| POST | /budgets | Admin Only |
| GET | /budgets/event/:eventId | Admin Only |
| POST | /budgets/:id/expenses | Admin Only |
| DELETE | /budgets/:id/expenses/:expenseId | Admin Only |

---

## Features

### Admin
- Manage Venues — create, edit, deactivate, reactivate
- Manage Vendors — link service providers to venues
- Manage Events — full CRUD with venue dropdown
- Manage Bookings — approve, reject, view all
- Track Attendees — physical check-in register
- Track Budget — set budget, log expenses, auto-calculate spent and remaining

### Customer
- Browse upcoming events
- Book an event (auto-waitlisted if full)
- View personal booking history
- Cancel bookings

---

## User Roles

| Role | Access |
|---|---|
| ADMIN | Full platform access — all pages and all APIs |
| ATTENDEE | Browse events, book, view own bookings, cancel |

---

## Sample Users

| Name | Email | Role |
|---|---|---|
| Romal Shetty | romal@eventzen.com | ADMIN |
| Sankar N | sankar@gmail.com | ATTENDEE |
| Priya Mehta | priya@gmail.com | ATTENDEE |

---

## Problem Statement Addressed

| Challenge | Solution |
|---|---|
| Manual Event Scheduling | Digital Events + Venues module with full CRUD |
| Inefficient Attendee Management | Bookings module + Attendees check-in register |
| Complex Budget Tracking | Budget module with auto-calculated spent and remaining |
| Limited Customer Engagement | Browse Events + My Bookings self-service portal |

---

## Author

**Sankar N**
Deloitte Training Assignment — Full Stack Microservices
March 2026
