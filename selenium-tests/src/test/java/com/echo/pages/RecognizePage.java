package com.echo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class RecognizePage {
    private WebDriver driver;
    private WebDriverWait wait;

    private By fileInput = By.id("audio_file");
    private By submitButton = By.id("recognize-submit");
    private By resultContainer = By.id("recognition-result");
    private By songNameDisplay = By.id("song-name");
    private By confidenceDisplay = By.id("confidence-score");
    private By noMatchMessage = By.id("no-match-message");
    private By pageTitle = By.id("recognize-title");

    public RecognizePage(WebDriver driver, WebDriverWait wait) {
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

    public void uploadAudioFile(String filePath) {
        driver.findElement(fileInput).sendKeys(filePath);
    }

    public void submitRecognition() {
        wait.until(ExpectedConditions.elementToBeClickable(submitButton)).click();
    }

    public boolean isResultDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(resultContainer));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isNoMatchMessageDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(noMatchMessage));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getRecognizedSongName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(songNameDisplay)).getText();
    }

    public String getConfidenceScore() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(confidenceDisplay)).getText();
    }
}
