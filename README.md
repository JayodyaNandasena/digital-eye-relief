# Digital Eye Relief Chrome Extension
#### Video Demo: [URL HERE]

#### Description:

**Digital Eye Relief** is a Chrome extension designed to help users maintain healthy eye habits by reminding them to perform the 20-20-20 eye exercise at regular intervals throughout the day. The 20-20-20 rule is a simple method to reduce eye strain, especially for those who spend long hours staring at computer screens. According to the rule, after every 20 minutes of screen use, you should look at something 20 feet away for at least 20 seconds.

The extension sends a notification every 20 minutes, reminding users to take a break and look at something 20 feet away, following the 20-20-20 rule. This helps in reducing digital eye strain and promoting better eye health during extended screen usage.

### Files:

1. **manifest.json**  
   This is the configuration file that defines the extension's properties such as name, version, description, permissions, and background script. It serves as the foundation of the Chrome extension.

2. **background.js**  
   This JavaScript file handles the core functionality of the extension, including setting up the timer and triggering the notification every 20 minutes. It contains the logic for sending the notification after the specified interval and ensuring the countdown works effectively.

3. **popup.html**  
   The HTML file that creates the popup interface users can interact with, providing a way to turn off the notifications, configure the timer, or view the status of the extension.

4. **popup.js**  
   The JavaScript file that handles user interaction with the popup. It allows users to start and stop the notifications and adjust the settings (such as notification sound or timing).

5. **styles.css**  
   This CSS file styles the popup interface to ensure it looks visually appealing and easy to navigate for the users. It defines the layout, colors, fonts, and other visual aspects of the popup.

### Design Decisions:

- **Interval-Based Notification**: The decision to trigger the notification every 20 minutes is rooted in the 20-20-20 rule for eye strain prevention, a well-known recommendation for reducing digital eye fatigue.
  
- **Notification Mechanism**: Chrome’s native notification API is used to send alerts to the user. This decision ensures that the notifications are timely and consistent, even if the browser window is not active.

- **Simple UI**: The popup interface is kept minimal to avoid clutter, focusing solely on the most essential controls — allowing users to toggle the reminders and adjust settings with ease.

### Future Improvements:

- **Customization of Time Intervals**: In future versions, the extension could allow users to set their own intervals for the 20-20-20 rule based on their preferences.
  
- **Sound Alerts**: Implementing sound alerts for those who may not notice the notification visually could be a useful feature for further enhancing the experience.

- **Statistics/Tracking**: Adding a feature to track how often users follow the 20-20-20 rule and providing insights could encourage better habits over time.

This extension was built as part of a personal project aimed at promoting eye health, and it demonstrates the power of simple reminders to improve daily routines, especially for people who work long hours in front of screens.

### Installation Instructions:

1. Clone or download the repository to your local machine.
2. Open the Chrome browser and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the project folder where the extension files are located.
5. The extension should now be active, and you will start receiving notifications every 20 minutes.
6. After loading the extension, you will need to start the notifications manually. To do so:
   - Click the extension icon in the Chrome toolbar.
   - In the popup, click the "Start Notifications" button to begin receiving reminders every 20 minutes.
