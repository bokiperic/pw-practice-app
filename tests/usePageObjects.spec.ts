import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test('navigate to form page', async({page}) => {
    const pm = new PageManager(page)
    // const navigateTo = new NavigationPage(page) - no need for this after creating PageManager, also change navigateTo to pm.navigateTo() in lines bellow
    
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page}) => {
    const pm = new PageManager(page)

    // const navigateTo = new NavigationPage(page)
    // const onFormLayoutsPage = new FormLayoutsPage(page)
    // const onDatePickerPage = new DatepickerPage(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentiansAndSelectOption('test@test.com', 'Welcome1', 'Option 1')

    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('John Smith', 'John@test.com', true)

    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5)
    await pm.onDatepickerPage().selectDatePickerWithRangeFromToday(6, 15)
}) 

