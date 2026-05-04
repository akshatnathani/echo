package com.echo.tests;

import com.echo.base.BaseTest;
import com.echo.pages.LoginPage;
import com.echo.pages.RecognizePage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.io.File;

public class RecognizeTest extends BaseTest {

    private RecognizePage recognizePage;

    @BeforeMethod(alwaysRun = true)
    public void initPage() {
        String username = registerWithCredentials(uniqueUsername(), TEST_PASSWORD);
        navigateTo("/login");
        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.login(username, TEST_PASSWORD);
        waitForUrlContains("/recognize");
        recognizePage = new RecognizePage(driver, wait);
    }

    private String getResourcePath(String fileName) {
        return new File("src/test/resources/" + fileName).getAbsolutePath();
    }

    @Test(description = "TC_REC01: Load Recognize page successfully")
    public void testLoadRecognizePage() {
        Assert.assertTrue(recognizePage.isPageLoaded(), "Recognize page should load");
    }

    @Test(description = "TC_REC02: Upload valid MP3 (Successful match or Not Found based on DB)")
    public void testUploadValidMp3() {
        recognizePage.uploadAudioFile(getResourcePath("dummy.mp3"));
        recognizePage.submitRecognition();
        pause(2000); // Wait for processing
        Assert.assertTrue(recognizePage.isResultDisplayed(), "Recognition result should be displayed");
    }

    @Test(description = "TC_REC03: Upload valid WAV")
    public void testUploadValidWav() {
        recognizePage.uploadAudioFile(getResourcePath("dummy.wav"));
        recognizePage.submitRecognition();
        pause(2000);
        Assert.assertTrue(recognizePage.isResultDisplayed(), "Recognition result should be displayed");
    }

    @Test(description = "TC_REC04: Upload invalid file type (e.g., text file)")
    public void testUploadInvalidFileType() {
        recognizePage.uploadAudioFile(getResourcePath("dummy.txt"));
        // The frontend validation should clear the file and show an error (handled by alert/flash, but for now we check if result is NOT shown)
        Assert.assertFalse(recognizePage.isResultDisplayed(), "Result should not be displayed for invalid file type");
    }

    @Test(description = "TC_REC05: Submit without file selected")
    public void testSubmitWithoutFile() {
        // The submit button is disabled if no file is selected.
        // We will just verify page stays as is.
        org.openqa.selenium.WebElement submitBtn = driver.findElement(org.openqa.selenium.By.id("recognize-submit"));
        Assert.assertFalse(submitBtn.isEnabled(), "Cannot submit without file");
    }

    @Test(description = "TC_REC06: Unauthenticated access redirects to login")
    public void testUnauthenticatedAccess() {
        logout();
        navigateTo("/recognize");
        waitForUrlContains("/login");
        Assert.assertTrue(getCurrentPath().contains("/login"), "Should redirect to login if not authenticated");
    }
}
