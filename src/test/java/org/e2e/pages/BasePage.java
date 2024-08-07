package org.e2e.pages;

import org.e2e.util.ChromeDriverService;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class BasePage {
    public static WebDriver driver = ChromeDriverService.getDriver();
    public final WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));

    public void setup(String applicationUrl) {
        driver.manage().window().maximize();
        driver.get(applicationUrl);
    }

    public void teardown() {
        driver.quit();
    }
}