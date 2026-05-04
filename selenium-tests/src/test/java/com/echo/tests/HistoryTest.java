package com.echo.tests;

import com.echo.base.BaseTest;
import com.echo.pages.HistoryPage;
import com.echo.pages.LoginPage;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.List;

public class HistoryTest extends BaseTest {

    private HistoryPage historyPage;

    @BeforeMethod(alwaysRun = true)
    public void initPage() {
        String username = registerWithCredentials(uniqueUsername(), TEST_PASSWORD);
        navigateTo("/login");
        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.login(username, TEST_PASSWORD);
        waitForUrlContains("/recognize");
        navigateTo("/history");
        historyPage = new HistoryPage(driver, wait);
    }

    @Test(description = "TC_H01: Load History page successfully")
    public void testLoadHistoryPage() {
        Assert.assertTrue(historyPage.isPageLoaded(), "History page should load");
    }

    @Test(description = "TC_H02: Verify history table displays correct columns")
    public void testHistoryTableColumns() {
        // Even if empty, the table header might not be shown if "No history" is displayed.
        // For a new user, it shows the "No recognition history yet" message.
        if (historyPage.isHistoryTableDisplayed()) {
            List<WebElement> headers = historyPage.getTableHeaders();
            Assert.assertEquals(headers.get(0).getText(), "Song");
            Assert.assertEquals(headers.get(1).getText(), "Confidence");
            Assert.assertEquals(headers.get(2).getText(), "Status");
            Assert.assertEquals(headers.get(3).getText(), "Date");
        } else {
            Assert.assertTrue(historyPage.isNoHistoryMessageDisplayed(), "Should show empty state");
        }
    }

    @Test(description = "TC_H03: History empty state displays correctly for new user")
    public void testHistoryEmptyState() {
        Assert.assertTrue(historyPage.isNoHistoryMessageDisplayed(), "New user should see empty history message");
        Assert.assertEquals(historyPage.getHistoryRowCount(), 0, "Row count should be 0");
    }

    @Test(description = "TC_H04: Unauthenticated access redirects to login")
    public void testUnauthenticatedAccess() {
        logout();
        navigateTo("/history");
        waitForUrlContains("/login");
        Assert.assertTrue(getCurrentPath().contains("/login"), "Should redirect to login if not authenticated");
    }
}
