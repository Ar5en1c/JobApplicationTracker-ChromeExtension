// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "storeJobApplicationData") {
    const jobApplicationData = request.jobApplicationData;
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

        // Limit the stored applications to the last 5 (if you want to keep only the last 5)
        const lastFiveApplications = jobApplications.slice(0, 5);

        chrome.storage.local.set({ jobApplications: lastFiveApplications }, () => {
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
  return true;
});
