package com.echo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

public class HistoryPage {
    private WebDriver driver;
    private WebDriverWait wait;

    private By pageTitle = By.id("history-title");
    private By noHistoryMessage = By.id("no-history-message");
    private By historyTable = By.id("history-table");
    private By historyRows = By.cssSelector("#history-table tbody tr");
    private By tableHeaders = By.cssSelector("#history-table th");

    public HistoryPage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    public boolean isPageLoaded() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(pageTitle));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isNoHistoryMessageDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(noHistoryMessage));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isHistoryTableDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(historyTable));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public int getHistoryRowCount() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(historyTable));
            return driver.findElements(historyRows).size();
        } catch (Exception e) {
            return 0;
        }
    }

    public List<WebElement> getTableHeaders() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(historyTable));
        return driver.findElements(tableHeaders);
    }
}
