// background.js - Fixed version for reliable repeating notifications

let isActive = false;
let countdownInterval;

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isActive: false });
    console.log("20-20-20 Eye Exercise Reminder installed");

    // Check if we need to restore the timer after browser restart
    chrome.storage.local.get("isActive", (data) => {
        if (data.isActive) {
            isActive = true;
            startTimer();
            console.log("Restored timer state after installation/update");
        }
    });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTimer") {
        isActive = true;
        chrome.storage.local.set({ isActive: true });
        startTimer();
        sendResponse({ status: "Timer started" });
    } else if (message.action === "stopTimer") {
        isActive = false;
        chrome.storage.local.set({ isActive: false });
        stopTimer();
        sendResponse({ status: "Timer stopped" });
    } else if (message.action === "getStatus") {
        chrome.storage.local.get("isActive", (data) => {
            isActive = data.isActive || false;
            sendResponse({ isActive: isActive });
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

    console.log("20-minute timer started at:", new Date().toLocaleTimeString());

    // For debugging: list all active alarms
    chrome.alarms.getAll((alarms) => {
        console.log("Active alarms:", alarms);
    });
}

// Stop the timer
function stopTimer() {
    chrome.alarms.clear("eyeReminderAlarm");
    console.log("Timer stopped");
}

// Handle the alarm event
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("Alarm triggered:", alarm.name, "at", new Date().toLocaleTimeString());

    if (alarm.name === "eyeReminderAlarm") {
        // Double-check if timer is still active
        chrome.storage.local.get("isActive", (data) => {
            if (data.isActive) {
                showNotification();
                console.log("Notification shown");
            } else {
                console.log("Alarm triggered but timer is inactive");
            }
        });
    }
});

// Show the notification
function showNotification() {
    const notificationId = "eyeReminder_" + Date.now();

    chrome.notifications.create(notificationId, {
        type: "basic",
        iconUrl: "images/icon128.png",
        title: "Time for a 20-20-20 Break!",
        message: "Look at something 20 feet away for 20 seconds",
        buttons: [
            { title: "Start 20-second countdown" }
        ],
        priority: 2,
        requireInteraction: true  // The notification will remain visible until the user interacts with it
    });
}

// Handle notification button click
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
        // Start the 20-second countdown
        let secondsLeft = 20;

        // Clear any existing countdown interval
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

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
                countdownInterval = null;

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

// Listen for extension startup
chrome.runtime.onStartup.addListener(() => {
    console.log("Extension starting up");

    // Check if timer was active before browser closed
    chrome.storage.local.get("isActive", (data) => {
        if (data.isActive) {
            isActive = true;
            startTimer();
            console.log("Restored timer after browser startup");
        }
    });
});