import {test} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({page}) => {
    
    // by Tag name
    page.locator('input')

    // by Tag name (first in list)
    page.locator('input').first()

    // by ID
    page.locator('#inputEmail1')

    // by Class value (single value)
    page.locator('.shape-rectangle')

    // by Class value (full/all values)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // by attribute
    page.locator('[placeholder="Email"]')

    // combine different selectors (ex. tag name + attribute + another attribute + class value single)
    page.locator('input[placeholder="Email][nbinput].shape-rectangle"')

    // by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')

})

test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTitle('IoT Dashboard').click()

    await page.getByTestId('SignIn').click()
})

test('Locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign In"}).first().click()

    // Least desirable approach, try to avoid it because sometimes order of the elements on the page change.
    // Same applies for using 'first()' and 'last()' methods
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    // Filter method usage:
    // 1. User facing locators don't have filter options, so they need 'filter()' method
    // 2. You can chain filter with 'filter()' in order to get more precise locator
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    // Should be avoided, since it has an XPath approach.
    // Going a level up (with '..' locator)
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})