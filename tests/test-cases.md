# Test Cases – Student Portal

## TC-01: Valid Login
Steps:
1. Open login.html
2. Enter valid username/password
Expected:
- Redirects to dashboard.html
- Shows welcome/profile name

## TC-02: Invalid Login
Steps:
1. Open login.html
2. Enter wrong password
Expected:
- Error message displayed
- No redirect

## TC-03: View Courses
Steps:
1. Login successfully
2. Check course list
Expected:
- Courses appear from courses.json

## TC-04: Register Course
Steps:
1. Select a course
2. Click Register
Expected:
- Course appears in "My Registered Courses"
- Success message shown

## TC-05: Drop Course (CR-02)
Steps:
1. Register a course
2. Click Drop next to the registered course
Expected:
- Course removed from registered list
- Confirmation message

## TC-06: Remember Me (CR-01)
Steps:
1. Check Remember Me
2. Login
3. Refresh the page
Expected:
- User stays logged in (or username is remembered, depending on implementation)
