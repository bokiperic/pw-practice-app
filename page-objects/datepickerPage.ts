import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatepickerPage extends HelperBase {

    // private readonly page: Page - No need for this since it is now part of the HelperBase class

    constructor(page: Page) {
        // this.page = page 
        super(page) // replases 'this.page = page' since it is already defined in HelperBase class
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)        
        await expect(calendarInputField).toHaveValue(dateToAssert)

    }

    async selectDatePickerWithRangeFromToday(startDateFromToday: number, endDateFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()

        const dateToAssertStart = await this.selectDateInTheCalendar(startDateFromToday)  
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDateFromToday)  
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`

        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
        
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }

        // day-cell and ng-star-inserted classes will be present in both start date and end date fields (as locators)
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click()
        return dateToAssert
    }

}