const { Builder, By } = require("selenium-webdriver")
const assert = require("assert");

const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const edge = require("selenium-webdriver/edge");

const useSaudeDemoLoginHeadlessTest = async () => {
    describe("saucedemo.com", function() {
        this.timeout(5000);

        const browsers = [
            {
                name: "chrome",
                option: new chrome.Options().addArguments("--headless")
            },
            {
                name: "firefox",
                option: new firefox.Options().addArguments("--headless")
            },
            {
                name: "MicrosoftEdge",
                option: new edge.Options().addArguments("--headless")
            },
        ];
        
        for(let browser of browsers) {
            describe(`Testing on ${browser.name}`, () => {
                let driver;
                
                before(async() => {
                    driver = await new Builder().forBrowser(browser.name)
                    .setChromeOptions(browser.name === 'chrome' ? browser.option : undefined)
                    .setFirefoxOptions(browser.name === 'firefox' ? browser.option : undefined)
                    .setEdgeOptions(browser.name === 'MicrosoftEdge' ? browser.option : undefined)
                    .build();
                })
    
                after(async() => {
                    await driver.quit();
                })

                it("TC01 - Login Success", async() => {
                    //login
                    await driver.get("https://www.saucedemo.com/");
                    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
                    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
                    await driver.findElement(By.name("login-button")).click();
            
                    //validate user logged in
                    let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
                    assert.strictEqual(titleText.includes("Swag Lab"), true, "Title does not include Swag Lab");
                })
            
                it("TC02 - Login Failed", async() => {
                    await driver.get("https://www.saucedemo.com/");
                    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
                    await driver.findElement(By.id("password")).sendKeys("secret_sauces");
                    await driver.findElement(By.name("login-button")).click();
            
                    //error message show
                    let errorMessage = await driver.findElement(By.css(".error-message-container")).getText();
                    assert.strictEqual(errorMessage.includes("Epic sadface: Username and password do not match any user in this service"), true, "Error message");
                })
            
                it("TC03 - Add Item to cart", async() => {
                    await driver.get("https://www.saucedemo.com/");
                    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
                    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
                    await driver.findElement(By.name("login-button")).click();
            
                    //validasi user berada di dashboard
                    let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
                    assert.strictEqual(titleText.includes("Swag Lab"), true, "Title does not include Swag Lab");
            
                    //add item to cart
                    await driver.findElement(By.className("btn btn_primary btn_small btn_inventory")).click();

                    let addCart = await driver.findElement(By.xpath("//span[@class='shopping_cart_badge']")).getText();
                    assert.strictEqual(addCart > 0, true, "No item on cart");
                })

                it("TC03 - Validate Item added on cart", async() => {
                    await driver.get("https://www.saucedemo.com/");
                    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
                    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
                    await driver.findElement(By.name("login-button")).click();
            
                    //validasi user berada di dashboard
                    let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
                    assert.strictEqual(titleText.includes("Swag Lab"), true, "Title does not include Swag Lab");
            
                    //add item to cart
                    await driver.findElement(By.className("btn btn_primary btn_small btn_inventory")).click();
        
                    await driver.findElement(By.id("shopping_cart_container")).click();
                    
                    //validate item added on cart
                    let addCartNumber = await driver.findElements(By.css(".cart_item"));
                    assert.strictEqual(addCartNumber.length > 0, true, "There's no item in cart");
                })
            })
        }
    })
}

useSaudeDemoLoginHeadlessTest();