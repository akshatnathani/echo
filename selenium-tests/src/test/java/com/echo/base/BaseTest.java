package com.echo.base;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import java.time.Duration;

/**
 * Base test class providing WebDriver setup, teardown, and utility methods.
 */
public class BaseTest {

    protected WebDriver driver;
    protected WebDriverWait wait;
    protected JavascriptExecutor js;

    protected static final String BASE_URL = "http://localhost:5173";
    protected static final Duration TIMEOUT = Duration.ofSeconds(30);
    protected static final Duration POLL_INTERVAL = Duration.ofMillis(500);

    /** Pause between actions (ms) — makes tests visually followable */
    protected static final long STEP_DELAY = 1500;

    // Reusable test credentials
    protected static final String TEST_NAME = "Test User";
    protected static final String TEST_PASSWORD = "TestPass123";

    /**
     * Generate a unique email for each test invocation so registrations never collide.
     */
    protected String uniqueEmail() {
        return "sel_" + System.currentTimeMillis() + "_" + ((int)(Math.random() * 9000) + 1000) + "@test.com";
    }

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        // Allow fake mic/camera streams for testing audio recording
        options.addArguments("--use-fake-ui-for-media-stream");
        options.addArguments("--use-fake-device-for-media-stream");
        // Grant permissions automatically
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--autoplay-policy=no-user-gesture-required");
        options.addArguments("--disable-web-security");
        options.addArguments("--allow-running-insecure-content");
        // Enable browser logging
        options.setCapability("goog:loggingPrefs", java.util.Map.of("browser", "ALL"));
        // Optional: run headless for CI
        // options.addArguments("--headless=new");
        
        // Setup ChromeDriver with explicit version if needed to avoid DevTools mismatch
        // Chrome browser version 147 is extremely high/future-dated, possibly a dev/canary build
        // or a spoofed version. Standardizing the launch.

        driver = new ChromeDriver(options);
        try {
            driver.manage().window().maximize();
        } catch (Exception e) {
            System.err.println("Warning: Could not maximize window initially: " + e.getMessage());
        }
        // Implicit wait — gives every element lookup a small grace period
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        wait = new WebDriverWait(driver, TIMEOUT, POLL_INTERVAL);
        js = (JavascriptExecutor) driver;
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown(org.testng.ITestResult result) {
        if (driver != null) {
            // Dump browser console logs if the test failed
            if (result.getStatus() == org.testng.ITestResult.FAILURE) {
                try {
                    var logs = driver.manage().logs().get(org.openqa.selenium.logging.LogType.BROWSER);
                    if (!logs.getAll().isEmpty()) {
                        System.out.println("[Browser Console] for " + result.getMethod().getMethodName() + ":");
                        for (var entry : logs.getAll()) {
                            System.out.println("  " + entry.getLevel() + " " + entry.getMessage());
                        }
                    }
                } catch (Exception ignored) {}
            }
            driver.quit();
        }
    }

    // ─── Helper Methods ────────────────────────────────────────────

    /**
     * Navigate to a path relative to BASE_URL.
     */
    protected void navigateTo(String path) {
        driver.get(BASE_URL + path);
        pause();
    }

    /**
     * Pause for STEP_DELAY ms so tests are visually followable.
     */
    protected void pause() {
        try { Thread.sleep(STEP_DELAY); } catch (InterruptedException ignored) {}
    }

    /**
     * Pause for a custom duration (ms).
     */
    protected void pause(long millis) {
        try { Thread.sleep(millis); } catch (InterruptedException ignored) {}
    }

    /**
     * Clear localStorage (useful to reset auth state).
     * Navigates to BASE_URL first if the browser is still on a data: or about: URL.
     */
    protected void clearLocalStorage() {
        String url = driver.getCurrentUrl();
        if (url == null || url.startsWith("data:") || url.startsWith("about:")) {
            driver.get(BASE_URL + "/login");
            pause();
        }
        js.executeScript("window.localStorage.clear();");
    }

    /**
     * Get a value from localStorage.
     */
    protected String getLocalStorageItem(String key) {
        return (String) js.executeScript("return window.localStorage.getItem(arguments[0]);", key);
    }

    /**
     * Set a value in localStorage.
     */
    protected void setLocalStorageItem(String key, String value) {
        js.executeScript("window.localStorage.setItem(arguments[0], arguments[1]);", key, value);
    }

    /**
     * Get the current URL path (without base).
     */
    protected String getCurrentPath() {
        String url = driver.getCurrentUrl();
        return url.replace(BASE_URL, "");
    }

    /**
     * Wait for URL to contain a specific path.
     */
    protected void waitForUrlContains(String path) {
        wait.until(d -> d.getCurrentUrl().contains(path));
    }

    /**
     * Quick-register a new user and land on /login (to set up auth for other tests).
     * Retries once if the first attempt fails.
     */
    protected void registerAndLogin() {
        registerWithCredentials(uniqueUsername(), TEST_PASSWORD);
    }

    /**
     * Generate a unique username for each test invocation so registrations never collide.
     */
    protected String uniqueUsername() {
        return "user_" + System.currentTimeMillis() + "_" + ((int)(Math.random() * 9000) + 1000);
    }

    /**
     * Register a user with the given credentials and wait for /login redirect.
     * Retries once on timeout.
     * @return the username that was actually registered (may differ on retry)
     */
    protected String registerWithCredentials(String username, String password) {
        String currentUsername = username;
        com.echo.pages.RegisterPage registerPage = null;
        for (int attempt = 1; attempt <= 2; attempt++) {
            try {
                if (attempt == 2) currentUsername = uniqueUsername();
                navigateTo("/register");
                registerPage = new com.echo.pages.RegisterPage(driver, wait);
                registerPage.enterUsername(currentUsername);
                registerPage.enterPassword(password);
                registerPage.clickRegister();

                // Wait for /login redirect (successful registration redirects to login)
                waitForUrlContains("/login");

                return currentUsername; // success
            } catch (org.openqa.selenium.TimeoutException e) {
                String currentUrl = driver.getCurrentUrl();
                System.out.println("[BaseTest] registration attempt " + attempt + " timed out. URL=" + currentUrl);
                // Try to capture any error on the page
                try {
                    String errText = registerPage != null ? registerPage.getErrorMessage() : "";
                    System.out.println("[BaseTest] Error on page: " + errText);
                } catch (Exception ignored) {
                    System.out.println("[BaseTest] No error message on page");
                }
                if (attempt == 2) throw e;
                try { clearLocalStorage(); } catch (Exception ignored) {}
            }
        }
        return currentUsername;
    }

    /**
     * Click the logout button in the UI.
     * Falls back to clearing local storage and cookies if button is not found.
     */
    protected void logout() {
        try {
            driver.findElement(org.openqa.selenium.By.id("logout-btn")).click();
            pause();
        } catch (Exception e) {
            driver.manage().deleteAllCookies();
            clearLocalStorage();
        }
    }
}
