document.addEventListener("DOMContentLoaded", () => {
  // Display the previously saved job application data (optional)
  displayJobApplicationData();

  // Add click event listener to the download button
  document.getElementById("downloadButton").addEventListener("click", downloadHistory);
});

function displayJobApplicationData() {
  // Retrieve the stored job application data from the background script
  chrome.storage.local.get("jobApplications", (result) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      const jobApplications = result.jobApplications || [];
      const lastFiveApplications = jobApplications.slice(-5); // Get the last 5 applications if available

      if (lastFiveApplications.length > 0) {
        // Clear previous data
        const jobApplicationDataElement = document.getElementById("jobApplicationData");
        jobApplicationDataElement.innerHTML = "";

        // Loop through the last 5 applications and display the data in the popup
        for (const application of lastFiveApplications) {
          const positionName = application.positionName;
          const companyName = application.companyName;
          const jobApplicationLink = application.jobApplicationLink;
          const dateOfApplication = application.dateOfApplication;

          // Create the combined string for position name and company name
          const positionAndCompany = `${positionName} - ${companyName}`;

          // Create the hyperlink element for the job application link
          const linkElement = document.createElement("a");
          linkElement.href = jobApplicationLink;
          linkElement.textContent = positionAndCompany;
          linkElement.classList.add("link");

          // Create the element to display the date of application
          const dateElement = document.createElement("div");
          dateElement.textContent = `Applied On: ${dateOfApplication}`;

          // Append the elements to the container
          jobApplicationDataElement.appendChild(linkElement);
          jobApplicationDataElement.appendChild(dateElement);

          // Add a line break after each application data
          const separatorElement = document.createElement("hr");
          jobApplicationDataElement.appendChild(separatorElement);
        }
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
