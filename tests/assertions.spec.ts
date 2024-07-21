import { expect, test } from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Assertions', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    /* There are 2 types of assestions in Playwright:
        1. General assertions (also known as Generic assertions) - those are executed instantly, no wait time
        2. Locator assertions - those have a wait time up to 5 seconds for the element to be available
    */

    // General (Generic) assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    // Locator assertion (those have 'await')
    await expect(basicFormButton).toHaveText("Submit")

    // Soft assertion - test execution will continue even if the assertion failed
    // This is considered not a good practice
    await expect.soft(basicFormButton).toHaveText("Submit5")
    await basicFormButton.click()
})