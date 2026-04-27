<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head>
    <title>TestNG XSLT Report - SoundID</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #4CAF50; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color: #f1f1f1; }
        .passed { color: green; font-weight: bold; }
        .failed { color: red; font-weight: bold; }
        .skipped { color: orange; font-weight: bold; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .summary-card { flex: 1; padding: 20px; border-radius: 8px; text-align: center; }
        .total { background-color: #2196F3; color: white; }
        .passed-card { background-color: #4CAF50; color: white; }
        .failed-card { background-color: #f44336; color: white; }
        .skipped-card { background-color: #FF9800; color: white; }
        .summary-card h3 { margin: 0; font-size: 36px; }
        .summary-card p { margin: 5px 0 0 0; font-size: 14px; }
        .timestamp { color: #666; font-size: 12px; margin-bottom: 20px; }
        .test-method { margin: 10px 0; padding: 10px; border-left: 4px solid #ddd; }
        .test-method.passed { border-left-color: #4CAF50; }
        .test-method.failed { border-left-color: #f44336; }
        .test-method.skipped { border-left-color: #FF9800; }
        .duration { color: #666; font-size: 12px; }
    </style>
</head>

<body>
    <div class="container">
        <h1>TestNG XSLT Report - SoundID Audio Recognition</h1>
        
        <xsl:variable name="total" select="count(//test-method)"/>
        <xsl:variable name="passed" select="count(//test-method[@status='PASS'])"/>
        <xsl:variable name="failed" select="count(//test-method[@status='FAIL'])"/>
        <xsl:variable name="skipped" select="count(//test-method[@status='SKIP'])"/>

        <div class="summary">
            <div class="summary-card total">
                <h3><xsl:value-of select="$total"/></h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-card passed-card">
                <h3><xsl:value-of select="$passed"/></h3>
                <p>Passed</p>
            </div>
            <div class="summary-card failed-card">
                <h3><xsl:value-of select="$failed"/></h3>
                <p>Failed</p>
            </div>
            <div class="summary-card skipped-card">
                <h3><xsl:value-of select="$skipped"/></h3>
                <p>Skipped</p>
            </div>
        </div>

        <h2>Test Summary</h2>
        <table>
            <tr>
                <th>Total</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Skipped</th>
                <th>Pass Rate</th>
            </tr>
            <tr>
                <td><xsl:value-of select="$total"/></td>
                <td class="passed"><xsl:value-of select="$passed"/></td>
                <td class="failed"><xsl:value-of select="$failed"/></td>
                <td class="skipped"><xsl:value-of select="$skipped"/></td>
                <td>
                    <xsl:if test="$total > 0">
                        <xsl:value-of select="format-number($passed div $total * 100, '0.00')"/>%
                    </xsl:if>
                    <xsl:if test="$total = 0">0%</xsl:if>
                </td>
            </tr>
        </table>

        <h2>Test Classes</h2>
        <table>
            <tr>
                <th>Class Name</th>
                <th>Methods</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Skipped</th>
            </tr>
            <xsl:for-each select="//class">
                <xsl:variable name="class-name" select="@name"/>
                <xsl:variable name="class-methods" select="count(//test-method[class/@name=$class-name])"/>
                <xsl:variable name="class-passed" select="count(//test-method[class/@name=$class-name and @status='PASS'])"/>
                <xsl:variable name="class-failed" select="count(//test-method[class/@name=$class-name and @status='FAIL'])"/>
                <xsl:variable name="class-skipped" select="count(//test-method[class/@name=$class-name and @status='SKIP'])"/>
                <tr>
                    <td><xsl:value-of select="$class-name"/></td>
                    <td><xsl:value-of select="$class-methods"/></td>
                    <td class="passed"><xsl:value-of select="$class-passed"/></td>
                    <td class="failed"><xsl:value-of select="$class-failed"/></td>
                    <td class="skipped"><xsl:value-of select="$class-skipped"/></td>
                </tr>
            </xsl:for-each>
        </table>

        <h2>Test Methods Details</h2>
        <xsl:for-each select="//test-method">
            <div class="test-method {@status}">
                <strong>
                    <xsl:value-of select="@name"/>
                </strong>
                <span class="duration"> - Duration: <xsl:value-of select="@duration-ms"/>ms</span><br/>
                Status: 
                <span class="{@status}">
                    <xsl:value-of select="@status"/>
                </span>
                <xsl:if test="exception">
                    <br/>
                    <small style="color: #666;">
                        Exception: <xsl:value-of select="exception/message"/>
                    </small>
                </xsl:if>
            </div>
        </xsl:for-each>

        <div class="timestamp">
            Report generated on: <xsl:value-of select="current-dateTime()"/>
        </div>
    </div>
</body>
</html>
</xsl:template>

</xsl:stylesheet>
