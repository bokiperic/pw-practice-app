import { expect, test } from '@playwright/test'

test.beforeEach(async({page}, testInfo) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)    // For changing the whole test suite (file) timeout
})

test('Auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')
    await successButton.click()

    const text = await successButton.textContent()
    expect(text).toEqual('Data loaded with AJAX get request.')
    
    // allTextContents doesn't have auto-wait, so we need to add additional wait before it executes with 'waitFor' method
    await successButton.waitFor({state: "attached"})
    const text1 = await successButton.allTextContents()
    expect(text1).toContain('Data loaded with AJAX get request.')
})

test('Alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    // Wait for element
    await page.waitForSelector('.bg-success')

    // Wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // Wait for network calls to be completed (NOT RECOMMENDED). If some of the API calls is stuck, your test will also be stuck, even if the API call isn't important for the test execution
    await page.waitForLoadState('networkidle')

    // Wait for perticular timeout (NOT RECOMMENDED)
    await page.waitForTimeout(5000)

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
});

test('Timeouts', async({page}) => {
    test.setTimeout(10000)  // this way you can override global timeout, this is now testTiimeout
    test.slow() // Useful when you know taht you have a slow test - will increase timeoutfor that test by 3x global timeout
    const successButton = page.locator('.bg-success')
    await successButton.click({timeout: 16000}) // this timeout will override the actionTimeout defined in the PW config file
});

