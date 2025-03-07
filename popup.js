document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusElement = document.getElementById('status');

// Check current status
    chrome.runtime.sendMessage({ action: "getStatus" }, function(response) {
        updateStatus(response.isActive);
    });

// Start button click handler
    startBtn.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "startTimer" }, function(response) {
            console.log(response.status);
            updateStatus(true);
        });
    });

// Stop button click handler
    stopBtn.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "stopTimer" }, function(response) {
            console.log(response.status);
            updateStatus(false);
        });
    });

// Update the UI to reflect current status
    function updateStatus(isActive) {
        if (isActive) {
            statusElement.textContent = "Active";
            statusElement.className = "active";
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            statusElement.textContent = "Inactive";
            statusElement.className = "";
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }
});