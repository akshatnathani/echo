# Echo App — Test Cases

## Module 1: Registration (`/register`)

### TC-R01: Successful Registration
- **Precondition:** User not logged in, navigated to `/register`
- **Steps:**
  1. Enter full name: "Test User"
  2. Enter email: "testuser@example.com"
  3. Enter a valid password: "Test1234"
  4. Check "I agree to the Terms and Privacy Policy" checkbox
  5. Click "Create account"
- **Expected:** User is redirected to `/home`. Token/user stored in localStorage.

### TC-R02: Registration — Empty Fields
- **Steps:** Click "Create account" without filling any fields
- **Expected:** Browser native validation blocks submission (required fields).

### TC-R03: Registration — Invalid Email Format
- **Steps:** Enter name, password "Test1234", check terms, enter email "notanemail"
- **Expected:** Browser native validation blocks submission (invalid email).

### TC-R04: Registration — Password Too Short
- **Steps:** Enter name, email, password "Ab1", check terms, click submit
- **Expected:** Error message: "Password must be at least 8 characters"

### TC-R05: Registration — Password Missing Uppercase
- **Steps:** Enter password "testtest1", check terms, click submit
- **Expected:** Error message: "Password must contain at least one uppercase letter"

### TC-R06: Registration — Password Missing Lowercase
- **Steps:** Enter password "TESTTEST1", check terms, click submit
- **Expected:** Error message: "Password must contain at least one lowercase letter"

### TC-R07: Registration — Password Missing Number
- **Steps:** Enter password "Testtest", check terms, click submit
- **Expected:** Error message: "Password must contain at least one number"

### TC-R08: Registration — Terms Not Agreed
- **Steps:** Fill all fields validly but do NOT check terms checkbox, click submit
- **Expected:** Error message: "Please agree to the Terms of Service and Privacy Policy"

### TC-R09: Registration — Duplicate Email
- **Steps:** Register with an already-registered email
- **Expected:** Error message from server (e.g., "Email already exists")

### TC-R10: Registration — Password Strength Indicators
- **Steps:** Type password character by character
- **Expected:**
  - "8+ chars" indicator turns green when length >= 8
  - "Uppercase" indicator turns green when an uppercase letter is typed
  - "Lowercase" indicator turns green when a lowercase letter is typed
  - "Number" indicator turns green when a digit is typed

### TC-R11: Registration — Show/Hide Password Toggle
- **Steps:** Enter password, click the eye icon toggle
- **Expected:** Password field toggles between `type="password"` and `type="text"`

### TC-R12: Registration — Navigate to Login
- **Steps:** Click "Sign in" link at the bottom
- **Expected:** Navigated to `/login`

### TC-R13: Registration — Google OAuth Button Rendered
- **Steps:** Load the register page
- **Expected:** Google "Sign up with Google" button is visible in the form

---

## Module 2: Login (`/login`)

### TC-L01: Successful Login
- **Precondition:** User already registered with email/password
- **Steps:**
  1. Enter registered email
  2. Enter correct password
  3. Click "Sign in"
- **Expected:** User is redirected to `/home`. Token/user stored in localStorage.

### TC-L02: Login — Empty Fields
- **Steps:** Click "Sign in" without entering email or password
- **Expected:** Browser native validation blocks submission.

### TC-L03: Login — Invalid Email Format
- **Steps:** Enter "notanemail" in email, any password, click submit
- **Expected:** Browser native validation blocks submission.

### TC-L04: Login — Wrong Password
- **Steps:** Enter valid registered email, enter wrong password, click submit
- **Expected:** Error message displayed (e.g., "Invalid credentials" or "Login failed").

### TC-L05: Login — Non-existent Email
- **Steps:** Enter an unregistered email, any password, click submit
- **Expected:** Error message displayed.

### TC-L06: Login — Show/Hide Password Toggle
- **Steps:** Enter password, click eye icon
- **Expected:** Password field toggles between `type="password"` and `type="text"`

### TC-L07: Login — Navigate to Register
- **Steps:** Click "Sign up for free" link at the bottom
- **Expected:** Navigated to `/register`

### TC-L08: Login — Google OAuth Button Rendered
- **Steps:** Load the login page
- **Expected:** Google "Continue with Google" button is visible.

### TC-L09: Login — Loading State
- **Steps:** Submit valid credentials
- **Expected:** Button text changes to "Signing in..." and button is disabled during request.

### TC-L10: Login — Protected Route Redirect
- **Precondition:** Not logged in
- **Steps:** Navigate directly to `/home`
- **Expected:** Redirected to `/login` (or `/register`)

---

## Module 3: Discover / Listen from Mic (`/home`)

### TC-D01: Page Load — UI Elements Present
- **Precondition:** Logged in, navigated to `/home`
- **Expected:**
  - Navbar is visible with "Discover" as active page
  - Hero text: "Identify the music around you."
  - Circular mic button with "Tap to Listen" label
  - Trending echoes section is visible

### TC-D02: Start Listening — Mic Permission Granted
- **Steps:** Click the large circular mic button
- **Expected:**
  - Button changes state: animated sound bars appear, text changes to "Listening..."
  - Animated pulsing rings appear around the button
  - After ~5 seconds, recording stops automatically

### TC-D03: Start Listening — Mic Permission Denied
- **Steps:** Click mic button, deny microphone permission in browser prompt
- **Expected:** Error message: "Microphone access denied. Please allow mic access and try again."

### TC-D04: Stop Listening Early
- **Steps:** Click mic button (start listening), then click again before 5 seconds
- **Expected:** Listening stops immediately, no result or error shown.

### TC-D05: Successful Song Identification
- **Steps:** Click mic button, allow mic, wait 5 seconds
- **Expected:**
  - Identified track card appears with: song name, artist, album, genre, BPM
  - Green toast banner: "Added to your Echoed playlist!" with "View →" link
  - Song is saved to localStorage (`echo_local_playlist`)

### TC-D06: Song Saved to localStorage
- **Precondition:** Song successfully identified
- **Steps:** Open browser DevTools > Application > localStorage > `echo_local_playlist`
- **Expected:** JSON array contains the identified song with `local_` prefixed ID.

### TC-D07: View Playlist Link in Toast
- **Steps:** After identification, click "View →" link in green toast
- **Expected:** Navigated to `/playlists`

### TC-D08: Navbar Navigation — Playlists
- **Steps:** Click "Playlists" in the navbar
- **Expected:** Navigated to `/playlists`

### TC-D09: Error State Display
- **Steps:** Trigger any identification error (e.g., server down)
- **Expected:** Red error banner appears below the mic button with error message.

---

## Module 4: Echoed Playlist (`/playlists`)

### TC-P01: Page Load — Playlist with Songs
- **Precondition:** At least one song identified previously (exists in localStorage)
- **Expected:**
  - Navbar visible with "Playlists" active
  - Playlist header: "Echoed" title, song count, estimated duration
  - Song table with columns: #, Title (with artist), Album, Date, Remove button
  - "Discover Your Vibe" AI button visible

### TC-P02: Page Load — Empty Playlist
- **Precondition:** No songs identified, localStorage empty
- **Expected:** "No echoes yet" empty state with guidance text.

### TC-P03: Song Row Display
- **Steps:** View a song in the list
- **Expected:**
  - Row shows index number, song title, artist, album (or "—"), date formatted as "Mon DD, YYYY"
  - Remove button (trash icon) appears on hover

### TC-P04: Remove Song from Playlist
- **Steps:** Hover over a song row, click the trash icon
- **Expected:** Song is removed from the list. If local, removed from localStorage. If server, DELETE API called.

### TC-P05: Discover Your Vibe — Button Click
- **Steps:** Click "Discover Your Vibe" button
- **Expected:**
  - Button shows loading spinner with "Analyzing your sonic identity..."
  - After API response, vibe card replaces the button

### TC-P06: Vibe Card Display
- **Precondition:** Vibe analysis completed successfully
- **Expected:**
  - Vibe name with emoji displayed
  - Listening persona badge shown
  - Description paragraph
  - Sonic identity quote (italic, left-bordered)
  - Mood keyword tags
  - Mini stats row: top genre, energy level, songs analyzed count
  - Regenerate button (refresh icon)

### TC-P07: Regenerate Vibe
- **Steps:** Click the refresh icon on the vibe card
- **Expected:** Vibe analysis runs again, card updates with new AI-generated data.

### TC-P08: Vibe Error — No Songs
- **Steps:** Remove all songs, then somehow trigger vibe (edge case)
- **Expected:** Error suppressed (hidden when message includes "No songs").

### TC-P09: Vibe Error — API Failure
- **Steps:** Trigger vibe when server/Gemini is down
- **Expected:** Red error text appears below the vibe button.

### TC-P10: Song Count and Duration Update
- **Steps:** Add/remove songs
- **Expected:** Song count and "~X min" update dynamically.

---

## Module 5: End-to-End Flow (Mic → Playlist)

### TC-E2E01: Full Flow — Register → Identify → Playlist
1. Navigate to `/register`
2. Register new account
3. Redirected to `/home`
4. Click mic button, wait for identification
5. Verify green toast "Added to your Echoed playlist!"
6. Click "View →" or navigate to `/playlists`
7. Verify identified song appears in playlist table
8. Click "Discover Your Vibe"
9. Verify vibe card appears with AI analysis

### TC-E2E02: Full Flow — Login → Identify → Playlist
1. Navigate to `/login`
2. Login with existing credentials
3. Redirected to `/home`
4. Click mic button, identify a song
5. Navigate to `/playlists`
6. Verify song is in the list

### TC-E2E03: Multiple Songs Workflow
1. Login
2. Identify Song A on `/home`
3. Identify Song B on `/home`
4. Go to `/playlists`
5. Verify both songs appear in the table (Song B first if sorted by date desc)

### TC-E2E04: Remove Song and Re-check
1. Go to `/playlists` with songs
2. Remove a song
3. Refresh page
4. Verify song is no longer in the list

---

## Module 6: Navigation & Auth Guards

### TC-N01: Unauthenticated Access to Protected Route
- **Steps:** Clear localStorage, navigate to `/home`
- **Expected:** Redirected to login/register page

### TC-N02: Authenticated Access to Public Route
- **Steps:** While logged in, navigate to `/login`
- **Expected:** Redirected to `/home` (PublicRoute guard)

### TC-N03: Navbar Links Work
- **Steps:** Click each navbar link (Discover, Playlists)
- **Expected:** Each navigates to the correct page

### TC-N04: Root URL Redirect
- **Steps:** Navigate to `/`
- **Expected:** Redirected to `/register`

---

**Total Test Cases: 44**
