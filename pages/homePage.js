import { expect } from '@playwright/test'
import BasePage from './basePage'

class HomePage extends BasePage {
	constructor(page) {
		super(page)
	}

	async openChatOrStartChat(userName) {
		await this.dismissCommonAlerts()

		const roomsNav = this.byRole('navigation', { name: 'Rooms' })
		await this.expectVisible(roomsNav, 20000)

		// Try existing DM first
		const dmEntry = roomsNav.getByRole('treeitem', { name: userName }).first()
		if (await dmEntry.count()) {
			await dmEntry.click()
			await this.page
				.waitForURL(/#\/room\//, { timeout: 20000 })
				.catch(() => {})
			await this.waitForComposer(30000)
			return
		}

		// Otherwise start chat
		await roomsNav.getByRole('button', { name: 'Start chat' }).click()

		const search = this.byRole('textbox').first()
		await search.fill(userName)

		await this.byRole('option', { name: new RegExp(userName, 'i') })
			.first()
			.click()

		await this.page.waitForURL(/#\/room\//, { timeout: 20000 }).catch(() => {})
		await this.waitForComposer(30000)
	}

	async waitForComposer(timeout = 30000) {
		const composer = this.byRole('textbox', { name: /Send a message to/i })
		await this.expectVisible(composer, timeout)
		await expect(composer).toBeEditable()
		return composer
	}

	async sendMessage(message) {
		const composer = await this.waitForComposer(20000)
		await composer.fill(message)
		const sendBtn = this.byRole('button', { name: 'Send message' })
		await this.expectVisible(sendBtn, 15000)
		await sendBtn.click()
	}
}
export default HomePage
