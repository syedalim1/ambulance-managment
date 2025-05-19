# Ambulance Booking System

A comprehensive web-based platform that connects patients, ambulance drivers, and hospitals for efficient emergency medical transportation services.

## Overview

The Ambulance Booking System is designed to streamline the process of booking ambulances during medical emergencies. The system serves three main user roles:

1. **Patients** - Can view available ambulances, book them based on proximity and availability, and view hospital details
2. **Ambulance Drivers** - Can manage incoming patient requests, update their status, and navigate to patient locations
3. **Hospitals** - Can manage their ambulance drivers, view hospital details, and maintain service information

## Features

### For Patients
- View a list of hospitals with their services
- View available ambulances with driver details
- Book ambulances with a simple booking process
- Track booking status

### For Ambulance Drivers
- View and manage incoming patient requests
- Accept or reject booking requests
- Update status (Available, On Duty, Off Duty)
- Track remaining patients when on duty
- Mark completed rides

### For Hospitals
- Manage ambulance drivers (Add, Edit, Delete)
- View driver status and availability
- Update hospital information and services

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: Browser's localStorage (for demo purposes)
- **UI Framework**: Custom CSS with responsive design

## Project Structure

```
ambulance-booking-system/
├── css/
│   ├── styles.css        # Main stylesheet
│   └── dashboard.css     # Dashboard-specific styles
├── js/
│   ├── main.js           # Main JavaScript file
│   ├── auth.js           # Authentication functionality
│   ├── patient-dashboard.js  # Patient dashboard functionality
│   ├── driver-dashboard.js   # Driver dashboard functionality
│   └── hospital-dashboard.js # Hospital dashboard functionality
├── index.html            # Homepage
├── login.html            # Login page
├── signup.html           # Signup page with tabs for different user types
├── patient-dashboard.html # Patient dashboard
├── driver-dashboard.html  # Driver dashboard
├── hospital-dashboard.html # Hospital dashboard
└── README.md             # Project documentation
```

## Installation and Setup

1. Clone the repository or download the source code
2. No build process or server setup is required as this is a client-side only application
3. Open `index.html` in a web browser to start using the application

## Usage Guide

### For First-Time Users

1. Open the application in a web browser
2. Click on "Sign Up" and select your user type (Patient, Ambulance Driver, or Hospital)
3. Fill in the required information and create an account
4. Log in with your credentials

### Demo Accounts

For demonstration purposes, the following accounts are pre-configured:

- **Patient**:
  - Email: patient@example.com
  - Password: Patient123

- **Driver**:
  - Email: driver@example.com
  - Password: Driver123

- **Hospital**:
  - Email: hospital@example.com
  - Password: Hospital123

## Development Notes

- The application uses browser's localStorage for data persistence, which is suitable for demonstration purposes only
- In a production environment, this should be replaced with a proper backend and database
- The system includes mock data to demonstrate functionality

## Future Enhancements

- Real-time tracking of ambulances using maps integration
- Push notifications for status updates
- Integration with hospital management systems
- Mobile application for better accessibility
- Payment gateway integration for ambulance services

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Your Name] - Initial work and development

## Acknowledgments

- This project was created as part of [Course/Project Name]
- Special thanks to [Instructor/Mentor Name] for guidance and support
