import { expect } from '@playwright/test'

export default class BasePage {
	constructor(page) {
		this.page = page
	}

	async openApp(path = '/') {
		await this.page.goto(path)
	}

	async wait(ms = 2000) {
		await this.page.waitForTimeout(ms)
	}

	async waitForPageLoad(state = 'domcontentloaded') {
		await this.page.waitForLoadState(state)
	}

	async pause() {
		return await this.page.pause()
	}

	toLocator(selector) {
		if (typeof selector === 'string') return this.page.locator(selector)
		return selector
	}

	byRole(role, options) {
		return this.page.getByRole(role, options)
	}

	byButton(name) {
		return this.page.getByRole('button', { name })
	}

	byLabel(text) {
		return this.page.getByLabel(text)
	}

	byTestId(testId) {
		return this.page.getByTestId(testId)
	}

	byText(text, exact = true) {
		return this.page.getByText(text, { exact })
	}

	// --- Actions ---
	async click(selector) {
		await this.toLocator(selector).click()
	}

	async fill(selector, text) {
		await this.toLocator(selector).fill(text)
	}

	async press(selector, key) {
		await this.toLocator(selector).press(key)
	}

	async expectVisible(selector, timeout = 15000) {
		const loc = this.toLocator(selector)
		await expect(loc).toBeVisible({ timeout })
		return loc
	}

	async dismissCommonAlerts() {
		await this.clickOnLaterIfPresent('Later')
		await this.dismissIfPresent('Dismiss')
		await this.clickOnOKIfPresent('OK')
	}

	async expectMessageVisible(message, timeout = 30000) {
		const timeline = this.page.getByRole('list')
		await expect(timeline.getByText(message, { exact: false })).toBeVisible({
			timeout
		})
	}

	async clickOnLaterIfPresent(text) {
		const later = this.byButton(text)
		try {
			await later.waitFor({ state: 'visible', timeout: 3000 })
			await later.click()
			return true
		} catch {
			return false
		}
	}

	async dismissIfPresent(text) {
		const dismiss = this.byButton(text)
		try {
			await dismiss.waitFor({ state: 'visible', timeout: 3000 })
			await dismiss.click()
			return true
		} catch {
			return false
		}
	}

	async clickOnOKIfPresent(text) {
		const okButton = this.byButton(text)
		try {
			await okButton.waitFor({ state: 'visible', timeout: 3000 })
			await okButton.click()
			return true
		} catch {
			return false
		}
	}

	async clickIfVisible(selector, timeout = 1500) {
		const element = this.toLocator(selector)
		try {
			await element.waitFor({ state: 'visible', timeout })
			await element.click()
			return true
		} catch {
			return false
		}
	}

	async uploadFilesWithChooser(selector, filePath) {
		const trigger = this.toLocator(selector)
		const files = Array.isArray(filePath) ? filePath : [filePath]

		const [chooser] = await Promise.all([
			this.page.waitForEvent('filechooser'),
			trigger.click()
		])
		await chooser.setFiles(files)
	}
}
