const { Builder, By, until } = require('selenium-webdriver');

let driver = new Builder()
    .forBrowser('chrome')
    .build();

driver.get('https://www.mp3juices.cc/');
driver.findElement(By.id('query')).sendKeys('Look at me now Charlie Puth');
driver.findElement(By.id('button')).click();
driver.wait(until.elementLocated(By.id('result_1')), 5 * 1000).then(ele => {
    ele.findElement(By.className('options')).then(
        opt => {
            opt.findElement(By.className("download")).then(
                btn => {
                    btn.click()
                    driver.wait(until.elementLocated(By.id("download_1")), 10000).then(
                        div1 => {
                            div1.findElement(By.className("options")).then(
                                div2 => {
                                    driver.wait(until.elementLocated(By.className("url")), 10000).then(
                                        atag => {
                                            driver.wait(until.elementLocated(By.className("progress")), 10000)
                                                .then(d => {
                                                    driver.wait(until.elementTextContains(d, "The file is ready")).then(
                                                        z => {
                                                            atag.getAttribute("href").then(
                                                                link => {
                                                                    console.log(link)
                                                                }
                                                            )
                                                        }
                                                    )
                                                })
                                        })
                                }
                            )
                        }
                    )
                }
            )
        })
}).catch(err => {
    console.log(err)
})

// driver.quit();