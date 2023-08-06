chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "storeJobApplicationData") {
    const jobApplicationData = message.jobApplicationData;
    chrome.storage.local.get("jobApplications", (result) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      const jobApplications = result.jobApplications || [];
      const existingJobIndex = jobApplications.findIndex(
        (job) =>
          job.positionName === jobApplicationData.positionName &&
          job.companyName === jobApplicationData.companyName
      );
      if (existingJobIndex !== -1) {
        // Remove the existing job entry
        jobApplications.splice(existingJobIndex, 1);
      }

      // Add the latest job entry at the beginning of the array
      jobApplications.unshift(jobApplicationData);
      showNotification("Job application data stored successfully");

      chrome.storage.local.set({ jobApplications }, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log("Job application data stored successfully");
        }
      });
    }
    });
  }
// Return true to indicate the response will be sent asynchronously
return true;});

// Function to show a notification
function showNotification(message) {
  // Change the extension icon to a custom notification icon
  chrome.action.setIcon({ path: "/assets/notif.png" });

  // Set the icon back to the original after a few seconds (adjust the time as needed)
  setTimeout(() => {
    chrome.action.setIcon({ path: {
      "16": "/assets/icon16.png",
      "48": "/assets/icon48.png",
      "128": "/assets/icon128.png",
      "256": "/assets/icon256.png"
    } });
  }, 5000); // Display the custom icon for 3 seconds (you can change the time as needed)
}