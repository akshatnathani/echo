package com.echo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

public class LibraryPage {
    private WebDriver driver;
    private WebDriverWait wait;

    private By searchInput = By.id("song-search");
    private By noSongsMessage = By.id("no-songs-message");
    private By songLibrary = By.id("song-library");
    private By songListItems = By.cssSelector("#song-list li");
    private By uploadButton = By.id("upload-song-btn");
    private By pageTitle = By.id("library-title");

    public LibraryPage(WebDriver driver, WebDriverWait wait) {
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

    public void searchForSong(String query) {
        WebElement searchBox = wait.until(ExpectedConditions.visibilityOfElementLocated(searchInput));
        searchBox.clear();
        searchBox.sendKeys(query);
    }

    public boolean isNoSongsMessageDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(noSongsMessage));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public int getDisplayedSongsCount() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(songLibrary));
            List<WebElement> items = driver.findElements(songListItems);
            return items.size();
        } catch (Exception e) {
            return 0;
        }
    }

    public boolean isUploadButtonVisible() {
        try {
            return driver.findElement(uploadButton).isDisplayed();
        } catch (org.openqa.selenium.NoSuchElementException e) {
            return false;
        }
    }
    
    public void clickUploadButton() {
        wait.until(ExpectedConditions.elementToBeClickable(uploadButton)).click();
    }
}
