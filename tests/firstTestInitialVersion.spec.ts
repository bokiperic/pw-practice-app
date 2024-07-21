import {test} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe.skip('Test Suite 1', () => {
    
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
    })

    test('Navigate to Form Layouts page', async ({page}) => {
        await page.getByText('Form Layouts').click()
    })
    
    test('Navigate to Datepicker page', async ({page}) => {
        await page.getByText('Datepicker').click()
    })
})

test.describe.skip('Test Suite 2', () => {
    
    test.beforeEach(async({page}) => {
        await page.getByText('Tables & Data').click()
    })

    test('Navigate to Smart Table page', async({page}) => {
        await page.getByText('Smart Table').click()
    })

    test('Navigate to Tree Greed page', async({page}) => {
        await page.getByText('Tree Grid').click()
    })

})

