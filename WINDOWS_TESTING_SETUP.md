# Complete Windows Testing Setup Guide for SoundID

This guide provides step-by-step instructions for setting up the complete testing environment on Windows for the SoundID application.

## Table of Contents

1. [Prerequisites Overview](#prerequisites-overview)
2. [Java Installation](#java-installation)
3. [Maven Installation](#maven-installation)
4. [Apache Ant Installation](#apache-ant-installation)
5. [Python Installation](#python-installation)
6. [Node.js Installation](#nodejs-installation)
7. [Google Chrome Installation](#google-chrome-installation)
8. [Backend Setup](#backend-setup)
9. [Frontend Setup](#frontend-setup)
10. [Running Selenium Tests](#running-selenium-tests)
11. [Generating XSLT Reports](#generating-xslt-reports)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites Overview

Before starting, ensure you have:
- Windows 10 or Windows 11
- Administrator privileges (for some installations)
- Internet connection
- At least 4GB RAM (8GB recommended)

You will install:
- **Java JDK 11+** - For running Maven and Selenium tests
- **Apache Maven 3.8+** - For building and running Selenium tests
- **Apache Ant 1.10+** - For XSLT report generation
- **Python 3.8+** - For running the Flask backend
- **Node.js 18+** - For running the React frontend
- **Google Chrome** - For Selenium WebDriver tests

---

## Java Installation

### Step 1: Download Java JDK

1. Go to https://adoptium.net/
2. Select "LTS Version" (Java 17 or 21 recommended)
3. Choose Windows x64 Installer
4. Download and run the installer

### Step 2: Install Java

1. Run the downloaded `.exe` file
2. Follow the installation wizard
3. Note the installation path (typically: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot\`)

### Step 3: Set JAVA_HOME Environment Variable

1. Press `Windows Key` and search for "Environment Variables"
2. Click "Edit the system environment variables"
3. Click "Environment Variables"
4. Under "System variables", click "New"
5. Variable name: `JAVA_HOME`
6. Variable value: Your Java installation path (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.0.9-hotspot\`)
7. Click OK

### Step 4: Add Java to PATH

1. Under "System variables", find "Path" and click "Edit"
2. Click "New"
3. Add: `%JAVA_HOME%\bin`
4. Click OK on all dialogs

### Step 5: Verify Installation

Open PowerShell and run:
```powershell
java -version
javac -version
```

You should see Java version output.

---

## Maven Installation

### Step 1: Download Apache Maven

1. Go to https://maven.apache.org/download.cgi
2. Download `apache-maven-3.9.x-bin.zip`
3. Extract to: `C:\apache-maven-3.9.x`

### Step 2: Set MAVEN_HOME Environment Variable

1. Press `Windows Key` and search for "Environment Variables"
2. Click "Edit the system environment variables"
3. Click "Environment Variables"
4. Under "System variables", click "New"
5. Variable name: `MAVEN_HOME`
6. Variable value: `C:\apache-maven-3.9.x`
7. Click OK

### Step 3: Add Maven to PATH

1. Under "System variables", find "Path" and click "Edit"
2. Click "New"
3. Add: `%MAVEN_HOME%\bin`
4. Click OK on all dialogs

### Step 4: Verify Installation

Open PowerShell and run:
```powershell
mvn -version
```

You should see Maven version output.

---

## Apache Ant Installation

### Step 1: Download Apache Ant

1. Go to https://ant.apache.org/
2. Click "Download" in the left menu
3. Download `apache-ant-1.10.14-bin.zip`
4. Extract to: `C:\apache-ant-1.10.14`

### Step 2: Set ANT_HOME Environment Variable

1. Press `Windows Key` and search for "Environment Variables"
2. Click "Edit the system environment variables"
3. Click "Environment Variables"
4. Under "System variables", click "New"
5. Variable name: `ANT_HOME`
6. Variable value: `C:\apache-ant-1.10.14`
7. Click OK

### Step 3: Add Ant to PATH

1. Under "System variables", find "Path" and click "Edit"
2. Click "New"
3. Add: `%ANT_HOME%\bin`
4. Click OK on all dialogs

### Step 4: Verify Installation

Open PowerShell and run:
```powershell
ant -version
```

You should see Apache Ant version output.

---

## Python Installation

### Step 1: Download Python

1. Go to https://www.python.org/downloads/
2. Download Python 3.11 or 3.12
3. **IMPORTANT**: Check "Add Python to PATH" during installation

### Step 2: Install Python

1. Run the downloaded `.exe` file
2. **Check "Add Python to PATH"** (critical!)
3. Click "Install Now"
4. Wait for installation to complete

### Step 3: Verify Installation

Open PowerShell and run:
```powershell
python --version
pip --version
```

You should see Python and pip version output.

### Step 4: Install Python Dependencies

```powershell
cd C:\Users\aksha\Projects\Personal\echo\echo
pip install -r requirements.txt
```

---

## Node.js Installation

### Step 1: Download Node.js

1. Go to https://nodejs.org/
2. Download the LTS version (recommended for stability)
3. Run the `.msi` installer

### Step 2: Install Node.js

1. Run the downloaded `.msi` file
2. Follow the installation wizard
3. Accept all defaults

### Step 3: Verify Installation

Open PowerShell and run:
```powershell
node --version
npm --version
```

You should see Node.js and npm version output.

### Step 4: Install Node.js Dependencies

```powershell
cd C:\Users\aksha\Projects\Personal\echo\client
npm install
```

---

## Google Chrome Installation

### Step 1: Download Chrome

1. Go to https://www.google.com/chrome/
2. Click "Download Chrome"
3. Run the installer

### Step 2: Verify Chrome Installation

1. Open Google Chrome
2. Click the three dots (menu) → Help → About Google Chrome
3. Note the version number

### Step 3: ChromeDriver

**Good news**: Selenium WebDriverManager automatically downloads the correct ChromeDriver version for your Chrome browser. You don't need to manually install it.

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```powershell
cd C:\Users\aksha\Projects\Personal\echo\echo
```

### Step 2: Create Virtual Environment (Recommended)

```powershell
python -m venv venv
```

### Step 3: Activate Virtual Environment

```powershell
.\venv\Scripts\Activate.ps1
```

*If you get a script execution error, run:*
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 4: Install Python Dependencies

```powershell
pip install -r requirements.txt
```

### Step 5: Start the Backend

```powershell
python app.py
```

The backend will start on `http://localhost:5000`

**Keep this terminal open** while running tests.

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new** PowerShell terminal and run:

```powershell
cd C:\Users\aksha\Projects\Personal\echo\client
```

### Step 2: Install Dependencies (if not already done)

```powershell
npm install
```

### Step 3: Start the Frontend

```powershell
npm run dev
```

The frontend will start on `http://localhost:5173`

**Keep this terminal open** while running tests.

---

## Running Selenium Tests

### Step 1: Navigate to Selenium Tests Directory

Open a **new** PowerShell terminal and run:

```powershell
cd C:\Users\aksha\Projects\Personal\echo\selenium-tests
```

### Step 2: Verify Test Configuration

Check `src/test/resources/testng.xml` to see test configuration.

### Step 3: Run All Tests

```powershell
mvn clean test
```

This will:
1. Compile the test classes
2. Run all Selenium tests
3. Generate test results in `test-output/`

### Step 4: Run Specific Test Class

```powershell
mvn test -Dtest=LoginTest
```

### Step 5: Run Specific Test Method

```powershell
mvn test -Dtest=LoginTest#testSuccessfulLogin
```

### Expected Output

- Tests will open Chrome browser automatically
- Browser will perform actions (navigate, click, type)
- Tests will pass or fail
- Results will be shown in the console

---

## Generating XSLT Reports

### Step 1: Ensure Tests Have Run

Make sure you've run tests at least once to generate `test-output/testng-results.xml`

### Step 2: Generate XSLT Report

```powershell
cd C:\Users\aksha\Projects\Personal\echo\selenium-tests
ant -f build.xml generate-report
```

This will:
1. Transform `test-output/testng-results.xml` using `testng-results.xsl`
2. Generate `test-output/XSLT_Report.html`

### Step 3: View the Report

1. Navigate to: `C:\Users\aksha\Projects\Personal\echo\selenium-tests\test-output\`
2. Open `XSLT_Report.html` in your browser

The report will show:
- Test summary (pass/fail counts)
- Detailed test results
- Execution time
- Error messages (if any)

---

## Complete Testing Workflow

Here's the complete workflow for running tests:

### Terminal 1: Backend
```powershell
cd C:\Users\aksha\Projects\Personal\echo\echo
.\venv\Scripts\Activate.ps1
python app.py
```
*Keep this terminal open*

### Terminal 2: Frontend
```powershell
cd C:\Users\aksha\Projects\Personal\echo\client
npm run dev
```
*Keep this terminal open*

### Terminal 3: Tests
```powershell
cd C:\Users\aksha\Projects\Personal\echo\selenium-tests
mvn clean test
```

### Terminal 4: Reports (optional)
```powershell
cd C:\Users\aksha\Projects\Personal\echo\selenium-tests
ant -f build.xml generate-report
```

---

## Troubleshooting

### Issue: "java is not recognized"

**Solution:**
1. Verify JAVA_HOME is set correctly
2. Verify `%JAVA_HOME%\bin` is in PATH
3. Restart PowerShell after setting environment variables
4. Run: `refreshenv` (if using PowerShell 7+) or restart terminal

### Issue: "mvn is not recognized"

**Solution:**
1. Verify MAVEN_HOME is set correctly
2. Verify `%MAVEN_HOME%\bin` is in PATH
3. Restart PowerShell after setting environment variables

### Issue: "ant is not recognized"

**Solution:**
1. Verify ANT_HOME is set correctly
2. Verify `%ANT_HOME%\bin` is in PATH
3. Restart PowerShell after setting environment variables

### Issue: "python is not recognized"

**Solution:**
1. Reinstall Python with "Add to PATH" checked
2. Or manually add Python to PATH:
   - Variable: `Path`
   - Add: `C:\Users\YourUsername\AppData\Local\Programs\Python\Python311\`
   - Add: `C:\Users\YourUsername\AppData\Local\Programs\Python\Python311\Scripts\`

### Issue: "npm is not recognized"

**Solution:**
1. Restart PowerShell after Node.js installation
2. Or manually add Node.js to PATH:
   - Variable: `Path`
   - Add: `C:\Program Files\nodejs\`

### Issue: "ChromeDriver not found"

**Solution:**
- Selenium WebDriverManager should handle this automatically
- If it fails, manually download ChromeDriver from https://chromedriver.chromium.org/
- Add ChromeDriver to PATH

### Issue: Tests fail with "Connection refused"

**Solution:**
1. Ensure backend is running on port 5000
2. Ensure frontend is running on port 5173
3. Check if ports are already in use:
   ```powershell
   netstat -ano | findstr :5000
   netstat -ano | findstr :5173
   ```
4. Kill processes if needed:
   ```powershell
   taskkill /PID <PID> /F
   ```

### Issue: "Module not found" in Python

**Solution:**
```powershell
pip install -r requirements.txt
```

### Issue: "Module not found" in Node.js

**Solution:**
```powershell
npm install
```

### Issue: XSLT report not generating

**Solution:**
1. Ensure Apache Ant is installed and in PATH
2. Ensure `test-output/testng-results.xml` exists
3. Check `build.xml` for correct paths
4. Run: `ant -f build.xml -v` for verbose output

### Issue: Tests run too slowly

**Solution:**
1. Reduce STEP_DELAY in BaseTest.java
2. Run tests in headless mode (uncomment headless option in BaseTest.java)
3. Run tests in parallel (configure in testng.xml)

### Issue: "Cannot activate virtual environment"

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

---

## Quick Reference Commands

### Environment Checks
```powershell
java -version        # Check Java
mvn -version         # Check Maven
ant -version         # Check Ant
python --version     # Check Python
pip --version        # Check pip
node --version       # Check Node.js
npm --version        # Check npm
```

### Starting Services
```powershell
# Backend
cd C:\Users\aksha\Projects\Personal\echo\echo
.\venv\Scripts\Activate.ps1
python app.py

# Frontend
cd C:\Users\aksha\Projects\Personal\echo\client
npm run dev
```

### Running Tests
```powershell
cd C:\Users\aksha\Projects\Personal\echo\selenium-tests
mvn clean test                              # Run all tests
mvn test -Dtest=LoginTest                   # Run specific class
mvn test -Dtest=LoginTest#testSuccessfulLogin  # Run specific method
```

### Generating Reports
```powershell
cd C:\Users\aksha\Projects\Personal\echo\selenium-tests
ant -f build.xml generate-report
```

---

## Summary

After completing this guide, you will have:
- ✅ Java JDK installed and configured
- ✅ Apache Maven installed and configured
- ✅ Apache Ant installed and configured
- ✅ Python installed with virtual environment
- ✅ Node.js installed with dependencies
- ✅ Google Chrome installed
- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ Selenium tests running successfully
- ✅ XSLT reports generating correctly

You can now run end-to-end tests for the SoundID application on Windows!

---

## Additional Resources

- [Java Documentation](https://docs.oracle.com/en/java/)
- [Maven Documentation](https://maven.apache.org/guides/)
- [Ant Documentation](https://ant.apache.org/manual/)
- [Python Documentation](https://docs.python.org/3/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Selenium Documentation](https://www.selenium.dev/documentation/)
- [TestNG Documentation](https://testng.org/doc/)
