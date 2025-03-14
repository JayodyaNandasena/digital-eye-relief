let isActive = false;
let countdownInterval = null;

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({isActive: false});

    // Check if we need to restore the timer after browser restart
    chrome.storage.local.get("isActive", (data) => {
        if (data.isActive) {
            isActive = true;
            startTimer();
        }
    });
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
    // Clear any existing alarms first to prevent duplicates
    stopTimer();

    // Create a new alarm that triggers exactly every 20 minutes
    chrome.alarms.create("eyeReminderAlarm", {
        delayInMinutes: 20,
        periodInMinutes: 20
    });
}

// Stop the timer
function stopTimer() {
    chrome.alarms.clear("eyeReminderAlarm");
}

// Handle the alarm event
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "eyeReminderAlarm") {
        // Double-check if timer is still active
        chrome.storage.local.get("isActive", (data) => {
            if (data.isActive) {
                showNotification();
            }
        });
    }
});

function showNotification() {
    const notificationId = "eyeReminder_" + Date.now();

    chrome.notifications.create(notificationId, {
        type: "basic",
        iconUrl: "images/alarm.png",
        title: "Time for a Break!",
        message: "Look at something 20 feet away for 20 seconds",
        buttons: [
            {title: "Start 20-second countdown"}
        ],
        priority: 2,
        requireInteraction: true  // The notification will remain visible until the user interacts with it
    });
}

// Handle notification button click
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
        // Clear any existing countdown
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        const countdownNotificationId = "countdown_" + Date.now();
        let secondsLeft = 20;

        // Create a static notification
        chrome.notifications.create(countdownNotificationId, {
            type: "basic",
            iconUrl: "images/alarm.png",
            title: "Digital Eye Relief",
            message: "Look at something 20 feet away. Check the extension icon for countdown.",
            priority: 2,
            requireInteraction: true
        });

        // Update the badge with the countdown
        countdownInterval = setInterval(() => {
            chrome.action.setBadgeText({text: secondsLeft.toString()});
            chrome.action.setBadgeBackgroundColor({color: "#4285F4"});

            secondsLeft--;

            if (secondsLeft < 0) {
                clearInterval(countdownInterval);
                chrome.action.setBadgeText({text: "0"});

                // Clear notification and show completion
                chrome.notifications.clear(countdownNotificationId);
                chrome.notifications.create("completion_" + Date.now(), {
                    type: "basic",
                    iconUrl: "images/success.png",
                    title: "Time's Up!",
                    message: "Exercise completed. Your eyes thank you!",
                    priority: 2
                });

                // set badge text to 'on'
                chrome.action.setBadgeText({ text: "on" });
                chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
            }
        }, 1000);
    }
});

// Listen for extension startup
chrome.runtime.onStartup.addListener(() => {
    // Check if timer was active before browser closed
    chrome.storage.local.get("isActive", (data) => {
        if (data.isActive) {
            isActive = true;
            startTimer();
        }
    });
});