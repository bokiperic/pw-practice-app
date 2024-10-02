import {test, expect} from '@playwright/test'

test('Drag and drop with iFrame', async({page}) => {
    await page.goto('https://www.globalsqa.com/demo-site/draganddrop/')
    
    // iFrame is an HTML document embedded inside another HTML document (a website inside another website), so inside elements are not visible to the PW
    // That is why we firstly need frame locator
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    
    // locate an area where we want to drop an element
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))

    // Same, but with more precise control (controling the mouse)
    await frame.locator('li', {hasText: "High Tatras 4"}).hover()
    await page.mouse.down() // click the mouse on the element
    await frame.locator('#trash').hover() // move the element
    await page.mouse.up() // release the mouse button

    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])

})
