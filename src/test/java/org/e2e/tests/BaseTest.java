package org.e2e.tests;

import org.e2e.pages.BasePage;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;

import io.github.cdimascio.dotenv.Dotenv;

public class BaseTest {
    protected BasePage basePage;
    protected String applicationUrl;

    public BaseTest() {
        Dotenv dotenv = Dotenv.load();
        applicationUrl = dotenv.get("APPLICATION_URL");
    }

    @BeforeTest
    public void setup() {
        basePage = new BasePage();
        basePage.setup(applicationUrl);
    }

    @AfterTest
    public void teardown() {
        basePage.teardown();
    }
}
