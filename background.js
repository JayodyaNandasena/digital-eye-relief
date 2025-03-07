let isActive = false;
let countdownInterval;

// Initialize extension when installed

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({isActive: false});
    console.log("20-20-20 Eye Exercise Reminder installed");
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTimer") {
        isActive = true;
        chrome.storage.local.set({isActive: true});
        startTimer();
        sendResponse({status: "Timer started"});
    } else if (message.action === "stopTimer") {
        isActive = false;
        chrome.storage.local.set({isActive: false});
        stopTimer();
        sendResponse({status: "Timer stopped"});
    } else if (message.action === "getStatus") {
        chrome.storage.local.get("isActive", (data) => {
            isActive = data.isActive || false;
            sendResponse({isActive: isActive});
        });
        return true; // Required for async sendResponse
    }
});

// Start the 20-minute timer
function startTimer() {
    stopTimer(); // Clear any existing alarms
    chrome.alarms.create("eyeReminderAlarm", {
        delayInMinutes: 0,
        periodInMinutes: 2
    });
    console.log("2-minute timer started");
}

// Stop the timer
function stopTimer() {
    chrome.alarms.clear("eyeReminderAlarm");
    console.log("Timer stopped");
}

// Handle the alarm event
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "eyeReminderAlarm" && isActive) {
        showNotification();
    }
});

// Show the notification
function showNotification() {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "images/icon128.png",
        title: "Time for a 20-20-20 Break!",
        message: "Look at something 20 feet away for 20 seconds",
        buttons: [
            {title: "Start 20-second countdown"}
        ],
        priority: 2
    });
}

// Handle notification button click
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
        // Start the 20-second countdown
        let secondsLeft = 20;

        // Create a countdown notification
        function updateCountdown() {
            chrome.notifications.create("countdownNotification", {
                type: "basic",
                iconUrl: "images/icon128.png",
                title: "20-20-20 Eye Exercise",
                message: `Keep looking at something 20 feet away for ${secondsLeft} seconds`,
                priority: 2
            });

            secondsLeft--;

            if (secondsLeft < 0) {
                clearInterval(countdownInterval);
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "images/icon128.png",
                    title: "Good job!",
                    message: "Exercise completed. Your eyes thank you!",
                    priority: 2
                });
            }
        }

        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }
});