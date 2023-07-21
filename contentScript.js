// Function to extract job application data and send it to the background script
function extractJobApplicationData() {
  const headElement = document.querySelector("head");
  const title = headElement.querySelector("title").textContent.trim();
  const [companyName, positionTitle] = extractCompanyAndPositionFromTitle(title);

  if (companyName && positionTitle) {
    const jobApplicationLink = window.location.href;
    const dateOfApplication = new Date().toLocaleDateString();
    const jobApplicationData = {
      positionName: positionTitle,
      companyName,
      jobApplicationLink,
      dateOfApplication,
    };

    // Send the job application data to the background script to be stored
    // Send the job application data to the background script to be stored
  let port = chrome.runtime.connect();
  port.postMessage({ action: "storeJobApplicationData", jobApplicationData });
``}

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
  const btnSubmit = document.getElementById("btn-submit");
  
  // Check if the clicked element is the "btn-submit" button
  if (event.target === btnSubmit) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Extract and send the job application data
    extractJobApplicationData();
  }
});
