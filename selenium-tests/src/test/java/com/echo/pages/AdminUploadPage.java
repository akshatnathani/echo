package com.echo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AdminUploadPage {
    private WebDriver driver;
    private WebDriverWait wait;

    private By fileInput = By.id("audio_file");
    private By songNameInput = By.id("song_name");
    private By singerNameInput = By.id("singer_name");
    private By submitBtn = By.id("admin-upload-submit");
    private By errorMessage = By.id("admin-upload-error");
    private By successMessage = By.id("admin-upload-success");

    public AdminUploadPage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    public boolean isPageLoaded() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(songNameInput));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void uploadFile(String filePath) {
        driver.findElement(fileInput).sendKeys(filePath);
    }

    public void enterSongName(String name) {
        driver.findElement(songNameInput).clear();
        driver.findElement(songNameInput).sendKeys(name);
    }

    public void enterSingerName(String name) {
        driver.findElement(singerNameInput).clear();
        driver.findElement(singerNameInput).sendKeys(name);
    }

    public void clickSubmit() {
        wait.until(ExpectedConditions.elementToBeClickable(submitBtn)).click();
    }

    public String getErrorMessage() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage)).getText();
    }

    public String getSuccessMessage() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(successMessage)).getText();
    }
}
