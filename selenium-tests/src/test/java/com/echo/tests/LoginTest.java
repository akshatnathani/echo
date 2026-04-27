package com.echo.tests;

import com.echo.base.BaseTest;
import com.echo.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {

    private LoginPage loginPage;

    @BeforeMethod
    public void initPage() {
        navigateTo("/login");
        loginPage = new LoginPage(driver, wait);
    }

    @Test(description = "TC_L01: Valid admin login")
    public void testValidAdminLogin() {
        loginPage.login("admin", "admin123");
        waitForUrlContains("/recognize");
        Assert.assertTrue(getCurrentPath().contains("/recognize"), "Should redirect to recognize page after admin login");
    }

    @Test(description = "TC_L02: Valid regular user login")
    public void testValidRegularUserLogin() {
        String username = registerWithCredentials(uniqueUsername(), TEST_PASSWORD);
        navigateTo("/login");
        loginPage.login(username, TEST_PASSWORD);
        waitForUrlContains("/recognize");
        Assert.assertTrue(getCurrentPath().contains("/recognize"), "Should redirect to recognize page after regular login");
    }

    @Test(description = "TC_L03: Invalid username")
    public void testInvalidUsername() {
        loginPage.login("invalid_user_not_exist", "somepassword");
        Assert.assertTrue(loginPage.isPageLoaded(), "Should stay on login page");
        Assert.assertEquals(loginPage.getErrorMessage(), "Invalid username or password");
    }

    @Test(description = "TC_L04: Invalid password")
    public void testInvalidPassword() {
        String username = registerWithCredentials(uniqueUsername(), TEST_PASSWORD);
        navigateTo("/login");
        loginPage.login(username, "wrongpassword");
        Assert.assertTrue(loginPage.isPageLoaded(), "Should stay on login page");
        Assert.assertEquals(loginPage.getErrorMessage(), "Invalid username or password");
    }

    @Test(description = "TC_L05: Empty username")
    public void testEmptyUsername() {
        loginPage.login("", "somepassword");
        Assert.assertTrue(loginPage.isPageLoaded(), "Should stay on login page");
        Assert.assertEquals(loginPage.getErrorMessage(), "Username is required");
    }

    @Test(description = "TC_L06: Empty password")
    public void testEmptyPassword() {
        loginPage.login("someuser", "");
        Assert.assertTrue(loginPage.isPageLoaded(), "Should stay on login page");
        Assert.assertEquals(loginPage.getErrorMessage(), "Password is required");
    }
}
