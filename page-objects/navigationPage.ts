import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {

    // readonly page: Page  - No need for this since it is now part of the HelperBase class
    readonly formLayoutsMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly tooltipMenuItem: Locator

    constructor(page: Page) {
        super(page) // replases 'this.page = page' since it is already defined in HelperBase class
        this.formLayoutsMenuItem = page.getByText('Form Layouts')
        this.datePickerMenuItem = page.getByText('Datepicker')
        this.smartTableMenuItem = page.getByText('Smart Table')
        this.toastrMenuItem = page.getByText('Toastr')
        this.tooltipMenuItem = page.getByText('Tooltip')
    }

    async formLayoutsPage() {
        // await this.page.getByText('Forms').click() // this was before helper method 'selectGroupMenuItem' was created
        await this.selectGroupMenuItem('Forms') // after helper method 'selectGroupMenuItem' was created
        await this.formLayoutsMenuItem.click()
        await this.waitForNumberOfSeconds(2)    // This method is inherited from the HelperBase class now
    }

    async datepickerPage() {
        // await this.page.getByText('Forms').click() - helper method 'selectGroupMenuItem'
        // await this.page.waitForTimeout(1000) - with this and w/o helper method 'selectGroupMenuItem' it will click again on Forms and colapse since in previous (formLayoutsPage) it expanded it 
        
        await this.selectGroupMenuItem('Forms') // after helper method 'selectGroupMenuItem' was created
        await this.datePickerMenuItem.click()
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenuItem.click()
    }

    async toastrPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrMenuItem.click()
    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenuItem.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false") {
            await groupMenuItem.click()
        }
    }

}