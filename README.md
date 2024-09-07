# Feedback Automation Script

## Overview

This repository contains a Node.js automation script designed to streamline the feedback submission process. The script utilizes Selenium WebDriver to interact with a web application, allowing users to automate the process of providing feedback.

## Features

- **Automated Feedback Submission:** Automatically submits feedback with specified ratings and comments.
- **Manual Login Support:** Waits for the user to log in manually before proceeding with automated tasks.
- **Error Handling:** Includes error handling and screenshot capture for debugging purposes.

## Prerequisites

To run this script, you will need:

- [Node.js](https://nodejs.org/) installed on your machine.
- [Google Chrome](https://www.google.com/chrome/) browser installed.
- [ChromeDriver](https://sites.google.com/chromium.org/driver/) compatible with your version of Google Chrome.

## Installation

1. Clone the Repository
 
2. Install Dependencies: npm install
   
##**Configuration**
Update Login and Feedback Page URLs:
   Open the feedbackAutomation.js file.
   Replace https://xxxxxx.com with the login URL of your web application.
   Replace the feedback URL with the actual URL of the feedback page.
   Adjust Script Parameters:

   Modify the comment text in the giveFeedback function as needed.
