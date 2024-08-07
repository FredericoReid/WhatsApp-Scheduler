package org.e2e.pages;

import org.e2e.common.ApplicationConstants;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class HomePage extends BasePage {
    
    public void validatingTitlePage() throws InterruptedException {
        this.wait.until((ExpectedCondition<Boolean>) wd ->
                ((JavascriptExecutor) wd).executeScript("return document.readyState").equals("complete"));
        String title = BasePage.driver.getTitle();
        assert title.equals("Formulário de Agendamento de Mensagens");
    }

    public void validateUserId(){
        WebElement userID = this.wait.until(ExpectedConditions.visibilityOf(driver.findElement(By.xpath(ApplicationConstants.USER_ID_XPATH))));
        assert userID != null;
    }

    public void validateUserStatus(){
        WebElement userStatus = this.wait.until(ExpectedConditions.visibilityOf(driver.findElement(By.xpath(ApplicationConstants.USER_STATUS_XPATH))));
        assert userStatus.getText().equals("DESCONECTADO");
    }
}