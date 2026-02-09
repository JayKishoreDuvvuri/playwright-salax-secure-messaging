### Playwright with JavaScript – Secure Messaging Web Client (Salax)

An end-to-end automation project for validating secure messaging workflows in the Salax web client using Playwright with JavaScript. The project follows the Page Object Model (POM) design pattern and supports multiple fully isolated browser sessions to simulate real-world user-to-user messaging scenarios.

This project focuses on validating direct message (DM) delivery between two users logged in simultaneously in separate browser contexts.

#### Application Under Test

- The application under test is a secure messaging web client built on modern web technologies.

- Type: Secure Messaging / Chat Web Application

- Frontend: Modern JavaScript React SPA 

- Authentication: Username, password, recovery key

- Messaging: End-to-end encrypted direct messages

#### Scenarios

```bash
Scenario : Two-user direct messaging across isolated sessions

Scenario Description: Two users log in simultaneously using independent Playwright browser contexts.
User B sends a direct message to User A and verifies delivery.
User A replies to User B and verifies receipt of the reply.

Testname: TC_01_twoUsersChat.test.js
```

#### High-level Steps

1. Create two isolated browser contexts (User A and User B).
2. Log in User A and dismiss post-login security prompts.
3. Log in User B in a separate session and dismiss prompts.
4. Verify both users land on the home page.
5. Both users open the same direct message conversation.
6. User B sends a message → User A verifies receipt.
7. User A replies → User B verifies receipt.
8. Close both browser contexts.


#### Project Structure

```bash
├── pages              # Page Object Model classes
│   ├── basePage.js    # Common reusable actions and helpers
│   ├── loginPage.js   # Login-related actions
│   └── homePage.js    # Messaging and chat actions
│
├── fixtures           # Playwright fixtures
│   └── sessions.js    # Multi-session browser context setup
│
├── tests              # Test specifications
│   └── TC_01_twoUsersChat.test.js
│
├── pageobjects        # UI locator definitions
│   ├── loginPageObjects.js
│   └── homePageObjects.js
│
├── data               # Test data
│   └── users.json
│
├── playwright.config.js
└── package.json
```

#### Installation

Install the dependencies and devDependencies to run the test.

- Clone (OR) Download this repo as zip folder on to your local machine
- Navigate to project's directory on terminal and run the following commands:

Clone the repository

```bash
git clone https://github.com/JayKishoreDuvvuri/playwright-salax-secure-messaging.git
```

Install dependencies

```bash
npm install
npx playwright install --with-deps
```

#### Run application

Run test

```bash
npm run test:chrome - Run the test TC_01_twoUsersChat.test.js on chrome browser
```

#### Playwright Test Report

```bash
npx playwright show-report
```

#### GitHub Actions

```bash
Pipelines: https://github.com/JayKishoreDuvvuri/playwright-salax-secure-messaging.git/actions
```

#### Key Design Decisions

- Separate browser contexts ensure true session isolation.

- Centralized BasePage utilities for waits, locators, and modal handling.

- Role-based locators improve test resilience and accessibility alignment.

- Unique timestamp-based messages avoid flaky assertions.

- No fixed sleeps—Playwright auto-waiting assertions are used.
