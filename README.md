
# CSIR-SERC Recruitment Portal (v4.0.2 Stable)

## 🏛️ Project Overview
The **CSIR-SERC Recruitment Portal** is a GIGW 3.0 compliant, state-of-the-art web application designed to streamline the recruitment process for the Structural Engineering Research Centre. It features a robust multi-role workflow connecting Applicants, Administrative Officers, and the Director through a secure, transparent, and efficient digital interface.

---

## ✨ Features Implemented

### 1. 🖥️ Public Interface (Applicant)
*   **Dynamic Landing Page**: Features a graphical 7-step application process guide with interactive tooltips, marquee news updates, and immediate vacancy stats.
*   **Job Openings**: Searchable and filterable list of active recruitment drives (Scientists, Technical Officers, etc.) with professional status badges.
*   **Identity-Based Auth**: Secure login/registration using Aadhaar UID (simulating UIDAI integration).
*   **7-Step Application Wizard**:
    *   Auto-save functionality.
    *   **AI Assistant**: Gemini Pro integration to auto-generate "Statement of Purpose" (SOP) based on user profile.
    *   **Fluent Uploads**: Drag-and-drop zones for Photos, Signatures, and PDFs with client-side preview and validation.
    *   Final PDF generation and download.
*   **Helpdesk**: Integrated ticketing system for applicants to raise issues regarding payments, uploads, etc.
*   **Quick Status Check**: Public modal to track application status using Application ID without full login.

### 2. 🚀 Administrative Console (System Admin)
*   **Dashboard Analytics**: Real-time charts for registration frequency, scrutiny queues, and system health.
*   **Scrutiny Board**: 
    *   Bulk selection and status updates (Accept/Reject).
    *   "Push to Director" workflow for final approval.
*   **Outreach Module**: 
    *   Multi-channel broadcasting (Email, WhatsApp, Telegram).
    *   Selective filtering by Post or individual candidates.
*   **Helpdesk Management**: 
    *   Ticket overview (Open/Resolved).
    *   **Quick Reply**: Hover-over instant reply functionality for rapid support.
*   **System Settings**:
    *   **Branding**: Dynamic Logo and Banner configuration.
    *   **Notification Gateways**: Configure SMTP, WhatsApp API, and Telegram Bot tokens.
    *   **Backups**: One-click SQL Dump, Artifact Zip, or Full System Snapshot generation.

### 3. 🛡️ Role-Based Access Control (RBAC)
*   **Applicant**: Apply for posts, track status, raise tickets.
*   **Supervisor (Administrative Officer)**: Scrutinize applications, manage helpdesk, conduct outreach.
*   **Director**: View high-level analytics, approve final shortlists.
*   **System Admin**: Full system configuration, backup management, user management.

---

## 🔑 Default Credentials

Use these credentials to access different modules of the application.

| Role | Username / Email | Password / UID | Access Level |
| :--- | :--- | :--- | :--- |
| **System Admin** | `ict.serc@csir.res.in` | `SercAdmin@2024!#Strong` | **Full Control** (Settings, Backups, Users) |
| **Director** | `director.serc@csir.res.in` | `Serc@123456789` | **Strategic** (Analytics, Approvals) |
| **Supervisor** | `admoff.serc@csir.res.in` | `Serc@123456789` | **Operational** (Scrutiny, Helpdesk, Outreach) |
| **Applicant** | *N/A (Uses Aadhaar)* | `123412341234` | **User** (Application Form, Dashboard) |

> **Note**: For Applicant login, use the Aadhaar number `123412341234`. No password is required (simulated OTP flow).

---

## 🗄️ Database Schema

The system is designed for **MariaDB 11.8 LTS**.

### 1. User Table
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100),
    mobile VARCHAR(15),
    aadhaar VARCHAR(12) UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('APPLICANT', 'ADMIN', 'SUPERVISOR', 'DIRECTOR')
);
```

### 2. Job Posts
```sql
CREATE TABLE job_posts (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE, -- e.g., SCI-01-2024
    title VARCHAR(100),
    type ENUM('Scientist', 'Technical Officer', 'Technician'),
    vacancies INT,
    last_date DATE,
    status ENUM('DRAFT', 'PUBLISHED', 'CLOSED', 'RESULT_DECLARED')
);
```

### 3. Applications
```sql
CREATE TABLE applications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    post_id VARCHAR(36),
    status ENUM('Draft', 'Submitted', 'Under Scrutiny', 'Selected', 'Rejected'),
    submitted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES job_posts(id)
);
```

### 4. Support Tickets
```sql
CREATE TABLE support_tickets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    category VARCHAR(50),
    subject VARCHAR(200),
    description TEXT,
    status ENUM('OPEN', 'RESOLVED', 'CLOSED'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ Local Deployment Guide

### Prerequisites
*   Node.js v20+
*   NPM or Yarn

### Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    Access the portal at `http://localhost:5173`.

3.  **Production Build**:
    ```bash
    npm run build
    ```
    The artifacts will be generated in the `dist/` folder, ready for deployment on Nginx/Apache.

---

## 🎨 Design System

*   **Font Family**: `Inter` (Headings), `Noto Sans` (Body), `Monospace` (Badges/IDs).
*   **Color Palette**:
    *   Brand Blue: `#3b82f6` (Primary Action)
    *   CSIR Blue: `#0078D4` (Corporate Identity)
    *   Slate: `#0f172a` (Typography)
*   **Iconography**: Lucide React.
*   **Styling**: Tailwind CSS with custom glass-morphism and fluent design utilities.
