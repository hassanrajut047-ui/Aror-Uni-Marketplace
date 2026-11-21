🏛️ Aror University Campus Hub & Marketplace
> **Group Project for CSC101 **  
> **Department of Cyber-Security**  
> *Aror University of Art, Architecture, Design and Heritage*
---
📌 Project Overview
The Aror University Campus Hub & Marketplace is a centralized, client-side web application designed to solve the problem of lost belongings and fragmented student trading across campus. Instead of losing track of items in unorganized social media groups or physical noticeboards, students can report lost items, list found treasures, and trade textbooks or electronics through a single web portal.
The application operates with zero external server dependencies, storing listings dynamically in the browser's `localStorage` while providing administrators with a secure, passcode-gated control panel for report moderation and JSON data backup/recovery.
---
✨ Key Features
🔍 Student Portal (`index.html` & `catalog.html`)
Real-Time Feed & Search: Instantly filter listings by title, description, or campus location.
Category Filtering: Filter items by Lost, Found, or Marketplace with one click.
Status Badges: Clear status tags indicating whether an item is Open, Claimed, or For Sale.
Full Tabular Catalog (`catalog.html`): A clean data table displaying item titles, categories, locations, report dates, status, and contact phone numbers.
📝 Report Submission (`report.html`)
Client-Side Form Validation: Enforces required fields, SAP ID / Roll Number entry, and exact 11-digit Pakistani phone numbers (`03xx-xxxxxxx`).
Photo Upload with Live Preview:
Supports `JPG`, `PNG`, and `WebP` image files.
Encodes photos directly into Base64 via `FileReader.readAsDataURL()`.
Includes a safety cap (1.5 MB limit) to prevent browser `localStorage` overflow.
Live preview container updates immediately upon selecting a file.
Instant Storage Sync: Submitted reports instantly update `localStorage` and appear across the feed, catalog, and admin panel.
🔒 Admin Dashboard (`admin.html`)
Passcode Gate: Secures moderation behind passcode authorization (`aror123`).
Session Persistence: Remembers authenticated state in `sessionStorage` until manual lock out.
Real-Time KPI Cards: Tracks metrics for Total Reports, Open/Active items, Resolved/Claimed items, and Marketplace listings.
Status Toggling & Record Deletion: Admins can toggle report status between Open and Claimed or permanently delete invalid listings.
JSON Backup & Restoration:
Export Backup (`.json`): Downloads a timestamped JSON snapshot of the full marketplace database.
Restore Backup (`.json`): Uploads and validates a JSON backup array directly into `localStorage`.
Reset to Default: Restores the application to its initial baseline demonstration dataset in one click.
---
🛠️ Tech Stack & Architecture
Layer	Technology
Frontend Layout	HTML5 Semantic Elements (`nav`, `main`, `header`, `section`, `footer`)
Styling & Theme	Native CSS3 with CSS Variables (`:root`), Flexbox, Grid & Media Queries
Icons & Typography	Font Awesome 6.5, Segoe UI / Space Grotesk / Inter
Client Logic	Modern Vanilla JavaScript (ES6+, DOM Manipulation, Event Listeners)
Storage Engine	Browser `localStorage` (Items Database) & `sessionStorage` (Admin Auth)
File Processing	Native JavaScript `FileReader` API (Base64 Encoding & JSON I/O)
---
📂 Project Directory Structure
```text
aror-uni-marketplace/
├── index.html         # Main student landing page with dynamic item feed & search
├── catalog.html       # Full tabular directory of active listings
├── report.html        # Form submission page with photo upload & validation
├── admin.html         # Admin login gate, KPI stats, status controls & backup tools
├── style.css          # Main stylesheet for student portal (navbar, feed, forms, catalog)
├── admin.css          # Dedicated stylesheet for admin login card & dashboard
├── script.js         # Core JS handling feed rendering, search, catalog table & form submit
├── admin.js          # Admin authentication, report status toggling, deletion & JSON I/O
└── images/            # Static campus photos & fallback assets
    ├── logo.jpg        # Aror University emblem
    ├── campus-gate.jpg # Main entrance gate banner photo
    ├── campus-sunset.jpg# Header background photo
    └── item1.jpg..item5.jpg # Default fallback item photos
```
---
🚀 Getting Started
No web server, Database server, or `npm` installation is required to run this project!
Clone or Download the Repository:
```bash
   git clone https://github.com/hassanrajut047-ui/aror-uni-marketplace.git
   ```
Open in Browser:
Double-click `index.html` or open it directly inside any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
---
🔐 Admin Dashboard Credentials
Demo Passcode: `aror123`
Access URL: Open `admin.html` in your browser.
> **Note for Project Evaluators:** The passcode authorization uses `sessionStorage` for demonstration purposes during viva defense. In a cloud-deployed environment, authentication should be backed by server-side JWT tokens or hashed database credentials.
---
👥 Project Team Roster
Department of Cyber-Security — Group Project (CSC101)  
Aror University of Art, Architecture, Design and Heritage
Muhammad Hassan Rajput — SAP ID: `5000-208-12`
Mir Atif Ali — SAP ID: `5000-208-11`
Syed Tahzeeb Hyder — Roll No: `5000-204-29`
Uneeb Ali — Roll No: `5000-204-37`
---
📜 License
This project is developed solely for academic demonstration and assessment under the ICT / Cyber-Security Department at Aror University.
