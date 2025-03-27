# Door Lock Control Interface

A web-based interface for controlling an electronic door lock system through the IoT Portal API.

## Overview

This application provides a simple user interface to control a door lock remotely. It allows users to:

- Open the door with a single click
- Set an auto-close timer (1-60 seconds)
- Toggle between simulation mode and real API mode for testing
- View debug information for troubleshooting

## Features

### Core Functionality
- **Door Control**: Open the door with customizable auto-close timing
- **API Integration**: Connects to the IoT Portal API for real device control
- **Simulation Mode**: Test the interface without making actual API calls

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
- Content-Type: application/x-www-form-urlencoded

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

## Usage Guide

1. **Set Auto-Close Timer**: Enter the number of seconds after which the door should automatically close (1-60 seconds)
2. **Open Door**: Click the "Open Door" button to trigger the door opening
3. **Monitor Status**: Check the status message for operation feedback
4. **Debug Mode**: Use the debug panel to view detailed information about API requests and responses
5. **Toggle Simulation**: Switch between simulation mode and real API mode using the toggle button

## Known Issues

- **CORS Limitations**: When deployed to certain environments (e.g., Netlify), the application may encounter CORS policy restrictions when attempting to communicate with the IoT Portal API
- **API Rate Limiting**: The IoT Portal API may have rate limiting that restricts frequent requests

## Troubleshooting

If you encounter issues with the door control:

1. Check the debug panel for detailed error messages
2. Verify your API credentials in the `.env` file
3. Ensure your network allows connections to the IoT Portal API
4. Try using simulation mode to verify the interface is working correctly

## License

[Specify your license here]
