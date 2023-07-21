document.addEventListener("DOMContentLoaded", () => {
  // Display the previously saved job application data (optional)
  displayJobApplicationData();

  // Add click event listener to the download button
  document.getElementById("downloadButton").addEventListener("click", downloadHistory);
});

// Function to display job application data in the popup
function displayJobApplicationData() {
  // Retrieve all the stored job application data from the background script
  chrome.storage.local.get("jobApplications", ({ jobApplications }) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }

    // Retrieve the last five job applications using the utility function
    const lastFiveApplications = jobApplications.slice(0, 5);

    // Get the container element in the popup to display job application data
    const jobApplicationDataElement = document.getElementById("jobApplicationData");
    jobApplicationDataElement.innerHTML = "";

    if (lastFiveApplications.length > 0) {
      // Loop through the last 5 applications and display the data in the popup
      for (const application of lastFiveApplications) {
        const { positionName, companyName, jobApplicationLink, dateOfApplication } = application;
        const positionAndCompany = `${positionName} - ${companyName}`;
        const linkElement = document.createElement("a");
        linkElement.href = jobApplicationLink;
        linkElement.textContent = positionAndCompany;
        linkElement.classList.add("link");

        const dateElement = document.createElement("div");
        dateElement.textContent = `Applied On: ${dateOfApplication}`;

        jobApplicationDataElement.appendChild(linkElement);
        jobApplicationDataElement.appendChild(dateElement);

        const separatorElement = document.createElement("hr");
        jobApplicationDataElement.appendChild(separatorElement);
      }
    }
  });
}


function downloadHistory() {
  // Retrieve the stored job application data from the background script
  chrome.storage.local.get("jobApplications", (result) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      const jobApplications = result.jobApplications || [];
      if (jobApplications.length > 0) {
        // Create a CSV content with the job application data
        let csvContent = "Position Name,Company Name,Job Application Link,Date of Application\n";
        for (const application of jobApplications) {
          const positionName = application.positionName;
          const companyName = application.companyName;
          const jobApplicationLink = application.jobApplicationLink;
          const dateOfApplication = application.dateOfApplication;
          csvContent += `"${positionName}","${companyName}","${jobApplicationLink}","${dateOfApplication}"\n`;
        }

        // Create a Blob with the CSV content
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        // Create a download URL and initiate the download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "job_application_history.csv";
        a.click();

        // Cleanup the URL object to free resources
        URL.revokeObjectURL(url);
      }
    }
  });
}
