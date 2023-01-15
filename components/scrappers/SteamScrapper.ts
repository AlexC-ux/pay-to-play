import axios from "axios";
require("chromedriver");
import { Builder, By, Key, until, WebElement } from 'selenium-webdriver';
export class SteamAccount {
    constructor(creds: { login: string, password: string, email: string, emailPassword: string }) {
        (async function example() {
            let driver = await new Builder().forBrowser('chrome').build();
            try {
              await driver.get('https://store.steampowered.com/login/');
              const inputs:WebElement[] = await driver.findElement(By.css("form")).findElements(By.css("input"))
              inputs[0].sendKeys(creds.login, Key.TAB).then(()=>{
                inputs[1].sendKeys(creds.password, Key.ENTER).then(()=>{
                    
                })
              })
            } finally {
              await driver.quit();
            }
          })()
    }
}