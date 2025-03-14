document.addEventListener('DOMContentLoaded', function () {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusElement = document.getElementById('status');

    // Check current status
    chrome.runtime.sendMessage({ action: "getStatus" }, function (response) {
        updateStatus(response.isActive);
    });

    // Start button click handler
    startBtn.addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: "startTimer" }, function (response) {
            updateStatus(true);
        });
    });

    // Stop button click handler
    stopBtn.addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: "stopTimer" }, function (response) {
            updateStatus(false);
        });
    });

    // Update the UI to reflect current status
    function updateStatus(isActive) {
        if (isActive) {
            // set badge text as 'on'
            chrome.action.setBadgeText({ text: "on" });
            chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });

            statusElement.textContent = "Active";
            statusElement.className = "active";
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            // set badge text as 'off'
            chrome.action.setBadgeText({ text: "off" });
            chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });

            statusElement.textContent = "Inactive";
            statusElement.className = "";
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }
});