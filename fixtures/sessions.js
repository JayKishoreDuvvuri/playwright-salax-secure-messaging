import { test as base } from '@playwright/test'
import LoginPage from '../pages/loginPage'
import HomePage from '../pages/homePage'

function createUser(context, page) {
	const user = { context, page }

	const bind = p => {
		user.page = p
		user.loginPage = new LoginPage(p)
		user.homePage = new HomePage(p)
	}

	user.syncActivePage = async () => {
		const pages = context.pages().filter(p => !p.isClosed())
		const active = pages.at(-1)
		if (!active) throw new Error('No active page in context')
		if (active !== user.page) bind(active)
	}

	bind(page)
	return user
}

const test = base.extend({
	userA: async ({ browser }, use) => {
		const context = await browser.newContext()
		const page = await context.newPage()
		await use(createUser(context, page))
		await context.close()
	},

	userB: async ({ browser }, use) => {
		const context = await browser.newContext()
		const page = await context.newPage()
		await use(createUser(context, page))
		await context.close()
	}
})
export default test
