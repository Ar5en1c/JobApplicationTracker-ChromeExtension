// Function to extract job application data and send it to the background script
function extractJobApplicationData() {
  const currentWebsite = window.location.hostname;
  const jobApplicationLink = window.location.href;
  const dateOfApplication = new Date().toLocaleDateString();

  if (currentWebsite.includes("lever.co")) {
    const headElement = document.querySelector("head");
    const title = headElement.querySelector("title").textContent.trim();
    const [companyName, positionTitle] =
      extractCompanyAndPositionFromTitle(title);

    if (companyName && positionTitle) {
      const jobApplicationData = {
        positionName: positionTitle,
        companyName,
        jobApplicationLink,
        dateOfApplication,
      };

      // Listen for the submit event on the job application form and trigger data extraction and sending
      document.addEventListener("submit", (event) => {
        // With this line to send the message to the background script
        chrome.runtime.sendMessage({
          action: "storeJobApplicationData",
          jobApplicationData,
        });
      });
    }
  } else if (currentWebsite.includes("greenhouse.io")) {
    const greenhouseElement = document.querySelector("body");
    const greenhousePosTitle =
      greenhouseElement.querySelector("#header .app-title");
    const greenhouseCompanyName = greenhouseElement.querySelector(
      "#header .company-name"
    );

    // Check if the elements were found before extracting text content
    const appTitle = greenhousePosTitle
      ? greenhousePosTitle.textContent.trim()
      : "";
    const company = greenhouseCompanyName
      ? greenhouseCompanyName.textContent.trim()
      : "";

    if (appTitle && company) {
      const jobApplicationData = {
        positionName: appTitle,
        companyName: company,
        jobApplicationLink,
        dateOfApplication,
      };

      const btnSubmit2 = document.getElementById("submit_app");
      // Listen for the submit event on the job application form and trigger data extraction and sending
      document.addEventListener("click", (event) => {
        if (event.target === btnSubmit2) {
          // With this line to send the message to the background script
          chrome.runtime.sendMessage({
            action: "storeJobApplicationData",
            jobApplicationData,
          });
        }
      });
    }
  } else if (currentWebsite.includes("myworkdayjobs.com")) {
    const headElement = document.querySelector("head");
    const titleElement = headElement.querySelector("title");
    const positionTitle = titleElement
      ? titleElement.textContent.trim().split(" : ")[0]
      : "";
    // const positionElement = document.querySelector(".css-1ozbppc h3.css-y2pr05");
    // Extract the company name from the application link
    const companyName = extractCompanyNameFromLink(jobApplicationLink);

    if (companyName && positionTitle) {
      const jobApplicationData = {
        positionName: positionTitle,
        companyName,
        jobApplicationLink,
        dateOfApplication,
      };

      chrome.runtime.sendMessage({
        action: "storeJobApplicationData",
        jobApplicationData,
      });
    }
  } else if (currentWebsite.includes("ultipro.com")) {
    const imgElement = document.querySelector(
      '[data-automation="navbar-small-logo"]'
    );
    const companyName = imgElement ? imgElement.getAttribute("alt") : "";
    const positionElement = document.querySelector(
      '[data-automation="opportunity-title"]'
    );
    const positionTitle = positionElement
      ? positionElement.textContent.trim()
      : "";

    if (companyName && positionTitle) {
      const jobApplicationData = {
        positionName: positionTitle,
        companyName,
        jobApplicationLink,
        dateOfApplication,
      };

      const sbmtBtn = document.querySelector('[data-automation="btn-submit"]');
      document.addEventListener("click", (event) => {
        if (event.target === sbmtBtn) {
          // With this line to send the message to the background script
          chrome.runtime.sendMessage({
            action: "storeJobApplicationData",
            jobApplicationData,
          });
        }
      });
    }
  } else if (currentWebsite.includes("jobs.smartrecruiters.com")) {
    const positionElement = document.querySelector(
      '[data-test="topbar-job-title"]'
    );
    const companyElement = document.querySelector('[data-test="topbar-logo"]');
    const companyName = companyElement
      ? companyElement.getAttribute("alt")
      : "";
    const positionTitle = positionElement
      ? positionElement.textContent.trim()
      : "";

    if (companyName && positionTitle) {
      const jobApplicationData = {
        positionName: positionTitle,
        companyName,
        jobApplicationLink,
        dateOfApplication,
      };

      const sbmtBtn = document.querySelector('[data-test="footer-submit"]');
      document.addEventListener("click", (event) => {
        if (event.target === sbmtBtn) {
          // With this line to send the message to the background script
          chrome.runtime.sendMessage({
            action: "storeJobApplicationData",
            jobApplicationData,
          });
        }
      });
    }
  } else if (currentWebsite.includes("oraclecloud.com")) {
    // Wait for page to load
    setTimeout(() => {
      // Query selector for the title element
      const titleElement = document.querySelector(
        ".app-header__current-page-title"
      );

      // Extract position title
      const positionTitle = titleElement.innerText.trim();

      // Extract company name
      const companyName = extractCompanyNameFromLink(jobApplicationLink);

      if (companyName && positionTitle) {
        const jobApplicationData = {
          positionName: positionTitle,
          companyName,
          jobApplicationLink,
          dateOfApplication,
        };
        const btnSubmit4 = document.querySelector(
          'button[type="button"][data-bind*="submit"]'
        );

        document.addEventListener("click", (event) => {
          if (event.target === btnSubmit4) {
            // With this line to send the message to the background script
            chrome.runtime.sendMessage({
              action: "storeJobApplicationData",
              jobApplicationData,
            });
          }
        });
      }
    }, 7000);
  } else if (currentWebsite.includes("jobvite.com")) {
    // Wait for page to load
    setTimeout(() => {
      const header = document.querySelector(".jv-page-header");
      const companyName = header.querySelector("h1 a").textContent.trim();
      const positionTitle = document
        .querySelector(".jv-header")
        .textContent.trim();

      if (companyName && positionTitle) {
        const jobApplicationData = {
          positionName: positionTitle,
          companyName,
          jobApplicationLink,
          dateOfApplication,
        };

        const btnSubmit5 = document.querySelector(
          'button.jv-button-primary[type="submit"]'
        );
        console.log(jobApplicationData);
        document.addEventListener("click", (event) => {
          if (event.target === btnSubmit5) {
            // With this line to send the message to the background script
            chrome.runtime.sendMessage({
              action: "storeJobApplicationData",
              jobApplicationData,
            });
          }
        });
      }
    }, 2000);
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

function extractCompanyNameFromLink(link) {
  // Remove the protocol part from the link
  const linkWithoutProtocol = link.replace(/^https?:\/\//, "");

  // Extract the first part of the company name before any dot
  const formattedCompanyName = linkWithoutProtocol.split(".")[0];

  // console.log("OracleCloud Company Name from the link" + formattedCompanyName);
  return formattedCompanyName;
}

// Create a new MutationObserver
const observer = new MutationObserver((mutationsList, observer) => {
  // Check each mutation for added nodes
  for (let mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      // Check if the review job application page element is added
      const reviewPageElement = document.querySelector(
        '[data-automation-id="reviewJobApplicationPage"]'
      );
      const reviewPageElementUltiPro = document.querySelector(
        '[data-automation="navbar-small-logo"]'
      );
      const btnSubmit1 = document.getElementById("btn-submit");
      const btnSubmit2 = document.getElementById("submit_app");
      const btnSubmit3 = document.querySelector('[data-test="footer-submit"]');
      const btnSubmit4 = document.querySelector(
        'button[type="button"][data-bind*="submit"]'
      );
      const btnSubmit5 = document.querySelector(
        'button.jv-button-primary[type="submit"]'
      );

      if (
        reviewPageElement ||
        reviewPageElementUltiPro ||
        btnSubmit1 ||
        btnSubmit2 ||
        btnSubmit3 ||
        btnSubmit4 ||
        btnSubmit5
      ) {
        // Call the function to extract and send the job application data
        extractJobApplicationData();

        // Disconnect the observer since we no longer need it
        observer.disconnect();
        break;
      }
    }
  }
});

// Start observing changes in the document
observer.observe(document, { childList: true, subtree: true });
