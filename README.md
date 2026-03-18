# EventZen — Event Management System

> A full-stack microservices-based Event Management Platform built as part of the Deloitte Training Assignment.

---

## Overview

EventZen is a digital platform that brings together venue management, vendor coordination, attendee bookings, and budget tracking into one unified system. The platform supports three distinct user roles — **Admin**, **Client**, and **Attendee** — each with their own dedicated dashboard and workflow.

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

Each service is **independently deployable** and owns its own database. JWT tokens are issued only by the User Service and validated by all other services using a shared secret. The React frontend acts as the glue — making separate API calls to each service and combining the results into one unified UI.

---

## Project Structure

```
EventZen/
├── EventZenUserAttendeeService/    # Spring Boot — Auth, Users, Attendees
├── EventZenVenueService/           # Spring Boot — Venues, Vendors
├── EventZenEventBookingService/    # Node.js — Events, Bookings, Budgets, Event Requests
└── eventzen-frontend/              # React — Landing Page, Admin Dashboard, Client Portal, Attendee Portal
```

---

## User Roles

| Role | After Login | What They Can Do |
|---|---|---|
| **ADMIN** | `/dashboard` | Manage venues, vendors, events, bookings, attendees, budgets, event requests |
| **CLIENT** | `/client-dashboard` | Submit event requests, track request status with admin responses |
| **ATTENDEE** | `/attendee-dashboard` | Browse upcoming events, book seats, view and cancel own bookings |

---

## Pages & Features

### Admin
| Page | Route | Description |
|---|---|---|
| Dashboard | `/dashboard` | Stats overview, recent bookings |
| Venues | `/venues` | Full CRUD, activate/deactivate toggle |
| Vendors | `/vendors` | Add service providers, link to venues |
| Events | `/events` | Full CRUD with venue dropdown |
| Bookings | `/bookings` | Approve/reject all bookings |
| Attendees | `/attendees` | Physical check-in registry |
| Budget | `/budget` | Budget creation, expense tracking, progress bar |
| Event Requests | `/event-requests` | Review, approve/reject client requests with notes |

### Client
| Page | Route | Description |
|---|---|---|
| Client Dashboard | `/client-dashboard` | Welcome banner, request stats, recent requests |
| Request an Event | `/request-event` | Submit event requirements form |
| My Requests | `/my-requests` | Track status, view admin notes |

### Attendee
| Page | Route | Description |
|---|---|---|
| Attendee Dashboard | `/attendee-dashboard` | Welcome banner, booking stats, upcoming events |
| Browse Events | `/browse` | Event cards, Book Now modal |
| My Bookings | `/my-bookings` | Booking history, cancel option |

### Public
| Page | Route | Description |
|---|---|---|
| Landing Page | `/` | Product homepage with features, how it works, testimonials |
| Login | `/login` | JWT login with role-based redirect |
| Register | `/register` | Registration with 3 role selector cards |

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

-- Add CLIENT to role enum
USE eventzen_users;
ALTER TABLE users MODIFY COLUMN role ENUM('ADMIN', 'ATTENDEE', 'CLIENT') NOT NULL DEFAULT 'ATTENDEE';
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
jwt.expiration=86400000
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
| POST | /event-requests | JWT Required |
| GET | /event-requests | Admin Only |
| GET | /event-requests/my | JWT Required |
| PUT | /event-requests/:id/approve | Admin Only |
| PUT | /event-requests/:id/reject | Admin Only |
| DELETE | /event-requests/:id | Admin Only |

---

## Real World Flow

### Client Flow
1. **Vikram Nair** registers as **CLIENT**
2. Logs in → lands on Client Dashboard
3. Clicks **Request an Event** → fills title, date, capacity, venue preference, budget
4. Submits → status shows **PENDING**
5. Admin reviews and approves with a note → status becomes **APPROVED**
6. Admin creates the actual event on the platform based on the request

### Admin Flow
1. **Romal Shetty** logs in as **ADMIN**
2. Creates Venues and links Vendors to each venue
3. Creates Events based on approved client requests
4. Reviews bookings — approves or rejects
5. Sets up budget per event, logs expenses
6. Marks physical attendees in the Attendees registry

### Attendee Flow
1. **Sankar N** registers as **ATTENDEE**
2. Logs in → lands on Attendee Dashboard
3. Browses upcoming events → clicks **Book Now**
4. Gets **CONFIRMED** booking (or **WAITLISTED** if event is full)
5. Views booking in My Bookings, cancels if needed

---

## Problem Statement Addressed

| Challenge | Solution |
|---|---|
| Manual Event Scheduling | Digital Events + Venues module with full CRUD and venue dropdown |
| Inefficient Attendee Management | Bookings module + Attendees check-in registry + auto-waitlisting |
| Complex Budget Tracking | Budget module with auto-calculated spent and remaining, progress bar |
| Limited Customer Engagement | Browse Events + My Bookings self-service portal for attendees |
| No Client Communication Channel | Event Request system — clients submit requirements, admin responds with notes |

---

## Sample Users

| Name | Email | Role |
|---|---|---|
| Romal Shetty | romal@eventzen.com | ADMIN |
| Vikram Nair | vikram@gmail.com | CLIENT |
| Sankar N | sankar@gmail.com | ATTENDEE |
| Priya Mehta | priya@gmail.com | ATTENDEE |

---

## Author

**Sankar N**
Deloitte Training Assignment — Full Stack Microservices
March 2026
