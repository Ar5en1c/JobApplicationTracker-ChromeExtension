chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
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

        chrome.storage.local.set({ jobApplications }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            console.log("Job application data stored successfully");
          }
        });
      }
    });
  }});

  // Return true to indicate the response will be sent asynchronously
  return true;
});