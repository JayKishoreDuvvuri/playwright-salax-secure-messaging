import BasePage from './basePage'
import * as loginPageObjects from '../pageobjects/loginPageObjects'

class LoginPage extends BasePage {
	constructor(page) {
		super(page)
	}

	async login({ username, password, securityKey, homeserver }) {
		if (!username || !password || !securityKey) {
			throw new Error('username, password, securityKey are required')
		}

		await this.openApp()
		await this.waitForPageLoad()
		if (homeserver) {
			const homeserverInput = this.byLabel(loginPageObjects.homeserverAddress)
			const addButton = this.byRole('button', { name: 'Add' })
			await homeserverInput.click()
			await homeserverInput.fill(homeserver, { delay: 2000 })

			await addButton.click()
		}
		// ---------- Continue ----------
		await this.byButton(loginPageObjects.continueButton).click()

		// ---------- Credentials ----------
		await this.byLabel(loginPageObjects.usernameOrEmail).fill(username)
		await this.byLabel(loginPageObjects.password).fill(password)

		await this.byButton(loginPageObjects.continueButton).click()
		await this.byButton(loginPageObjects.continueButton).click()

		// ---------- Security Key ----------
		await this.byButton(loginPageObjects.verifyWithSecurityKeyButton).click()

		const dlg = this.byRole('dialog', { name: 'Security Key' })
		await this.expectVisible(dlg, 15000)
		await dlg.getByLabel('Security Key', { exact: true }).fill(securityKey)
		await this.byButton(loginPageObjects.continueButton).click()

		// ---------- Dismiss Alerts ----------
		await this.waitForPageLoad()
		await this.dismissCommonAlerts()
	}
}
export default LoginPage
