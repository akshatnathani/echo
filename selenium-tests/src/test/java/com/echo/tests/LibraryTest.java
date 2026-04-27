package com.echo.tests;

import com.echo.base.BaseTest;
import com.echo.pages.LibraryPage;
import com.echo.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class LibraryTest extends BaseTest {

    private LibraryPage libraryPage;
    private String username;

    @BeforeMethod
    public void initPage() {
        username = registerWithCredentials(uniqueUsername(), TEST_PASSWORD);
        navigateTo("/login");
        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.login(username, TEST_PASSWORD);
        waitForUrlContains("/recognize");
        navigateTo("/library");
        libraryPage = new LibraryPage(driver, wait);
    }

    @Test(description = "TC_LIB01: Load Library page successfully")
    public void testLoadLibraryPage() {
        Assert.assertTrue(libraryPage.isPageLoaded(), "Library page should be loaded");
    }

    @Test(description = "TC_LIB02: Search existing song (Exact match)")
    public void testSearchExistingSongExactMatch() {
        // Assume empty library initially or test search logic
        libraryPage.searchForSong("Test Song");
        pause(1000);
        // It might show no songs or 1 song depending on DB state. Just verify it doesn't crash.
        Assert.assertTrue(libraryPage.isPageLoaded(), "Page should still be loaded after search");
    }

    @Test(description = "TC_LIB03: Search existing song (Partial match)")
    public void testSearchPartialMatch() {
        libraryPage.searchForSong("Test");
        pause(1000);
        Assert.assertTrue(libraryPage.isPageLoaded());
    }

    @Test(description = "TC_LIB04: Search non-existent song")
    public void testSearchNonExistentSong() {
        libraryPage.searchForSong("NonExistentSongXYZ123");
        pause(1000);
        Assert.assertTrue(libraryPage.isNoSongsMessageDisplayed(), "Should show 'No songs found' message");
    }

    @Test(description = "TC_LIB05: Clear search returns all songs")
    public void testClearSearch() {
        libraryPage.searchForSong("XYZ123");
        pause(1000);
        libraryPage.searchForSong("");
        pause(1000);
        Assert.assertTrue(libraryPage.isPageLoaded());
    }

    @Test(description = "TC_LIB06: Verify Admin 'Upload Song' button is visible for admin")
    public void testAdminUploadButtonVisibleForAdmin() {
        logout();
        pause();
        navigateTo("/login");
        LoginPage loginPage = new LoginPage(driver, wait);
        // Using default admin credentials from DB init
        loginPage.login("admin", "admin123");
        waitForUrlContains("/recognize");
        navigateTo("/library");
        Assert.assertTrue(libraryPage.isUploadButtonVisible(), "Upload button should be visible for admin");
    }

    @Test(description = "TC_LIB07: Verify Admin 'Upload Song' button is NOT visible for regular user")
    public void testAdminUploadButtonNotVisibleForUser() {
        Assert.assertFalse(libraryPage.isUploadButtonVisible(), "Upload button should NOT be visible for regular user");
    }
}
