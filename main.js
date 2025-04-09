import './style.css';

// Configuration and constants
const API_KEY = import.meta.env.VITE_API_KEY;
const LPIN = import.meta.env.VITE_LPIN;
const API_BASE_URL = 'https://iot-portal.com/api/device.php';

// DOM Elements
let app;
let statusElement;
let debugOutput;
let unlockButton;
let autoCloseInput;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  app = document.querySelector('#app');
  renderUI();
  
  // Get DOM references after rendering
  statusElement = document.querySelector('#status');
  debugOutput = document.querySelector('#debug-output');
  unlockButton = document.querySelector('#unlock-button');
  autoCloseInput = document.querySelector('#auto-close-time');
  
  // Add event listeners
  unlockButton.addEventListener('click', handleUnlockClick);
  
  // Log initialization
  logMessage('Application initialized');
  
  // Check if environment variables are available
  if (!API_KEY || !LPIN) {
    logMessage('ERROR: API key or PIN not found in environment variables', true);
    updateStatus('Configuration error. Check console for details.', 'error');
    unlockButton.disabled = true;
  } else {
    logMessage('Configuration loaded successfully');
    logMessage(`API Base URL: ${API_BASE_URL}`);
  }
}

function renderUI() {
  app.innerHTML = `
    <div class="container">
      <h1>Door Lock Control</h1>
      
      <div class="control-panel">
        <div class="input-group">
          <label for="auto-close-time">Auto-close after (seconds):</label>
          <input type="number" id="auto-close-time" min="0" max="300" value="30">
        </div>
        
        <button id="unlock-button" class="primary-btn">Unlock Door</button>
        
        <div id="status" class="status"></div>
      </div>
      
      <div class="debug-section">
        <h3>System Log</h3>
        <div id="debug-output" class="debug-output"></div>
      </div>
    </div>
  `;
}

async function handleUnlockClick() {
  const autoCloseTime = parseInt(autoCloseInput.value) || 0;
  
  // Disable button during operation
  unlockButton.disabled = true;
  updateStatus('Sending unlock command...', 'pending');
  
  try {
    logMessage(`Attempting to unlock door with auto-close time: ${autoCloseTime}s`);
    const result = await unlockDoor(autoCloseTime);
    
    if (result.success) {
      updateStatus('Door unlocked successfully!', 'success');
      logMessage('Door unlocked successfully');
    } else {
      updateStatus(`Failed to unlock: ${result.message}`, 'error');
      logMessage(`Unlock failed: ${result.message}`, true);
    }
  } catch (error) {
    updateStatus('Error communicating with door system', 'error');
    logMessage(`Error: ${error.message}`, true);
  } finally {
    // Re-enable button
    unlockButton.disabled = false;
  }
}

async function unlockDoor(autoCloseTime = 0) {
  try {
    // Since API_BASE_URL is now the full endpoint, we don't need to append '/door/unlock'
    const endpoint = API_BASE_URL;
    logMessage(`Preparing API request to: ${endpoint}`);
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        pin: LPIN,
        auto_close_time: autoCloseTime,
        action: 'unlock' // Adding action parameter for the API
      })
    };
    
    logMessage('Request options:', false, {
      method: requestOptions.method,
      headers: { ...requestOptions.headers, 'Authorization': 'Bearer [REDACTED]' },
      body: requestOptions.body
    });
    
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(endpoint, {
        ...requestOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      logMessage(`Response status: ${response.status} ${response.statusText}`);
      
      // Try to parse response as JSON
      let data;
      try {
        data = await response.json();
        logMessage('API response received', false, data);
      } catch (parseError) {
        const textResponse = await response.text();
        logMessage('Failed to parse JSON response', true, textResponse);
        return {
          success: false,
          message: `Invalid response format: ${textResponse.substring(0, 100)}`
        };
      }
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Server error: ${response.status}`
        };
      }
      
      return {
        success: true,
        data: data
      };
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        logMessage('Request timed out after 10 seconds', true);
        return {
          success: false,
          message: 'Request timed out. The server did not respond in time.'
        };
      }
      
      // Check if it's a CORS error
      if (fetchError.message.includes('CORS') || 
          fetchError.message.includes('cross-origin')) {
        logMessage('CORS error detected', true);
        return {
          success: false,
          message: 'Cross-Origin Request Blocked: The API does not allow requests from this origin.'
        };
      }
      
      throw fetchError;
    }
  } catch (error) {
    logMessage(`API request failed: ${error.message}`, true);
    throw error;
  }
}

function updateStatus(message, type = '') {
  if (!statusElement) return;
  
  statusElement.textContent = message;
  statusElement.className = 'status';
  
  if (type) {
    statusElement.classList.add(type);
  }
}

function logMessage(message, isError = false, data = null) {
  if (!debugOutput) return;
  
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  
  const timestampSpan = document.createElement('span');
  timestampSpan.className = 'timestamp';
  timestampSpan.textContent = `[${timestamp}]`;
  
  logEntry.appendChild(timestampSpan);
  logEntry.appendChild(document.createTextNode(` ${message}`));
  
  if (isError) {
    logEntry.style.color = '#e74c3c';
  }
  
  if (data) {
    const pre = document.createElement('pre');
    pre.textContent = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    logEntry.appendChild(pre);
  }
  
  debugOutput.appendChild(logEntry);
  debugOutput.scrollTop = debugOutput.scrollHeight;
  
  // Also log to console for debugging
  if (isError) {
    console.error(message, data || '');
  } else {
    console.log(message, data || '');
  }
}
