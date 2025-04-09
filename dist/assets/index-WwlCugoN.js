(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const t of o.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&i(t)}).observe(document,{childList:!0,subtree:!0});function n(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(e){if(e.ep)return;e.ep=!0;const o=n(e);fetch(e.href,o)}})();document.querySelector("#app").innerHTML=`
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
`;document.addEventListener("DOMContentLoaded",()=>{const c=document.getElementById("open-door"),r=document.getElementById("close-time"),n=document.getElementById("status-message"),i=document.getElementById("debug-output");c.addEventListener("click",async()=>{const t=parseInt(r.value,10);if(isNaN(t)||t<1){n.textContent="Please enter a valid time (minimum 1 second)",n.className="status error";return}try{c.disabled=!0,n.textContent="Sending request...",n.className="status pending",e(),o(`Initiating door open request with auto-close time: ${t} seconds`);const s=await p(t);o("Response received:",s),n.textContent=`Door opened successfully! Will close in ${t} seconds.`,n.className="status success"}catch(s){o("Error occurred:",s),n.textContent=`Error: ${s.message}`,n.className="status error"}finally{c.disabled=!1}});function e(){i.innerHTML=""}function o(t,s){const u=new Date().toLocaleTimeString(),a=document.createElement("div");a.className="log-entry";let d=`<span class="timestamp">[${u}]</span> ${t}`;if(s){let l;try{l=typeof s=="object"?JSON.stringify(s,null,2):s}catch{l=String(s)}d+=`<pre>${l}</pre>`}a.innerHTML=d,i.appendChild(a),i.scrollTop=i.scrollHeight,console.log(`[${u}] ${t}`,s||"")}});async function p(c){const r="YTIvuZxYXbH0Xk0CBAwMXyiOTDMTaAzwCL9e1o2TPIZbToFCNk5ApzWJwqZFmycV",n="7079171042",e={output:{node:"1",time:c.toString()}},o=new URLSearchParams({authorization:r,lpin:n,cmd:JSON.stringify(e)});console.log("Sending API request with params:",{authorization:"***"+r.substring(r.length-5),lpin:"***"+n.substring(n.length-4),cmd:JSON.stringify(e)});try{const t=await fetch("https://iot-portal.com/api/device.php",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o});if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(t){throw console.error("API request error:",t),new Error("Failed to send door command: "+t.message)}}
