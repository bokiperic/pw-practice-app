import { expect, test } from '@playwright/test'
import { using } from 'rxjs'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Input fields', async({page}) => {
        const usingTheGridEmailInput = await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingTheGridEmailInput.fill('test@test.com')

        // Clear the input field
        await usingTheGridEmailInput.clear()

        // Type text letter by letter (to simulate inputing from the keyboard). Also can create delay between keystrokes in ms
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 300})

        // Generic assertions
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        // Locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test('Radio buttons', async({page}) => {
        const usingTheGridForm = await page.locator('nb-card', {hasText: "Using the Grid"})

        // 'check()' is used for selecting the radio button, but our RB is 'visually-hidden' (class) so we need to add 'force: true' parameter in order for it to work
        // Get by Label selection of radio button
        await usingTheGridForm.getByLabel('Option 1').check({force: true})
        // Get by Role selection of radio button (prefered way)
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true})

        // Generic assertion
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
        expect(radioStatus).toBeTruthy()

        // Locator assertion
        await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })

    test('Checkboxes', async({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()
        
        // check() and uncheck() commands are checking if the checkbox is checked or unchecked (it's status). Click will click (check/uncheck) the checkbox.
        // Because of this if the checkbox is checked and you use check() method it will not uncheck it, but will leave it checked. If it is unchecked
        // then check() will check it. Same applies for the unchecked()
        await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
        await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

        // How to select/unselect all checkboxes on the page
        const allCheckboxes = await page.getByRole('checkbox') // locator of all checkboxes on the page
        
        // Check all
        for(const box of await allCheckboxes.all()) { // .all() will create array from this list, so that we could use for loop on it. And since it is a promice, we need to use 'await'
            await box.check({force: true})
            expect(await box.isChecked()).toBeTruthy()
        }
        
        // Uncheck all
        // for(const box of await allCheckboxes.all()) { 
        //     await box.uncheck({force: true})
        //     expect(await box.isChecked()).toBeFalsy()
        // }
    })

    test('List and Dropdowns', async({page}) => {
        // List isn't displayed at the place of the dropdown button locator, but on the other place in the code
        const dropDownMenu = page.locator('ngx-header nb-select')
        await dropDownMenu.click()

        // How to select items from the list - recommended ways are:
        page.getByRole('list')  // can be used when list has a UL tag
        page.getByRole('listitem')  // can be used when the list has LI tag

        // const optionList = page.getByRole('list').locator('nb-option')   // One way to select list of options
        const optionList = page.locator('nb-option-list nb-option')     // Other way to select list of options
        await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
        await optionList.filter({hasText: "Cosmic"}).click()

        const header = page.locator('nb-layout-header')
        await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

        // Checking all the list options
        const colors = {
            "Light": "rgb(255, 255, 255)",
            "Dark": "rgb(34, 43, 69)",
            "Cosmic": "rgb(50, 50, 89)",
            "Corporate": "rgb(255, 255, 255)",
        }

        await dropDownMenu.click()
        for(const color in colors) {
            await optionList.filter({hasText: color}).click()
            await expect(header).toHaveCSS('background-color', colors[color])
            if(color!="Corporate") {
                await dropDownMenu.click()
            }
        }
    });

    test('Tooltips', async({page}) => {
        // To catch a tooltip - f12
        // Sources tab, hover to show the tooltip, then cmd + / to freeze browser in debug mode
        // Then go to elements and explore the sextion to find the tooltip
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()

        const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
        await toolTipCard.getByRole('button', {name: "Top"}).hover()

        // page.getByRole('toolbar') // ONLY if you (your element) have a role tooltip created (we don't have it here, so will use different method)
        
        const tooltip = await page.locator('nb-tooltip').textContent()
        expect(tooltip).toEqual('This is a tooltip')
    })
    
    test('Dialog Boxes', async({page}) => {
        // Two types of dialog boxes:
        //      1. One that is part of the webpage (popup) - are automated as usual
        //      2. One that is not part of the webpage (like 'Are you sure you want to delete?') - are tricky
        
        // Dialog type 2:
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()
        
        // By default Playwright will cancel this type of dialogbox. To prevent that we need to create a listener
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
        })

        await page.getByRole('table').locator('tr', {hasText: "mdo@gmail"}).locator('.nb-trash').click()
        await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
    })

    test('Web tables', async({page}) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        // 1. How to get the row by any text in this row
        const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
        await targetRow.locator('.nb-edit').click()
        // after clicking on edit button email, age and other fields aren't text anymore, but a property value, 
        // so we must build a new locator and take some other property that is unique for the field
        await page.locator('input-editor').getByPlaceholder('Age').clear()
        await page.locator('input-editor').getByPlaceholder('Age').fill('35')
        await page.locator('.nb-checkmark').click()

        // 2. How to get a row based by the value in the specific column. This value can have same value as some other column.
        // This means the previous strategy won't work, so we will apply new one
        await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
        // const targetRowById = page.getByRole('row', {name: "11"}) - This would be previous strategy and will result in error since 2 rows were found
        const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')}) // filter will get all columns for those 2 rows, take 1st one (0th column will be "Actions" header column) and get the one with text '11'
        await targetRowById.locator('.nb-edit').click()
        await page.locator('input-editor').getByPlaceholder('E-mail').clear()
        await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
        await page.locator('.nb-checkmark').click()
        await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

        // 3. Test filter of the table
        const ages = ["20", "30", "40", "200"] // Test data that we'll use

        for(let age of ages) {
            await page.locator('input-filter').getByPlaceholder('Age').clear()
            await page.locator('input-filter').getByPlaceholder('Age').fill(age)
            await page.waitForTimeout(500) // since animation from entering the value to displaying the results lasts about 0,5 seconds and PW is faster than the animation

            const ageRows = page.locator('tbody tr') // all the rows inside of the table body
            for(let row of await ageRows.all()) {
                const cellValue = await row.locator('td').last().textContent() // take the value from the last column in that row
                if(age == '200') { // this will not return table with values
                    expect(await page.getByRole('table').textContent()).toContain('No data found')
                } else {
                    expect(cellValue).toEqual(age)
                }
            }
        }
    })
    
    test('Date picker', async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Datepicker').click()

        const calendarInputField = page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        // 1. Staticly select date by hardcoded date value

        // uniquely locate the list of the cells for the current month and then use getByText to specificly locate single day of the month
        // await page.locator('[class="day-cell ng-star-inserted"]').getByText('3', {exact: true}).click()
        // await expect(calendarInputField).toHaveValue('Sep 3, 2024')

        
        // 2. Dinamicaly select the date using JS Date() object

        let date = new Date()
        date.setDate(date.getDate() + 35)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        // await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
        // await expect(calendarInputField).toHaveValue(dateToAssert)

        // if selecting like +14 days we should sometines go to the next month, instead this logic will select current month's date
        // this logic will check the month also
        let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} ` // because the format there is " September 2024 ", with all the spaces


        while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }

        await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
        await expect(calendarInputField).toHaveValue(dateToAssert)
    })

    test('Sliders', async({page}) => {
        // There are 2 ways to work with sliders:
        
        // 1. Updating the slider attribute
        const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
        await tempGauge.evaluate( node => {
            node.setAttribute('cx', '232.630')
            node.setAttribute('cy', '232.630')
        })
        await tempGauge.click() // in order for the values to update, not to have circle located differently then real value

        // 2. Simulate the mouse movement
        
        // identify area where we want to move our mouse
        const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')

        // area must be completelly viewable in the browser
        await tempBox.scrollIntoViewIfNeeded()

        // define a bounding box - PW will create coordinates of the element (x, y coord system), since this element is 300x300
        // Bounding box always starts at the top left corner
        // These are just the starting points, you can move your mouse outside of this bounding box by giving the negative coordinate values
        // The only limit is the browser view (that is why we scroll to see the whole element)
        const box = await tempBox.boundingBox()

        // Starting coordinates of our coordinates to be a center of our bounding box
        const x = box.x + box.width / 2
        const y = box.y + box.height / 2

        // Set the mouse to the center of the bounding box
        await page.mouse.move(x, y)

        // Click mouse button to start mouse movement
        await page.mouse.down()

        // Move the mouse to the right
        await page.mouse.move(x + 100, y)

        // Move mouse down
        await page.mouse.move(x + 100, y + 100)

        // Move mouse to the left and up
        // await page.mouse.move(x - 100, y - 100)

        // Release the mouse button
        await page.mouse.up()

        await expect(tempBox).toContainText('30')
    })
    
})