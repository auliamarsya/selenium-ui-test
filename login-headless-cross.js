const { Builder, By } = require("selenium-webdriver")
const assert = require("assert");

const chrome = require("selenium-webdriver/chrome");

const saudeDemoLoginHeadlessTest = async() => {
    let options = new chrome.Options();
    options.addArguments("--headless");

    let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    try {
        await driver.get('https://saucedemo.com')

        //login
        await driver.findElement(By.id('user-name')).sendKeys('standard_user')
        await driver.findElement(By.xpath("//input[@id='password']")).sendKeys("secret_sauce")
        await driver.findElement(By.name("login-button")).click()
        
        //validate user login redirect to dashboard
        let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
        assert.strictEqual(titleText.includes("Swag Labs"), true, "Title does not include 'Swag Labs'");
        console.log("User Success Login")

        //add item
        await driver.findElement(By.id('add-to-cart-sauce-labs-backpack')).click();

        let badgeCart = await driver.findElement(By.xpath("//span[@class='shopping_cart_badge']")).getText()
        
        //validate if item added
        assert.strictEqual(badgeCart > 0, true, "Cart does not has item");
        console.log(`Cart has ${badgeCart} item`)
    } finally {
        setTimeout(async() => {
            await driver.quit();
        }, 5000);
    }
}

saudeDemoLoginHeadlessTest();