// Function to extract job application data and send it to the background script
function extractJobApplicationData() {
  const currentWebsite = window.location.hostname;
  const jobApplicationLink = window.location.href;
  const dateOfApplication = new Date().toLocaleDateString();

  if (currentWebsite.includes("lever.co")) {
    const headElement = document.querySelector("head");
    const title = headElement.querySelector("title").textContent.trim();
    const [companyName, positionTitle] = extractCompanyAndPositionFromTitle(title);

    if (companyName && positionTitle) {
      const jobApplicationData = {
        positionName: positionTitle,
        companyName,
        jobApplicationLink,
        dateOfApplication,
      };

      // Listen for the submit event on the job application form and trigger data extraction and sending
      document.addEventListener("submit", (event) => {
        // Send the job application data to the background script to be stored
        let port = chrome.runtime.connect();
        port.postMessage({ action: "storeJobApplicationData", jobApplicationData });
      });
    }
  } else if (currentWebsite.includes("greenhouse.io")) {
    const greenhouseElement = document.querySelector("body");
    const greenhousePosTitle = greenhouseElement.querySelector("#header .app-title");
    const greenhouseCompanyName = greenhouseElement.querySelector("#header .company-name");

    // Extract the text content from the found elements, if they exist
    const appTitle = greenhousePosTitle.textContent.trim();
    const company = greenhouseCompanyName.textContent.trim();

    if (appTitle && company) {
      const jobApplicationData = {
        positionName: appTitle,
        companyName: company,
        jobApplicationLink,
        dateOfApplication,
      };
        // Send the job application data to the background script to be stored
        let port = chrome.runtime.connect();
        port.postMessage({ action: "storeJobApplicationData", jobApplicationData });
      
    }
  }
}

// Function to extract company name and position title from the title
function extractCompanyAndPositionFromTitle(title) {
  // Assuming the title format is "Company Name - Position Title"
  const titleParts = title.split(" - ");
  let companyName = "";
  let positionTitle = "";

  // Extract company name and position title from different positions in the title parts array
  if (titleParts.length >= 2) {
    companyName = titleParts[0];
    positionTitle = titleParts[1];
  } else if (titleParts.length === 1) {
    companyName = titleParts[0];
  }

  return [companyName.trim(), positionTitle.trim()];
}

// Listen for the click event on the "btn-submit" button and trigger data extraction and sending
document.addEventListener("click", (event) => {
  const btnSubmit1 = document.getElementById("btn-submit");
  const btnSubmit2 = document.getElementById("submit_app");
  
  // Check if the clicked element is the "btn-submit" button
  if (event.target === btnSubmit1 || event.target === btnSubmit2) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Extract and send the job application data
    extractJobApplicationData();
  }
});