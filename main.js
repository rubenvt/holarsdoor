import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>Door Lock Control</h1>
    <div class="control-panel">
      <div class="input-group">
        <label for="close-time">Auto-close after (seconds):</label>
        <input type="number" id="close-time" min="1" max="60" value="5">
      </div>
      <button id="open-door" class="primary-btn">Open Door</button>
      <div id="status-message" class="status"></div>
      <div class="debug-section">
        <h3>Debug Information</h3>
        <div id="debug-output" class="debug-output"></div>
      </div>
    </div>
  </div>
`

// Door lock control functionality
document.addEventListener('DOMContentLoaded', () => {
  const openDoorBtn = document.getElementById('open-door');
  const closeTimeInput = document.getElementById('close-time');
  const statusMessage = document.getElementById('status-message');
  const debugOutput = document.getElementById('debug-output');
  
  openDoorBtn.addEventListener('click', async () => {
    const closeTime = parseInt(closeTimeInput.value, 10);
    
    if (isNaN(closeTime) || closeTime < 1) {
      statusMessage.textContent = 'Please enter a valid time (minimum 1 second)';
      statusMessage.className = 'status error';
      return;
    }
    
    try {
      openDoorBtn.disabled = true;
      statusMessage.textContent = 'Sending request...';
      statusMessage.className = 'status pending';
      
      clearDebugOutput();
      debugLog(`Initiating door open request with auto-close time: ${closeTime} seconds`);
      
      const response = await controlDoor(closeTime);
      
      debugLog('Response received:', response);
      
      statusMessage.textContent = `Door opened successfully! Will close in ${closeTime} seconds.`;
      statusMessage.className = 'status success';
    } catch (error) {
      debugLog('Error occurred:', error);
      statusMessage.textContent = `Error: ${error.message}`;
      statusMessage.className = 'status error';
    } finally {
      openDoorBtn.disabled = false;
    }
  });
  
  // Debug helper functions
  function clearDebugOutput() {
    debugOutput.innerHTML = '';
  }
  
  function debugLog(message, data) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    let logContent = `<span class="timestamp">[${timestamp}]</span> ${message}`;
    
    if (data) {
      let dataDisplay;
      try {
        dataDisplay = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
      } catch (e) {
        dataDisplay = String(data);
      }
      
      logContent += `<pre>${dataDisplay}</pre>`;
    }
    
    logEntry.innerHTML = logContent;
    debugOutput.appendChild(logEntry);
    debugOutput.scrollTop = debugOutput.scrollHeight;
    
    // Also log to console for additional debugging
    console.log(`[${timestamp}] ${message}`, data || '');
  }
});

// Real API function
async function controlDoor(closeTime) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const lpin = import.meta.env.VITE_LPIN;
  
  // Create the command object as per the API requirements
  const op = {
    node: '1',
    time: closeTime.toString()
  };
  
  const cmd = {
    output: op
  };
  
  // Create the params object
  const params = new URLSearchParams({
    authorization: apiKey,
    lpin: lpin,
    cmd: JSON.stringify(cmd)
  });
  
  console.log('Sending API request with params:', {
    authorization: apiKey ? '***' + apiKey.substring(apiKey.length - 5) : 'undefined',
    lpin: lpin ? '***' + lpin.substring(lpin.length - 4) : 'undefined',
    cmd: JSON.stringify(cmd)
  });
  
  try {
    // Make the API request
    const response = await fetch('https://iot-portal.com/api/device.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw new Error('Failed to send door command: ' + error.message);
  }
}
