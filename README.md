# Door Lock Control Interface

A web-based interface for controlling an electronic door lock system through the IoT Portal API.

## Overview

This application provides a simple user interface to control a door lock remotely. It allows users to:

- Open the door with a single click
- Set an auto-close timer (1-300 seconds)
- View debug information for troubleshooting

## Features

### Core Functionality
- **Door Control**: Open the door with customizable auto-close timing
- **API Integration**: Connects to the IoT Portal API for real device control
- **Error Handling**: Comprehensive error detection and reporting

### User Interface
- Clean, responsive design
- Status messages for operation feedback
- Debug panel for monitoring API interactions

### Security
- API credentials stored in environment variables
- Masked API key and PIN in console logs

## Technical Implementation

### Architecture
The application is built using vanilla JavaScript with Vite as the build tool. It uses a simple event-driven architecture to handle user interactions and API calls.

### API Integration
The application communicates with the IoT Portal API using standard fetch requests:
- Endpoint: `https://iot-portal.com/api/device.php`
- Method: POST
- Content-Type: application/json
- Authentication: Bearer token

Request payload:
```json
{
  "pin": "[LPIN value]",
  "auto_close_time": 30,
  "action": "unlock"
}
```

### Environment Variables
The application uses the following environment variables:
- `VITE_API_KEY`: Authentication key for the IoT Portal API
- `VITE_LPIN`: Logical PIN for the door lock device

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your API credentials:
   ```
   VITE_API_KEY=your_api_key_here
   VITE_LPIN=your_lpin_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Building for Production
```
npm run build
```

## Deployment

### Netlify Deployment
The application includes a `netlify.toml` configuration file for easy deployment to Netlify:

1. Connect your GitHub repository to Netlify
2. Configure the environment variables in Netlify's dashboard
3. Deploy the site

The configuration handles:
- Build commands and output directory
- CORS headers for API communication
- SPA redirects for proper routing
- Node.js version specification

## Usage Guide

1. **Set Auto-Close Timer**: Enter the number of seconds after which the door should automatically close (1-300 seconds)
2. **Open Door**: Click the "Unlock Door" button to trigger the door opening
3. **Monitor Status**: Check the status message for operation feedback
4. **Debug Mode**: Use the debug panel to view detailed information about API requests and responses

## Troubleshooting

If you encounter issues with the door control:

1. Check the debug panel for detailed error messages
2. Verify your API credentials in the `.env` file
3. Ensure your network allows connections to the IoT Portal API
4. Check for CORS issues if deploying to a different domain than the API

### Common Issues

#### API Connection Failures
- **"Failed to fetch"**: Check network connectivity and API endpoint configuration
- **CORS Errors**: Ensure the API allows requests from your domain or use a CORS proxy
- **Timeout Errors**: The API server may be slow or unresponsive

#### Authentication Issues
- **401 Unauthorized**: Verify your API key is correct
- **403 Forbidden**: Check if your account has permission to access the door lock

## Configuration

The application uses a `config.json` file for key settings:
```json
{
  "apiBaseUrl": "https://iot-portal.com/api/device.php",
  "defaultAutoCloseTime": 30,
  "maxAutoCloseTime": 300
}
```

## License

[Specify your license here]
