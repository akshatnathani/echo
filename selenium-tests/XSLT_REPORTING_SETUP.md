# XSLT Reporting Setup for TestNG

This guide explains how to set up and generate beautiful XSLT reports for your TestNG Selenium tests using Apache Ant.

## Prerequisites

1. **Apache Ant** - Download and install Apache Ant
2. **TestNG** - Already configured in your Maven project
3. **Test execution** - Run your TestNG tests first to generate `testng-results.xml`

## Step 1: Install Apache Ant

### Download Apache Ant

1. Go to [Apache Ant website](https://ant.apache.org/)
2. Download the latest Binary Distribution zip file
3. Extract the zip file to your C drive (e.g., `C:\apache-ant-1.10.14`)

### Configure Environment Variables

1. Open System Environment Variables:
   - Press `Win + R`, type `sysdm.cpl`, and press Enter
   - Click on the "Advanced" tab
   - Click "Environment Variables"

2. Add a new System Variable:
   - **Variable name**: `ANT_HOME`
   - **Variable value**: Path to your Ant installation (e.g., `C:\apache-ant-1.10.14`)

3. Update the PATH variable:
   - Find the `Path` variable under "System variables"
   - Click "Edit"
   - Add a new entry: `%ANT_HOME%\bin`

4. Verify installation:
   - Open Command Prompt (cmd)
   - Type: `ant -version`
   - You should see output like: `Apache Ant(TM) version 1.10.14 compiled on ...`

## Step 2: Run TestNG Tests

Before generating XSLT reports, you need to run your TestNG tests to generate the `testng-results.xml` file.

### Using Maven

```bash
cd selenium-tests
mvn clean test
```

This will generate:
- `test-output/testng-results.xml` - The XML file needed for XSLT transformation
- `test-output/testng-failed.xml` - Failed test cases
- `test-output/emailable-report.html` - Default TestNG HTML report

## Step 3: Generate XSLT Report

The project includes:
- `build.xml` - Ant build file for XSLT transformation
- `testng-results.xsl` - XSLT stylesheet for beautiful HTML report

### Using Apache Ant

Navigate to the selenium-tests directory and run:

```bash
cd selenium-tests
ant -f build.xml generate-report
```

Or specify the full path:

```bash
ant -f "C:\Users\aksha\Projects\Personal\echo\selenium-tests\build.xml" generate-report
```

This will:
- Read `test-output/testng-results.xml`
- Apply the `testng-results.xsl` stylesheet
- Generate `test-output/XSLT_Report.html`

## Step 4: View the Report

Open the generated HTML file in your browser:

```
test-output/XSLT_Report.html
```

## Report Features

The XSLT report includes:

- **Summary Cards**: Visual cards showing total, passed, failed, and skipped tests
- **Pass Rate**: Calculated percentage of passed tests
- **Test Classes Table**: Breakdown by test class with pass/fail counts
- **Test Methods Details**: Detailed list of all test methods with:
  - Status (passed/failed/skipped)
  - Duration in milliseconds
  - Exception messages (if any)
- **Timestamp**: Report generation time
- **Beautiful Styling**: Modern, responsive design with color-coded status

## Customizing the Report

### Modifying testng-results.xsl

The `testng-results.xsl` file controls the report's appearance and content. You can customize:

- **Colors**: Change CSS colors in the `<style>` section
- **Layout**: Modify HTML structure in the XSLT templates
- **Additional Information**: Add more data from the TestNG XML

### Modifying build.xml

The `build.xml` file controls the transformation process. You can:

- Change input/output file paths
- Add multiple transformation steps
- Include additional XSLT stylesheets

## Troubleshooting

### Ant command not found

- Verify `ANT_HOME` is set correctly
- Verify `%ANT_HOME%\bin` is in your PATH
- Restart Command Prompt after setting environment variables

### testng-results.xml not found

- Ensure you've run the TestNG tests first using `mvn clean test`
- Check that the file exists in `test-output/` directory
- Verify the path in `build.xml` matches your actual file location

### XSLT transformation errors

- Check that `testng-results.xsl` exists in the selenium-tests directory
- Verify the XML structure of `testng-results.xml` is valid
- Check the Ant console output for specific error messages

## Automation

### Integrate with Maven

You can automate XSLT report generation by adding the AntRun plugin to your `pom.xml`:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-antrun-plugin</artifactId>
    <version>3.1.0</version>
    <executions>
        <execution>
            <phase>test</phase>
            <configuration>
                <target>
                    <xslt 
                        in="test-output/testng-results.xml"
                        style="testng-results.xsl"
                        out="test-output/XSLT_Report.html"/>
                </target>
            </configuration>
            <goals>
                <goal>run</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Now the XSLT report will be generated automatically after every test run.

## Continuous Integration

### Jenkins

Add a post-build step to generate the XSLT report:

```groovy
bat 'ant -f build.xml generate-report'
publishHTML([
    reportDir: 'test-output',
    reportFiles: 'XSLT_Report.html',
    reportName: 'TestNG XSLT Report',
    keepAll: true,
    alwaysLinkToLastBuild: true
])
```

### GitHub Actions

```yaml
- name: Install Ant
  run: choco install ant

- name: Run Tests
  run: mvn clean test

- name: Generate XSLT Report
  run: ant -f build.xml generate-report

- name: Upload Report
  uses: actions/upload-artifact@v2
  with:
    name: testng-xslt-report
    path: test-output/XSLT_Report.html
```

## Summary

1. Install Apache Ant and configure environment variables
2. Run TestNG tests: `mvn clean test`
3. Generate XSLT report: `ant -f build.xml generate-report`
4. Open `test-output/XSLT_Report.html` in your browser

The XSLT report provides a beautiful, comprehensive view of your test results with visual summaries and detailed test method information.
