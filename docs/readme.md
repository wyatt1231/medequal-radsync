# RadSync

A comprehensive radiology synchronization and management system designed for healthcare facilities to streamline radiological study workflows and patient data management.

## Overview

RadSync is a full-stack web application that provides healthcare professionals with tools to manage radiological studies, patient information, and diagnostic workflows. The system integrates with existing radiology infrastructure to provide a unified interface for study management and reporting.

## Architecture

### Backend (API)
- **Framework**: ASP.NET Core 5.0
- **Database**: MySQL
- **Authentication**: JWT Bearer tokens
- **File Management**: FTP integration for medical imaging files
- **PDF Generation**: iTextSharp for report generation
- **Documentation**: Swagger/OpenAPI

### Frontend (Client)
- **Framework**: React 17 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux with Redux Thunk
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Yup validation
- **PDF Viewing**: React PDF Viewer
- **Rich Text Editor**: React Quill

## Key Features

- **Study Management**: Comprehensive radiology study tracking and management
- **User Authentication**: Secure login system with JWT tokens
- **Patient Data Management**: Patient information and medical history tracking
- **Report Generation**: PDF report creation and management
- **Template System**: Customizable report templates
- **File Management**: FTP-based medical imaging file handling
- **Responsive Design**: Material Design UI components
- **Real-time Updates**: Live data synchronization

## Project Structure

```
radsync/
├── api/                    # ASP.NET Core Web API
│   ├── Controllers/        # API endpoints
│   ├── Entities/          # Data models
│   ├── Repositories/      # Data access layer
│   ├── Services/          # Business logic
│   ├── Context/           # Database context
│   ├── Pdf/               # PDF generation utilities
│   └── Assets/            # Static resources
├── client/                # React frontend application
│   ├── src/
│   │   ├── Components/    # Reusable UI components
│   │   ├── Pages/         # Application pages
│   │   ├── Services/      # API service layer
│   │   ├── Contexts/      # React contexts and Redux store
│   │   ├── Hooks/         # Custom React hooks
│   │   └── Styles/        # Styling and theme
├── docs/                  # Project documentation
└── sites/                 # Deployment configurations
```

## Getting Started

### Prerequisites

- .NET 5.0 SDK
- Node.js 14+ and npm/yarn
- MySQL Server
- Git

### Backend Setup

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Configure database connection in `appsettings.json`

4. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:44341`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`

4. Start the development server:
   ```bash
   npm start
   ```

The client will be available at `http://localhost:3000`

## Configuration

### Database Configuration
Update the connection string in `api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "MySqlConnection": "Data Source=server;port=3309;Initial Catalog=database;User Id=username;password=password;SslMode=none;"
  }
}
```

### FTP Configuration
Configure FTP settings for medical imaging file management:
```json
{
  "FTP": {
    "ip": "ftp-server-ip",
    "user": "username",
    "pass": "password",
    "base_url": "RADSYNC"
  }
}
```

## Development

### Available Scripts

#### Backend
- `dotnet run` - Start the development server
- `dotnet build` - Build the project
- `dotnet test` - Run tests

#### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Security Features

- JWT-based authentication
- Role-based access control
- Secure API endpoints
- CORS configuration
- Input validation and sanitization

## Integration

The system is designed to integrate with:
- PACS (Picture Archiving and Communication System)
- RIS (Radiology Information System)
- External radiology viewers
- FTP servers for medical imaging

## License

This project is proprietary software developed for healthcare facilities.

## Support

For technical support and questions, please contact the development team.
