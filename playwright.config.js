import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	timeout: 5 * 90000,
	retries: 0,
	reporter: [[`list`], [`html`]],
	expect: {
		timeout: 10 * 1000
	},
	use: {
		baseURL: 'https://chat.ssh.net/#/login',
		headless: !!process.env.CI,
		viewport: { width: 1720, height: 850 },
		screenshot: `only-on-failure`,
		video: `retain-on-failure`,
		trace: `retain-on-failure`
	},
	projects: [
		{
			name: 'Chrome',
			use: { browserName: 'chromium', channel: `chrome` }
		},
		{
			name: 'Firefox',
			use: { browserName: 'firefox' }
		},
		{
			name: 'Safari',
			use: { browserName: 'webkit' }
		},
		{
			name: 'Edge',
			use: { browserName: 'chromium', channel: `msedge` }
		}
	]
})
