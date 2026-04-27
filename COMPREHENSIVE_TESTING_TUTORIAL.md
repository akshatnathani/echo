# Comprehensive Software Testing Tutorial

## Table of Contents

1. [Introduction to Software Testing](#introduction-to-software-testing)
2. [Testing Fundamentals](#testing-fundamentals)
3. [Java Basics for Testing](#java-basics-for-testing)
4. [Maven Fundamentals](#maven-fundamentals)
5. [TestNG Framework](#testng-framework)
6. [Selenium WebDriver](#selenium-webdriver)
7. [Page Object Model](#page-object-model)
8. [Data-Driven Testing](#data-driven-testing)
9. [XSLT Reporting](#xslt-reporting)
10. [SoundID Test Suite Deep Dive](#soundid-test-suite-deep-dive)
11. [Testing Best Practices](#testing-best-practices)
12. [Advanced Concepts](#advanced-concepts)

---

## Introduction to Software Testing

### What is Software Testing?

Software testing is the process of evaluating a software application to:
- Verify it meets specified requirements
- Identify defects and bugs
- Ensure quality and reliability
- Validate user experience

### Why Do We Test?

1. **Prevent Bugs**: Catch issues before users do
2. **Save Money**: Fixing bugs in production is 10-100x more expensive
3. **Build Confidence**: Know your app works as expected
4. **Documentation**: Tests serve as living documentation
5. **Refactoring Safety**: Change code without breaking functionality

### Types of Testing

#### 1. Manual Testing
- Human testers manually execute test cases
- Pros: Flexible, can detect UX issues
- Cons: Slow, error-prone, not scalable

#### 2. Automated Testing
- Software executes test cases automatically
- Pros: Fast, repeatable, scalable
- Cons: Initial setup cost, maintenance overhead

#### 3. Testing Pyramid

```
        /\
       /  \      E2E Tests (Selenium)
      /____\     - Few tests
     /      \    - Slow, expensive
    /________\   - Full system integration
   /          \  
  /  Integration\  Integration Tests
 /______________\ - API tests, database tests
/                \
/   Unit Tests    \ Unit Tests (JUnit)
\________________/ - Many tests
                 - Fast, cheap
                 - Isolated components
```

### Testing Levels

1. **Unit Testing**: Test individual functions/methods in isolation
2. **Integration Testing**: Test how components work together
3. **System Testing**: Test the entire system as a whole
4. **End-to-End (E2E) Testing**: Test user workflows from start to finish

### Testing Approaches

1. **Black Box Testing**: Test without knowing internal code
2. **White Box Testing**: Test with knowledge of internal code
3. **Gray Box Testing**: Combination of both

---

## Testing Fundamentals

### Test Case

A test case is a set of conditions to verify a feature:

```
Test Case: User Login
- Precondition: User is registered
- Input: username="admin", password="admin123"
- Expected Result: Redirect to dashboard
- Actual Result: [filled during test execution]
- Status: PASS/FAIL
```

### Test Suite

A collection of test cases organized by feature or module.

### Test Plan

A document describing:
- Scope of testing
- Test strategy
- Resources needed
- Schedule
- Risk assessment

### Test Execution

Running test cases and recording results.

### Test Report

Summary of test execution showing:
- Total tests run
- Passed/failed counts
- Execution time
- Error details

---

## Java Basics for Testing

### Why Java for Testing?

- Object-oriented and type-safe
- Extensive testing ecosystem
- Cross-platform
- Industry standard for enterprise testing

### Java Fundamentals for Testing

#### 1. Classes and Objects

```java
// Class definition
public class User {
    private String username;
    private String password;
    
    // Constructor
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    // Getter methods
    public String getUsername() {
        return username;
    }
    
    public String getPassword() {
        return password;
    }
}

// Creating objects
User user = new User("admin", "admin123");
```

#### 2. Methods

```java
public class Calculator {
    // Method with parameters and return value
    public int add(int a, int b) {
        return a + b;
    }
    
    // Method with no return value (void)
    public void printResult(int result) {
        System.out.println("Result: " + result);
    }
}
```

#### 3. Access Modifiers

```java
public class Example {
    public String publicField = "accessible everywhere";
    private String privateField = "accessible only in this class";
    protected String protectedField = "accessible in package and subclasses";
    String defaultField = "accessible only in package";
}
```

#### 4. Inheritance

```java
// Parent class
public class Animal {
    public void eat() {
        System.out.println("Animal eats");
    }
}

// Child class
public class Dog extends Animal {
    public void bark() {
        System.out.println("Dog barks");
    }
}

// Dog inherits eat() method from Animal
```

#### 5. Interfaces

```java
// Interface defines contract
public interface Testable {
    void runTest();
    String getTestName();
}

// Class implements interface
public class LoginTest implements Testable {
    public void runTest() {
        System.out.println("Running login test");
    }
    
    public String getTestName() {
        return "Login Test";
    }
}
```

#### 6. Annotations

```java
// Annotations provide metadata
@Test
public void testLogin() {
    // This is a test method
}

@BeforeMethod
public void setup() {
    // This runs before each test
}

@AfterMethod
public void teardown() {
    // This runs after each test
}
```

#### 7. Exception Handling

```java
public void testLogin() {
    try {
        loginPage.login("admin", "wrongpass");
        Assert.fail("Should have thrown exception");
    } catch (InvalidCredentialsException e) {
        // Expected exception
    }
}
```

#### 8. Assertions

```java
import org.testng.Assert;

public class TestAssertions {
    public void testExample() {
        // Assert equality
        Assert.assertEquals(2 + 2, 4);
        
        // Assert true/false
        Assert.assertTrue(5 > 3);
        Assert.assertFalse(5 < 3);
        
        // Assert not null
        Assert.assertNotNull(user);
        
        // Assert same object reference
        Assert.assertSame(obj1, obj2);
        
        // Fail test explicitly
        Assert.fail("Test failed for reason");
    }
}
```

#### 9. Collections

```java
import java.util.*;

public class CollectionExample {
    public void testLists() {
        // ArrayList - dynamic array
        List<String> users = new ArrayList<>();
        users.add("admin");
        users.add("user1");
        Assert.assertEquals(users.size(), 2);
        
        // HashMap - key-value pairs
        Map<String, String> credentials = new HashMap<>();
        credentials.put("admin", "admin123");
        Assert.assertEquals(credentials.get("admin"), "admin123");
    }
}
```

---

## Maven Fundamentals

### What is Maven?

Maven is a **build automation tool** and **dependency management tool** for Java projects.

### Why Maven?

1. **Dependency Management**: Automatically downloads libraries
2. **Build Automation**: Compile, test, package with one command
3. **Standard Structure**: Enforces project organization
4. **Lifecycle Management**: Define build phases
5. **Plugin System**: Extensible with plugins

### Maven Project Structure

```
my-project/
├── pom.xml                    # Project Object Model (configuration)
├── src/
│   ├── main/
│   │   ├── java/              # Source code
│   │   └── resources/         # Configuration files
│   └── test/
│       ├── java/              # Test code
│       └── resources/         # Test resources
└── target/                    # Build output (generated)
```

### pom.xml Explained

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    
    <!-- Project coordinates -->
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.echo</groupId>
    <artifactId>selenium-tests</artifactId>
    <version>1.0-SNAPSHOT</version>
    
    <!-- Properties -->
    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    
    <!-- Dependencies -->
    <dependencies>
        <!-- Selenium WebDriver -->
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>4.29.0</version>
        </dependency>
        
        <!-- TestNG -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>7.10.2</version>
        </dependency>
        
        <!-- WebDriverManager -->
        <dependency>
            <groupId>io.github.bonigarcia</groupId>
            <artifactId>webdrivermanager</artifactId>
            <version>5.9.2</version>
        </dependency>
    </dependencies>
    
    <!-- Build plugins -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
            </plugin>
            
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
                <configuration>
                    <suiteXmlFiles>
                        <suiteXmlFile>src/test/resources/testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Maven Lifecycle Phases

```
validate → compile → test → package → verify → install → deploy
```

1. **validate**: Validate project structure
2. **compile**: Compile source code
3. **test**: Run tests
4. **package**: Create JAR/WAR
5. **verify**: Run integration tests
6. **install**: Install to local repository
7. **deploy**: Deploy to remote repository

### Common Maven Commands

```bash
# Clean build artifacts
mvn clean

# Compile source code
mvn compile

# Run tests
mvn test

# Clean and run tests
mvn clean test

# Package project
mvn package

# Install to local repository
mvn install

# Skip tests
mvn install -DskipTests

# Run specific test class
mvn test -Dtest=LoginTest

# Run specific test method
mvn test -Dtest=LoginTest#testSuccessfulLogin
```

### Dependency Management

When you add a dependency to pom.xml, Maven:
1. Downloads it from Maven Central repository
2. Downloads its transitive dependencies automatically
3. Stores them in local repository (~/.m2/repository)
4. Makes them available during compilation and runtime

### Maven Repository

- **Maven Central**: Public repository of Java libraries
- **Local Repository**: Cache on your machine (~/.m2/repository)
- **Remote Repository**: Company-specific repositories

---

## TestNG Framework

### What is TestNG?

TestNG (Next Generation) is a testing framework inspired by JUnit but with more powerful features.

### Why TestNG?

1. **Annotations**: Easy test configuration
2. **Data-Driven Testing**: Run tests with multiple data sets
3. **Parallel Execution**: Run tests simultaneously
4. **Test Configuration**: XML-based test suites
5. **Reporting**: Built-in HTML and XML reports
6. **Dependencies**: Control test execution order
7. **Groups**: Organize tests by categories

### TestNG Annotations

```java
import org.testng.annotations.*;

public class TestNGExample {
    
    // Runs once before all tests in the class
    @BeforeClass
    public void beforeClass() {
        System.out.println("Before Class - Setup once");
    }
    
    // Runs before each test method
    @BeforeMethod
    public void beforeMethod() {
        System.out.println("Before Method - Setup for each test");
    }
    
    // This is a test method
    @Test
    public void testExample() {
        System.out.println("Running test");
        Assert.assertTrue(true);
    }
    
    // Runs after each test method
    @AfterMethod
    public void afterMethod() {
        System.out.println("After Method - Cleanup after each test");
    }
    
    // Runs once after all tests in the class
    @AfterClass
    public void afterClass() {
        System.out.println("After Class - Cleanup once");
    }
}
```

### Test Hierarchy

```
@BeforeSuite
  @BeforeTest
    @BeforeClass
      @BeforeMethod
        @Test
      @AfterMethod
    @AfterClass
  @AfterTest
@AfterSuite
```

### Data-Driven Testing with @DataProvider

```java
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.testng.Assert;

public class DataDrivenTest {
    
    // Data provider - supplies test data
    @DataProvider(name = "loginData")
    public Object[][] loginData() {
        return new Object[][] {
            {"admin", "admin123", true},    // Valid credentials
            {"admin", "wrongpass", false},   // Wrong password
            {"invalid", "admin123", false},  // Invalid username
            {"", "admin123", false},         // Empty username
            {"admin", "", false}            // Empty password
        };
    }
    
    // Test method uses data provider
    @Test(dataProvider = "loginData")
    public void testLogin(String username, String password, boolean shouldSucceed) {
        boolean result = login(username, password);
        
        if (shouldSucceed) {
            Assert.assertTrue(result, "Login should succeed for: " + username);
        } else {
            Assert.assertFalse(result, "Login should fail for: " + username);
        }
    }
    
    private boolean login(String username, String password) {
        // Simulated login logic
        return "admin".equals(username) && "admin123".equals(password);
    }
}
```

### Test Configuration with testng.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="SoundID Test Suite" parallel="methods" thread-count="3">
    
    <!-- Parameters -->
    <parameter name="browser" value="chrome"/>
    <parameter name="baseUrl" value="http://localhost:5000"/>
    
    <!-- Listeners for reporting -->
    <listeners>
        <listener class-name="org.testng.reporters.XMLReporter"/>
    </listeners>
    
    <!-- Test classes -->
    <test name="Authentication Tests">
        <classes>
            <class name="com.echo.tests.LoginTest"/>
            <class name="com.echo.tests.RegistrationTest"/>
        </classes>
    </test>
    
    <test name="Feature Tests">
        <classes>
            <class name="com.echo.tests.RecognizeTest"/>
            <class name="com.echo.tests.LibraryTest"/>
            <class name="com.echo.tests.HistoryTest"/>
        </classes>
    </test>
    
    <test name="End-to-End Tests">
        <classes>
            <class name="com.echo.tests.EndToEndTest"/>
        </classes>
    </test>
    
</suite>
```

### Test Groups

```java
public class GroupedTests {
    
    @Test(groups = {"smoke", "regression"})
    public void testLogin() {
        // Belongs to both smoke and regression groups
    }
    
    @Test(groups = {"regression"})
    public void testRegistration() {
        // Belongs to regression group only
    }
    
    @Test(groups = {"smoke"})
    public void testDashboard() {
        // Belongs to smoke group only
    }
}
```

Run specific groups:
```xml
<suite name="Test Suite">
    <test name="Smoke Tests">
        <groups>
            <run>
                <include name="smoke"/>
            </run>
        </groups>
        <classes>
            <class name="com.echo.tests.GroupedTests"/>
        </classes>
    </test>
</suite>
```

### Test Dependencies

```java
public class DependentTests {
    
    @Test
    public void testRegister() {
        // Register a user
    }
    
    @Test(dependsOnMethods = {"testRegister"})
    public void testLogin() {
        // Login with registered user
        // Only runs if testRegister passes
    }
    
    @Test(dependsOnMethods = {"testLogin"})
    public void testDashboard() {
        // Access dashboard after login
        // Only runs if testLogin passes
    }
}
```

### TestNG Reports

TestNG generates:
1. **HTML Report**: `test-output/index.html` - Visual test results
2. **XML Report**: `test-output/testng-results.xml` - Machine-readable results
3. **Emailable Report**: `test-output/emailable-report.html` - Email-friendly report

---

## Selenium WebDriver

### What is Selenium WebDriver?

Selenium WebDriver is a browser automation tool that allows you to:
- Control web browsers programmatically
- Simulate user interactions (click, type, navigate)
- Test web applications across different browsers
- Run tests in headless mode (no UI)

### Selenium Architecture

```
Your Test Code
     ↓
Selenium WebDriver (Java bindings)
     ↓
WebDriver (Browser-specific driver)
     ↓
Browser (Chrome, Firefox, etc.)
```

### WebDriverManager

WebDriverManager automatically manages browser drivers:

```java
import io.github.bonigarcia.wdm.WebDriverManager;

// Automatically downloads and sets up ChromeDriver
WebDriverManager.chromedriver().setup();
WebDriver driver = new ChromeDriver();
```

### Basic WebDriver Operations

```java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class WebDriverExample {
    public static void main(String[] args) {
        // Setup driver
        WebDriverManager.chromedriver().setup();
        WebDriver driver = new ChromeDriver();
        
        // Navigate to URL
        driver.get("http://localhost:5000/login");
        
        // Find element by ID
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.sendKeys("admin");
        
        // Find element by name
        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("admin123");
        
        // Find element by CSS selector
        WebElement submitButton = driver.findElement(By.cssSelector("#login-submit"));
        submitButton.click();
        
        // Wait for page load
        Thread.sleep(2000);
        
        // Get current URL
        String currentUrl = driver.getCurrentUrl();
        System.out.println("Current URL: " + currentUrl);
        
        // Get page title
        String title = driver.getTitle();
        System.out.println("Page Title: " + title);
        
        // Close browser
        driver.quit();
    }
}
```

### Locators

Selenium provides multiple ways to find elements:

```java
// By ID (most reliable)
WebElement element = driver.findElement(By.id("username"));

// By Name
WebElement element = driver.findElement(By.name("password"));

// By Class Name
WebElement element = driver.findElement(By.className("btn-primary"));

// By Tag Name
WebElement element = driver.findElement(By.tagName("button"));

// By Link Text
WebElement element = driver.findElement(By.linkText("Register"));

// By Partial Link Text
WebElement element = driver.findElement(By.partialLinkText("Reg"));

// By CSS Selector (powerful)
WebElement element = driver.findElement(By.cssSelector("#username"));
WebElement element = driver.findElement(By.cssSelector(".btn-primary"));
WebElement element = driver.findElement(By.cssSelector("input[type='text']"));

// By XPath (most flexible)
WebElement element = driver.findElement(By.xpath("//input[@id='username']"));
WebElement element = driver.findElement(By.xpath("//button[contains(text(),'Login')]"));
```

### Waits

#### Implicit Wait

```java
// Global wait for all elements
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
```

#### Explicit Wait

```java
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

// Wait for specific condition
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement element = wait.until(
    ExpectedConditions.visibilityOfElementLocated(By.id("username"))
);
```

#### Fluent Wait

```java
// Custom wait with polling interval
Wait<WebDriver> wait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(30))
    .pollingEvery(Duration.ofMillis(500))
    .ignoring(NoSuchElementException.class);

WebElement element = wait.until(d -> d.findElement(By.id("username")));
```

### Common ExpectedConditions

```java
// Element is visible
wait.until(ExpectedConditions.visibilityOf(element));

// Element is clickable
wait.until(ExpectedConditions.elementToBeClickable(element));

// Element contains text
wait.until(ExpectedConditions.textToBePresentInElement(element, "Welcome"));

// URL contains string
wait.until(ExpectedConditions.urlContains("/dashboard"));

// Title contains string
wait.until(ExpectedConditions.titleContains("Dashboard"));

// Element is selected (for checkboxes/radio)
wait.until(ExpectedConditions.elementToBeSelected(element));

// Alert is present
wait.until(ExpectedConditions.alertIsPresent());
```

### Browser Interactions

```java
// Navigate
driver.get("http://example.com");
driver.navigate().back();
driver.navigate().forward();
driver.navigate().refresh();

// Windows/Tabs
driver.getWindowHandle();  // Current window
driver.getWindowHandles(); // All windows
driver.switchTo().window(windowHandle);

// Frames
driver.switchTo().frame("frameName");
driver.switchTo().frame(0); // By index
driver.switchTo().defaultContent(); // Exit frame

// Alerts
Alert alert = driver.switchTo().alert();
alert.accept(); // Click OK
alert.dismiss(); // Click Cancel
alert.sendKeys("text"); // Enter text in prompt

// JavaScript execution
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
js.executeScript("arguments[0].click()", element);

// Cookies
driver.manage().getCookies();
driver.manage().addCookie(cookie);
driver.manage().deleteCookieNamed("session");
driver.manage().deleteAllCookies();

// Screenshots
File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
Files.copy(screenshot, new File("screenshot.png"));
```

### Headless Mode

```java
ChromeOptions options = new ChromeOptions();
options.addArguments("--headless=new");
WebDriver driver = new ChromeDriver(options);
```

---

## Page Object Model

### What is Page Object Model (POM)?

POM is a design pattern that:
- Creates a separate class for each page
- Encapsulates page elements and actions
- Makes tests maintainable and reusable
- Reduces code duplication

### Without POM (Bad Practice)

```java
public class BadTest {
    @Test
    public void testLogin() {
        driver.get("http://localhost:5000/login");
        driver.findElement(By.id("username")).sendKeys("admin");
        driver.findElement(By.id("password")).sendKeys("admin123");
        driver.findElement(By.id("login-submit")).click();
        
        // If element ID changes, you must update ALL tests
    }
}
```

### With POM (Good Practice)

```java
// LoginPage.java
public class LoginPage {
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Locators
    private By usernameInput = By.id("username");
    private By passwordInput = By.id("password");
    private By submitButton = By.id("login-submit");
    
    public LoginPage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }
    
    public void enterUsername(String username) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(usernameInput));
        el.clear();
        el.sendKeys(username);
    }
    
    public void enterPassword(String password) {
        WebElement el = driver.findElement(passwordInput);
        el.clear();
        el.sendKeys(password);
    }
    
    public void clickLogin() {
        driver.findElement(submitButton).click();
    }
    
    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }
}

// Test uses Page Object
public class GoodTest {
    @Test
    public void testLogin() {
        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.login("admin", "admin123");
        
        // If element ID changes, only update LoginPage.java
    }
}
```

### POM Benefits

1. **Maintainability**: Change locators in one place
2. **Reusability**: Use page objects across multiple tests
3. **Readability**: Tests read like user actions
4. **Separation of Concerns**: Page logic separate from test logic

### SoundID Page Objects

```
pages/
├── BaseTest.java          # Common test setup
├── LoginPage.java         # Login page actions
├── RegisterPage.java      # Registration page actions
├── RecognizePage.java     # Recognition page actions
├── LibraryPage.java       # Library page actions
└── HistoryPage.java       # History page actions
```

---

## Data-Driven Testing

### What is Data-Driven Testing?

Running the same test with multiple sets of data to:
- Test various scenarios
- Increase test coverage
- Reduce code duplication
- Make tests more maintainable

### TestNG Data Provider

```java
@DataProvider(name = "invalidCredentials")
public Object[][] invalidCredentials() {
    return new Object[][] {
        {"admin", "wrongpass", "Wrong password"},
        {"invalid", "admin123", "Invalid username"},
        {"", "admin123", "Empty username"},
        {"admin", "", "Empty password"}
    };
}

@Test(dataProvider = "invalidCredentials")
public void testInvalidLogin(String username, String password, String description) {
    loginPage.login(username, password);
    Assert.assertTrue(loginPage.isErrorDisplayed(), 
        "Error should show for: " + description);
}
```

### External Data Sources

#### Excel Data

```java
@DataProvider(name = "excelData")
public Object[][] excelData() throws IOException {
    FileInputStream file = new FileInputStream("test-data.xlsx");
    Workbook workbook = new XSSFWorkbook(file);
    Sheet sheet = workbook.getSheet("LoginData");
    
    Object[][] data = new Object[sheet.getPhysicalNumberOfRows()][3];
    
    for (int i = 0; i < sheet.getPhysicalNumberOfRows(); i++) {
        Row row = sheet.getRow(i);
        data[i][0] = row.getCell(0).getStringCellValue(); // Username
        data[i][1] = row.getCell(1).getStringCellValue(); // Password
        data[i][2] = row.getCell(2).getStringCellValue(); // Expected result
    }
    
    workbook.close();
    return data;
}
```

#### JSON Data

```java
@DataProvider(name = "jsonData")
public Object[][] jsonData() throws IOException {
    ObjectMapper mapper = new ObjectMapper();
    InputStream is = getClass().getClassLoader().getResourceAsStream("test-data.json");
    List<TestData> data = mapper.readValue(is, 
        new TypeReference<List<TestData>>(){});
    
    Object[][] result = new Object[data.size()][3];
    for (int i = 0; i < data.size(); i++) {
        result[i][0] = data.get(i).getUsername();
        result[i][1] = data.get(i).getPassword();
        result[i][2] = data.get(i).getExpectedResult();
    }
    return result;
}
```

---

## XSLT Reporting

### What is XSLT?

XSLT (Extensible Stylesheet Language Transformations) transforms XML documents into other formats like HTML.

### Why XSLT for Test Reports?

1. **TestNG generates XML**: Raw test results in XML format
2. **XSLT transforms to HTML**: Beautiful, readable reports
3. **Custom styling**: Control report appearance
4. **Offline viewing**: No internet needed
5. **Easy sharing**: Send HTML file to stakeholders

### TestNG XML Output

```xml
<testng-results>
    <suite name="SoundID Test Suite">
        <test name="Login Tests">
            <class name="com.echo.tests.LoginTest">
                <test-method name="testSuccessfulLogin" status="PASS">
                    <params>
                        <param index="0" value="admin"/>
                        <param index="1" value="admin123"/>
                    </params>
                </test-method>
                <test-method name="testInvalidLogin" status="FAIL">
                    <exception class="java.lang.AssertionError">
                        <message>Expected error message not displayed</message>
                    </exception>
                </test-method>
            </class>
        </test>
    </suite>
</testng-results>
```

### XSLT Stylesheet

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
            <head>
                <title>Test Report</title>
                <style>
                    .pass { color: green; }
                    .fail { color: red; }
                    table { border-collapse: collapse; }
                    td, th { border: 1px solid #ddd; padding: 8px; }
                </style>
            </head>
            <body>
                <h1>Test Execution Report</h1>
                <table>
                    <tr>
                        <th>Test Name</th>
                        <th>Status</th>
                        <th>Duration</th>
                    </tr>
                    <xsl:for-each select="//test-method">
                        <tr>
                            <td><xsl:value-of select="@name"/></td>
                            <td class="{@status}">
                                <xsl:value-of select="@status"/>
                            </td>
                            <td><xsl:value-of select="@duration-ms"/> ms</td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
```

### Apache Ant Build Script

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project name="TestNG Reports" default="generate-report">
    
    <target name="generate-report">
        <xslt 
            in="test-output/testng-results.xml"
            out="test-output/XSLT_Report.html"
            style="testng-results.xsl">
            <param name="testNgXslt.outputDir" expression="test-output/"/>
        </xslt>
    </target>
    
</project>
```

### Generating the Report

```bash
# Run tests first
mvn clean test

# Generate XSLT report
ant -f build.xml generate-report

# View report
# Open test-output/XSLT_Report.html in browser
```

---

## SoundID Test Suite Deep Dive

### Test Structure

```
selenium-tests/
├── src/test/java/com/echo/
│   ├── base/
│   │   └── BaseTest.java              # Common setup/teardown
│   ├── pages/
│   │   ├── LoginPage.java
│   │   ├── RegisterPage.java
│   │   ├── RecognizePage.java
│   │   ├── LibraryPage.java
│   │   └── HistoryPage.java
│   └── tests/
│       ├── LoginTest.java
│       ├── RegistrationTest.java
│       ├── RecognizeTest.java
│       ├── LibraryTest.java
│       ├── HistoryTest.java
│       └── EndToEndTest.java
├── src/test/resources/
│   └── testng.xml                     # Test configuration
├── pom.xml                            # Maven configuration
├── build.xml                          # Ant build for reports
└── testng-results.xsl                 # XSLT stylesheet
```

### BaseTest.java Explained

```java
public class BaseTest {
    protected WebDriver driver;
    protected WebDriverWait wait;
    
    // Configuration
    protected static final String BASE_URL = "http://localhost:5000";
    protected static final Duration TIMEOUT = Duration.ofSeconds(30);
    
    @BeforeMethod
    public void setUp() {
        // Setup WebDriver
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new"); // Run without UI
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        
        // Setup wait
        wait = new WebDriverWait(driver, TIMEOUT);
    }
    
    @AfterMethod
    public void tearDown() {
        // Cleanup
        if (driver != null) {
            driver.quit();
        }
    }
    
    // Helper methods
    protected void navigateTo(String path) {
        driver.get(BASE_URL + path);
    }
    
    protected String getCurrentPath() {
        return driver.getCurrentUrl().replace(BASE_URL, "");
    }
}
```

### LoginPage.java Explained

```java
public class LoginPage {
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Locators - CSS selectors
    private By usernameInput = By.id("username");
    private By passwordInput = By.id("password");
    private By submitButton = By.id("login-submit");
    private By errorMessage = By.cssSelector("#flash-message .flash-error");
    
    public LoginPage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }
    
    // Actions
    public void enterUsername(String username) {
        WebElement el = wait.until(
            ExpectedConditions.visibilityOfElementLocated(usernameInput)
        );
        el.clear();
        el.sendKeys(username);
    }
    
    public void enterPassword(String password) {
        WebElement el = driver.findElement(passwordInput);
        el.clear();
        el.sendKeys(password);
    }
    
    public void clickLogin() {
        driver.findElement(submitButton).click();
    }
    
    // Convenience method
    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }
    
    // Queries
    public boolean isErrorDisplayed() {
        try {
            return wait.until(
                ExpectedConditions.visibilityOfElementLocated(errorMessage)
            ).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
```

### LoginTest.java Explained

```java
public class LoginTest extends BaseTest {
    private LoginPage loginPage;
    private String registeredUsername;
    private static final String REGISTERED_PASSWORD = "LoginPass123";
    
    @BeforeMethod
    public void initPage() {
        // Register a user first
        registeredUsername = "testuser_" + System.currentTimeMillis();
        navigateTo("/register");
        RegisterPage registerPage = new RegisterPage(driver, wait);
        registerPage.enterUsername(registeredUsername);
        registerPage.enterPassword(REGISTERED_PASSWORD);
        registerPage.clickRegister();
        
        // Navigate to login
        navigateTo("/login");
        loginPage = new LoginPage(driver, wait);
    }
    
    @Test(description = "TC-L01: Login with valid credentials")
    public void testSuccessfulLogin() {
        loginPage.login(registeredUsername, REGISTERED_PASSWORD);
        waitForUrlContains("/dashboard");
        
        Assert.assertTrue(getCurrentPath().contains("/dashboard"),
            "Should redirect to dashboard after login");
    }
    
    @DataProvider(name = "invalidLoginData")
    public Object[][] invalidLoginData() {
        return new Object[][] {
            {registeredUsername, "WrongPass999", "Wrong password"},
            {"nonexistentuser", "Whatever123", "Non-existent user"},
            {registeredUsername, "", "Empty password"},
            {"", REGISTERED_PASSWORD, "Empty username"}
        };
    }
    
    @Test(dataProvider = "invalidLoginData")
    public void testInvalidLogins(String username, String password, String description) {
        loginPage.login(username, password);
        Assert.assertTrue(loginPage.isErrorDisplayed(),
            "Error should show for: " + description);
    }
}
```

### Test Execution Flow

```
1. Maven runs: mvn clean test
2. Maven compiles test classes
3. TestNG reads testng.xml
4. TestNG runs @BeforeSuite
5. TestNG runs @BeforeTest
6. For each test class:
   a. Run @BeforeClass
   b. For each test method:
      i. Run @BeforeMethod
      ii. Run @Test method
      iii. Run @AfterMethod
   c. Run @AfterClass
7. TestNG runs @AfterTest
8. TestNG runs @AfterSuite
9. TestNG generates XML report
```

### Parallel Execution

In testng.xml:
```xml
<suite name="SoundID Test Suite" parallel="methods" thread-count="3">
```

This runs 3 test methods simultaneously, reducing total execution time.

---

## Testing Best Practices

### 1. Write Independent Tests

```java
// Bad - Tests depend on each other
@Test
public void testRegister() {
    registerUser("user1");
}

@Test
public void testLogin() {
    // Assumes user1 exists from previous test
    login("user1", "pass");
}

// Good - Each test is independent
@Test
public void testLogin() {
    String username = "user_" + System.currentTimeMillis();
    registerUser(username);
    login(username, "pass");
}
```

### 2. Use Descriptive Test Names

```java
// Bad
@Test
public void test1() { }

// Good
@Test
public void testLoginWithValidCredentialsRedirectsToDashboard() { }
```

### 3. Follow AAA Pattern

```java
@Test
public void testLogin() {
    // Arrange - Setup test data
    String username = "admin";
    String password = "admin123";
    
    // Act - Execute the test
    loginPage.login(username, password);
    
    // Assert - Verify the result
    Assert.assertTrue(getCurrentPath().contains("/dashboard"));
}
```

### 4. Use Page Object Model

Encapsulate page logic in separate classes.

### 5. Handle Waits Properly

```java
// Bad - Hardcoded sleep
Thread.sleep(5000);

// Good - Explicit wait
wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));
```

### 6. Clean Up After Tests

```java
@AfterMethod
public void tearDown() {
    driver.quit();
    clearLocalStorage();
}
```

### 7. Use Data-Driven Testing

Test multiple scenarios with one test method.

### 8. Group Tests

```java
@Test(groups = {"smoke"})
public void testCriticalFeature() { }

@Test(groups = {"regression"})
public void testEdgeCase() { }
```

### 9. Keep Tests Fast

- Use headless mode in CI
- Minimize test data
- Run tests in parallel

### 10. Maintain Test Data

- Use unique data for each test
- Clean up database after tests
- Use test databases, not production

---

## Advanced Concepts

### 1. Test Design Patterns

#### Factory Pattern

```java
public class UserFactory {
    public static User createAdmin() {
        return new User("admin", "admin123", true);
    }
    
    public static User createRegularUser() {
        return new User("user", "pass123", false);
    }
}
```

#### Builder Pattern

```java
public class UserBuilder {
    private String username;
    private String password;
    private boolean isAdmin;
    
    public UserBuilder username(String username) {
        this.username = username;
        return this;
    }
    
    public UserBuilder password(String password) {
        this.password = password;
        return this;
    }
    
    public UserBuilder isAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
        return this;
    }
    
    public User build() {
        return new User(username, password, isAdmin);
    }
}

// Usage
User user = new UserBuilder()
    .username("admin")
    .password("admin123")
    .isAdmin(true)
    .build();
```

### 2. Test Hooks

```java
@BeforeSuite
public void beforeSuite() {
    // Setup database
    // Start services
}

@AfterSuite
public void afterSuite() {
    // Cleanup database
    // Stop services
}

@BeforeTest
public void beforeTest() {
    // Load test configuration
}

@AfterTest
public void afterTest() {
    // Generate reports
}
```

### 3. Soft Assertions

```java
import org.testng.asserts.SoftAssert;

public class SoftAssertionTest {
    @Test
    public void testMultipleAssertions() {
        SoftAssert softAssert = new SoftAssert();
        
        softAssert.assertEquals(1 + 1, 2);
        softAssert.assertEquals(2 + 2, 4);
        softAssert.assertEquals(3 + 3, 6);
        
        // All assertions checked at once
        softAssert.assertAll();
    }
}
```

### 4. Retry Failed Tests

```java
@RetryAnalyzer = MyRetryAnalyzer.class)
@Test
public void testFlakyFeature() {
    // Will retry if it fails
}

public class MyRetryAnalyzer implements IRetryAnalyzer {
    private int retryCount = 0;
    private static final int maxRetryCount = 3;
    
    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < maxRetryCount) {
            retryCount++;
            return true;
        }
        return false;
    }
}
```

### 5. Test Listeners

```java
public class TestListener implements ITestListener {
    @Override
    public void onTestStart(ITestResult result) {
        System.out.println("Test started: " + result.getName());
    }
    
    @Override
    public void onTestSuccess(ITestResult result) {
        System.out.println("Test passed: " + result.getName());
    }
    
    @Override
    public void onTestFailure(ITestResult result) {
        System.out.println("Test failed: " + result.getName());
        // Take screenshot
    }
}
```

### 6. Parallel Execution Strategies

```xml
<!-- Parallel methods -->
<suite parallel="methods" thread-count="5">

<!-- Parallel classes -->
<suite parallel="classes" thread-count="3">

<!-- Parallel tests -->
<suite parallel="tests" thread-count="2">
```

### 7. CI/CD Integration

```yaml
# GitHub Actions example
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK
        uses: actions/setup-java@v2
        with:
          java-version: '11'
      - name: Run tests
        run: mvn clean test
      - name: Generate report
        run: ant -f build.xml generate-report
      - name: Upload report
        uses: actions/upload-artifact@v2
        with:
          name: test-report
          path: test-output/XSLT_Report.html
```

---

## Summary

This tutorial covered:

1. **Software Testing Fundamentals**: Why we test, types of testing, testing pyramid
2. **Java Basics**: Classes, methods, annotations, assertions, collections
3. **Maven**: Build automation, dependency management, pom.xml
4. **TestNG**: Annotations, data-driven testing, configuration, reporting
5. **Selenium WebDriver**: Browser automation, locators, waits, interactions
6. **Page Object Model**: Design pattern for maintainable tests
7. **Data-Driven Testing**: Testing with multiple data sets
8. **XSLT Reporting**: Transforming XML to HTML reports
9. **SoundID Test Suite**: Real-world example implementation
10. **Best Practices**: Writing maintainable, reliable tests
11. **Advanced Concepts**: Design patterns, listeners, CI/CD

### Key Takeaways

- Tests are code that verify other code works correctly
- Maven manages dependencies and build process
- TestNG provides testing framework with powerful features
- Selenium automates browser interactions
- Page Object Model makes tests maintainable
- Data-driven testing increases coverage
- XSLT creates beautiful reports from XML
- Following best practices ensures reliable tests

### Next Steps

1. Practice writing tests for your own applications
2. Explore advanced Selenium features (actions, mobile testing)
3. Learn about API testing (RestAssured)
4. Study performance testing (JMeter)
5. Explore visual testing (Applitools)
6. Learn about test-driven development (TDD)
