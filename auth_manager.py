import random
import string
import smtplib
import sys
import json
import argparse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# --- Configuration ---
SENDER_EMAIL = "thesyntaxslayers.team@gmail.com"
SENDER_PASSWORD = "apjk qxui gmpj upef" 
RECIPIENT_EMAIL = "thewriterranjan@gmail.com" # Fixed double @ typo
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587 

def send_email_raw(subject, body):
    message = MIMEMultipart()
    message["From"] = SENDER_EMAIL
    message["To"] = RECIPIENT_EMAIL
    message["Subject"] = subject
    message.attach(MIMEText(body, 'plain'))
    
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, message.as_string())
        return True
    except Exception as e:
        return False

def generate_credentials():
    # 1. Generate Credentials (User Logic)
    username_prefix = "admin_user_"
    random_suffix = ''.join(random.choices(string.digits, k=4))
    new_username = f"{username_prefix}{random_suffix}"
    
    characters = string.ascii_letters + string.digits + string.punctuation
    password_length = 16
    new_password = ''.join(random.choice(characters) for i in range(password_length))
    
    # 2. Prepare Email Content (User Template)
    subject = "URGENT: Administrative Credentials Generated"
    body = f"""
***CONFIDENTIAL: SYSTEM GENERATED CREDENTIALS***

Dear Administrator,

The automated system has successfully generated new, temporary login credentials for immediate use. These credentials are time-sensitive and must be used immediately to ensure security compliance.

**LOGIN DETAILS:**

* **Username:** `{new_username}`
* **Password:** `{new_password}`

**ACTION REQUIRED:**
1. Log in immediately to the designated administrative portal.
2. Change the password upon first login as per security policy.
3. Do not store these credentials in unencrypted local files.

**WARNING:** These credentials will expire (or be revoked) at the next scheduled rotation period.

Regards,
Automated Security System
"""
    
    # 3. Send Email
    if send_email_raw(subject, body):
        # Return credentials to Node.js backend via stdout (JSON for integration)
        print(json.dumps({
            "success": True,
            "username": new_username,
            "password": new_password
        }))
    else:
        print(json.dumps({
            "success": False,
            "error": "Failed to send email"
        }))

def send_alert(attempted_username):
    subject = "SECURITY ALERT: Failed Login Attempt"
    body = f"""
***SECURITY ALERT: UNAUTHORIZED ACCESS ATTEMPT***

Dear Administrator,

A failed login attempt was detected on the Secure Access Portal.

**DETAILS:**
* **Attempted Username:** {attempted_username}
* **Status:** Access Denied
* **Action:** Invalid Credentials Provided

Please investigate this activity if it persists.

Regards,
Automated Security System
"""
    
    if send_email_raw(subject, body):
        print(json.dumps({"success": True}))
    else:
        print(json.dumps({"success": False}))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["generate", "alert"])
    parser.add_argument("--username", help="Username used in failed attempt", default="Unknown")
    args = parser.parse_args()

    if args.action == "generate":
        generate_credentials()
    elif args.action == "alert":
        send_alert(args.username)
