/*
Scenario: Two-user direct messaging across isolated browser sessions

Description:
Verify that two distinct users, logged in simultaneously in separate and fully
isolated Playwright browser contexts, can reliably exchange direct messages
in both directions (User B → User A and User A → User B).

The test ensures:
- Complete isolation between sessions (no shared cookies or storage)
- Successful authentication for both users
- Proper handling of post-login prompts or blocking modals
- Correct opening of the same direct message room on both sides
- Reliable message delivery and visibility in the conversation timeline

Preconditions:
- Two valid user accounts exist (User A and User B)
- Both users can authenticate successfully
- A direct message room exists or can be opened between the users

Test Steps:
1. Initialize two isolated Playwright sessions (Context A and Context B).

2. Authenticate User A in Context A and wait for the home page to load.

3. Dismiss any post-login or onboarding prompts for User A.

4. Verify User A is successfully logged in by asserting the home URL.

5. Authenticate User B in Context B and wait for the home page to load.

6. Dismiss any post-login or onboarding prompts for User B.

7. Verify User B is successfully logged in by asserting the home URL.

8. Open the same direct message conversation on both sides:
   - User B opens the DM with User A
   - User A opens the DM with User B
   - Ensure the message composer is ready on both sides

9.  Send a unique message from User B to User A.

10. Verify that User A receives and sees the exact message in the timeline.

11. Send a unique reply from User A to User B.

12. Verify that User B receives and sees the reply in the timeline.

13. Cleanup:
    - Close both browser contexts to ensure isolation for subsequent tests.
*/

import test from '../fixtures/sessions'
import fs from 'fs'
import * as config from '../config'
import { expect } from '@playwright/test'

const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))

test('Two-user DM across isolated sessions: bidirectional message delivery', async ({
	userA,
	userB
}) => {
	// ---------- Login User A ----------
	await userA.loginPage.login({
		username: users.user_A,
		password: users.user_A_password,
		securityKey: users.user_A_securityKey,
		homeserver: users.homeserver
	})

	await userA.syncActivePage()
	await expect(userA.page).toHaveURL(config.homePageUrl)

	// ---------- Login User B ----------
	await userB.loginPage.login({
		username: users.user_B,
		password: users.user_B_password,
		securityKey: users.user_B_securityKey,
		homeserver: users.homeserver
	})

	await userB.syncActivePage()
	await expect(userB.page).toHaveURL(config.homePageUrl)

	// ---------- Prepare unique messages ----------
	const msgFromB = `B-to-A: ${Date.now()}`
	const msgFromA = `A-to-B: ${Date.now()}`

	// ---------- Open the same DM on both sides ----------
	await userA.homePage.openChatOrStartChat(users.user_B)
	await userB.homePage.openChatOrStartChat(users.user_A)

	// ---------- B → A ----------
	await userB.homePage.sendMessage(msgFromB)
	await userA.homePage.expectMessageVisible(msgFromB)

	// ---------- A → B ----------
	await userA.homePage.sendMessage(msgFromA)
	await userB.homePage.expectMessageVisible(msgFromA)
})
