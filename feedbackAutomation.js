const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');

// Function to submit feedback with two 5-star ratings
async function giveFeedback(driver, comment) {
  try {
    console.log("Starting feedback submission process...");

    // Mark student as present (uncheck "absent")
    const absentCheckbox = await driver.findElement(By.name("is_student_absent"));
    await driver.wait(until.elementIsVisible(absentCheckbox), 10000);
    await absentCheckbox.click();
    console.log("Checked the student as present.");

    // Select 5 stars for the first rating
    const firstRating = await driver.findElement(By.css(
      '#web-app-body-tag > div.modal-container.open.backdrop-shadow > div > div > div.modal-body > form > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > ul > li:nth-child(5)'
    ));
    await driver.wait(until.elementIsVisible(firstRating), 10000);
    await firstRating.click();
    console.log("Selected 5 stars for the first rating.");

    // Select 5 stars for the second rating
    const secondRating = await driver.findElement(By.css(
      '#web-app-body-tag > div.modal-container.open.backdrop-shadow > div > div > div.modal-body > form > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > ul > li:nth-child(5)'
    ));
    await driver.wait(until.elementIsVisible(secondRating), 10000);
    await secondRating.click();
    console.log("Selected 5 stars for the second rating.");

    // Select comment from dropdown
    const commentDropdown = await driver.findElement(By.id("Comment"));
    await driver.wait(until.elementIsVisible(commentDropdown), 10000);
    await commentDropdown.click();
    console.log("Clicked on the comment dropdown.");

    const dropdownOption = await driver.findElement(By.xpath(`//option[. = '${comment}']`));
    await driver.wait(until.elementIsVisible(dropdownOption), 10000);
    await dropdownOption.click();
    console.log(`Selected the comment option: ${comment}`);

    // Submit feedback
    const submitButton = await driver.findElement(By.css(".rounded-pill"));
    await driver.wait(until.elementIsVisible(submitButton), 10000);
    await submitButton.click();
    console.log("Submitted the feedback.");
  } catch (error) {
    console.error(`Error during feedback submission: ${error.message}`);
    await driver.takeScreenshot().then((image) => {
      fs.writeFileSync('feedback_error_screenshot.png', image, 'base64');
    });
    // Proceed after error
    console.log("Error detected. Will retry after 7 seconds.");
    await driver.sleep(7000); // Wait for 7 seconds before retrying
  }
}

(async function main() {
  let driver;
  try {
    driver = await new Builder().forBrowser('chrome').build();
    console.log("WebDriver initialized.");

    // Navigate to the login page
    await driver.get("https://demi.ischooltech.com/login/tutor");
    console.log("Navigated to the login page.");

    // Manual login
    console.log("Please log in manually. The script will continue once you have logged in.");
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url.includes("my-classes");
    }, 120000); // Wait up to 2 minutes for manual login
    console.log("User has logged in. Proceeding...");

    // Navigate to the feedback page
    await driver.get("https://demi.ischooltech.com/tutor/my-classes");
    console.log("Navigated to the feedback page.");

    // Set window size
    await driver.manage().window().setRect({ width: 1552, height: 832 });
    console.log("Window size set.");

    // ** Wait for 15 seconds for manual filter modification **
    console.log("Waiting 15 seconds to allow manual filter modification...");
    await driver.sleep(15000); // 15-second delay for filter adjustments
    console.log("Manual filter modification complete.");

    // Continuous loop to find students for feedback
    while (true) {
      try {
        // Wait for feedback buttons to load and handle them one by one
        const feedbackButtons = await driver.findElements(By.css("tr .classes-tutor-table__feedback .button"));
        console.log(`Number of feedback buttons found: ${feedbackButtons.length}`);

        if (feedbackButtons.length === 0) {
          console.log("No feedback buttons found. Waiting for new students...");
          await driver.sleep(5000); // Wait for 5 seconds before retrying
          continue; // Skip to the next iteration
        }

        // Loop through each student feedback button and provide feedback
        for (let i = 0; i < feedbackButtons.length; i++) {
          await feedbackButtons[i].click();
          console.log(`Clicked feedback button for student ${i + 1}.`);
          
          // Provide feedback for the student
          await giveFeedback(driver, 'متعاون'); // You can change the comment as needed
          console.log(`Feedback provided for student ${i + 1}.`);

          // Delay between feedback submissions
          await driver.sleep(5000); // Ensure 7-second delay before moving to the next student
        }

      } catch (innerError) {
        console.error(`Error while processing students: ${innerError.message}`);
        // Wait 7 seconds before retrying the entire process
        await driver.sleep(7000);
        console.log("Retrying after 7 seconds...");
      }
    }
  } finally {
    if (driver) {
      await driver.quit();
      console.log("WebDriver closed.");
    }
  }
})();
