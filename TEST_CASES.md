# Echo App — Test Cases

This document describes the test cases for the Echo musical fingerprinter application, covering both the React frontend and Flask backend modules.

## Module 1: Registration (`/register`)

### TC-R01: Successful Registration
- **Precondition:** User not logged in, navigated to `/register`
- **Steps:**
  1. Enter a unique username (e.g., "testuser123")
  2. Enter a valid password (at least 6 characters)
  3. Click "Sign Up"
- **Expected:** Success message displayed ("Registration successful. Please login.") and redirected to `/login`.

### TC-R02: Registration — Duplicate Username
- **Steps:** Attempt to register with a username that already exists in the database.
- **Expected:** Error message: "Username already exists".

### TC-R03: Registration — Username Too Short
- **Steps:** Enter a username with fewer than 3 characters, click submit.
- **Expected:** Error message: "Username must be at least 3 characters long".

### TC-R04: Registration — Password Too Short
- **Steps:** Enter a valid username, but a password with fewer than 6 characters, click submit.
- **Expected:** Error message: "Password must be at least 6 characters long".

### TC-R05: Registration — Empty Fields
- **Steps:** Click "Sign Up" without filling in username or password.
- **Expected:** Error message: "Username is required" or "Password is required".

### TC-R06: Navigate to Login
- **Steps:** Click the "Login" link at the bottom of the registration form.
- **Expected:** User is navigated to the `/login` page.

---

## Module 2: Login (`/login`)

### TC-L01: Successful Regular User Login
- **Precondition:** User already registered.
- **Steps:**
  1. Enter registered username.
  2. Enter correct password.
  3. Click "Login".
- **Expected:** User is redirected to `/recognize`.

### TC-L02: Successful Admin Login
- **Steps:** Enter "admin" and the admin password (admin123), click login.
- **Expected:** Redirected to `/recognize`.

### TC-L03: Login — Invalid Credentials
- **Steps:** Enter non-existent username or incorrect password, click submit.
- **Expected:** Error message: "Invalid username or password".

### TC-L04: Login — Empty Fields
- **Steps:** Click "Login" without entering username or password.
- **Expected:** Error message: "Username is required" or "Password is required".

### TC-L05: Protected Route Redirect
- **Precondition:** Not logged in.
- **Steps:** Attempt to navigate directly to `/recognize`, `/history`, or `/library`.
- **Expected:** User is redirected to the `/login` page.

---

## Module 3: Song Recognition (`/recognize`)

### TC-REC01: Page Load — UI Elements Present
- **Precondition:** Logged in.
- **Expected:** Page shows file upload area, "Upload for recognition" label, and "Recognize" button.

### TC-REC02: Successful Recognition (MP3)
- **Steps:** Upload a valid MP3 file that exists in the system fingerprints, click "Recognize".
- **Expected:** Result card displays the song name, artist, and match confidence.

### TC-REC03: Successful Recognition (WAV)
- **Steps:** Upload a valid WAV file, click "Recognize".
- **Expected:** Recognition result is displayed.

### TC-REC04: Song Not Found
- **Steps:** Upload an audio file that is NOT in the database.
- **Expected:** Page displays "Song not found" or "No match found" message.

### TC-REC05: Recognition — Invalid File type
- **Steps:** Attempt to upload a non-audio file (e.g., .txt, .jpg).
- **Expected:** File selector or validation blocks the upload, or an error is displayed.

### TC-REC06: Recognize — Empty Submission
- **Steps:** Click "Recognize" without selecting a file.
- **Expected:** "Recognize" button is disabled.

---

## Module 4: History (`/history`)

### TC-H01: Load History
- **Steps:** Navigate to `/history`.
- **Expected:** History table displays columns: Song, Confidence, Status, Date.

### TC-H02: History Empty State
- **Precondition:** New user with no recognition history.
- **Steps:** Navigate to `/history`.
- **Expected:** Message displayed: "No recognition history yet".

---

## Module 5: Library (`/library`)

### TC-LIB01: Load Library
- **Steps:** Navigate to `/library`.
- **Expected:** Library grid/list displays available songs.

### TC-LIB02: Search Functionality
- **Steps:** Type a partial song name in the search bar.
- **Expected:** List filters to show only matching songs.

### TC-LIB03: Search — No Results
- **Steps:** Search for a string that doesn't match any song name.
- **Expected:** Message displayed: "No songs found".

### TC-LIB04: Admin Upload Button Visibility (Admin)
- **Precondition:** Logged in as "admin".
- **Steps:** Navigate to `/library`.
- **Expected:** "Upload Song" button is visible.

### TC-LIB05: Admin Upload Button Visibility (Regular User)
- **Precondition:** Logged in as a regular user.
- **Steps:** Navigate to `/library`.
- **Expected:** "Upload Song" button is NOT visible.

---

## Module 6: Admin Actions (`/admin/upload`)

### TC-A01: Access Admin Upload Page (Admin)
- **Precondition:** Logged in as admin.
- **Steps:** Navigate to `/admin/upload`.
- **Expected:** Page loads successfully with song upload form.

### TC-A02: Access Admin Upload Page (Regular User)
- **Precondition:** Logged in as regular user.
- **Steps:** Navigate to `/admin/upload`.
- **Expected:** "Access Denied" error message displayed.

### TC-A03: Successful Song Upload & Fingerprinting
- **Precondition:** Logged in as admin on `/admin/upload`.
- **Steps:** Enter song name, artist name, select MP3 file, click "Upload and Fingerprint".
- **Expected:** Success message shown. Song is added to database and fingerprint database updated.

### TC-A04: Upload Duplicate Song
- **Steps:** Attempt to upload a song that already exists in the library.
- **Expected:** Error message: "Song already exists in the database".

---

## Module 7: End-to-End Workflow

### TC-E2E01: Register to Recognition Flow
1. **Register** a new user.
2. **Login** with the new user credentials.
3. Navigate to **Recognize** page.
4. **Upload** an audio sample.
5. Check **History** to verify the recognition attempt is logged.
6. Check **Library** for available songs.
7. **Logout**.

### TC-E2E02: Admin Upload to User Recognition
1. **Login as Admin**.
2. **Upload** a new song "Unique Song" via `/admin/upload`.
3. **Logout**.
4. **Login as Regular User**.
5. Use **Recognize** to identify "Unique Song".
6. Verify result shows "Unique Song" with high confidence.

---

**Total Test Cases: 31**

