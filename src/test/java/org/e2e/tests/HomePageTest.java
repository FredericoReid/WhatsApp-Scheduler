package org.e2e.tests;

import org.e2e.pages.HomePage;
import org.testng.annotations.Test;

public class HomePageTest extends BaseTest {
    private HomePage homePage;

    @Test
    public void validateTitlePage() throws InterruptedException {
        homePage = new HomePage();
        homePage.validatingTitlePage();
    }

    @Test
    public void validateUserId(){
        homePage = new HomePage();
        homePage.validateUserId();
    }

    @Test
    public void validateUserStatus(){
        homePage = new HomePage();
        homePage.validateUserStatus();
    }
}
