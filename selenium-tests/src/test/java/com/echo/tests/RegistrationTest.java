package com.echo.tests;

import com.echo.base.BaseTest;
import com.echo.pages.RegisterPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class RegistrationTest extends BaseTest {

    private RegisterPage registerPage;

    @BeforeMethod
    public void initPage() {
        navigateTo("/register");
        registerPage = new RegisterPage(driver, wait);
    }

    @Test(description = "TC_R01: Valid new user registration")
    public void testValidRegistration() {
        String username = uniqueUsername();
        registerPage.enterUsername(username);
        registerPage.enterPassword(TEST_PASSWORD);
        registerPage.clickRegister();
        Assert.assertTrue(registerPage.getSuccessMessage().contains("successful"), "Should show success message");
        waitForUrlContains("/login");
        Assert.assertTrue(getCurrentPath().contains("/login"), "Should redirect to login");
    }

    @Test(description = "TC_R02: Existing username registration")
    public void testExistingUsernameRegistration() {
        String username = uniqueUsername();
        registerWithCredentials(username, TEST_PASSWORD);
        
        navigateTo("/register");
        registerPage.enterUsername(username);
        registerPage.enterPassword(TEST_PASSWORD);
        registerPage.clickRegister();
        
        Assert.assertEquals(registerPage.getErrorMessage(), "Username already exists");
    }

    @Test(description = "TC_R03: Username too short (<3 chars)")
    public void testUsernameTooShort() {
        registerPage.enterUsername("ab");
        registerPage.enterPassword(TEST_PASSWORD);
        registerPage.clickRegister();
        Assert.assertEquals(registerPage.getErrorMessage(), "Username must be at least 3 characters long");
    }

    @Test(description = "TC_R04: Password too short (<6 chars)")
    public void testPasswordTooShort() {
        registerPage.enterUsername(uniqueUsername());
        registerPage.enterPassword("12345");
        registerPage.clickRegister();
        Assert.assertEquals(registerPage.getErrorMessage(), "Password must be at least 6 characters long");
    }

    @Test(description = "TC_R05: Empty fields registration")
    public void testEmptyFields() {
        registerPage.enterUsername("");
        registerPage.enterPassword("");
        registerPage.clickRegister();
        Assert.assertEquals(registerPage.getErrorMessage(), "Username is required");
    }

    @Test(description = "TC_R06: Successful registration redirects to login via link")
    public void testLoginLink() {
        registerPage.clickLoginLink();
        waitForUrlContains("/login");
        Assert.assertTrue(getCurrentPath().contains("/login"), "Login link should navigate to login page");
    }
}
