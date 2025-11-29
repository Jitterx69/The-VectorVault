import smtplib
import sys
import json
import argparse
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# --- Configuration ---
SENDER_EMAIL = "thesyntaxslayers.team@gmail.com"
SENDER_PASSWORD = "apjk qxui gmpj upef" 
RECIPIENT_EMAIL = "thewriterranjan@gmail.com"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587 

# --- Threat Database ---
THREAT_DESCRIPTIONS = {
    "SQL Injection (SQLi)": {
        "description": "SQL Injection is a code injection technique where an attacker executes malicious SQL statements that control a web application's database server. This can allow attackers to bypass authentication, access, modify, or delete data within the database.",
        "impact": "Data breach, unauthorized access, data loss, loss of data integrity.",
        "mitigation": "Use prepared statements (parameterized queries), input validation, and least privilege database accounts."
    },
    "Cross-Site Scripting (XSS)": {
        "description": "Cross-Site Scripting (XSS) attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user. Flaws that allow these attacks are quite widespread and occur anywhere a web application uses input from a user without validating or encoding it.",
        "impact": "Session hijacking, unauthorized actions, defacement, redirection to malicious sites.",
        "mitigation": "Sanitize user input, encode output, use Content Security Policy (CSP)."
    },
    "Distributed Denial of Service (DDoS)": {
        "description": "A Distributed Denial of Service (DDoS) attack is a malicious attempt to disrupt the normal traffic of a targeted server, service, or network by overwhelming the target or its surrounding infrastructure with a flood of Internet traffic.",
        "impact": "Service unavailability, revenue loss, reputational damage.",
        "mitigation": "Traffic analysis, rate limiting, using a CDN or DDoS mitigation service."
    },
    "Brute Force Attack": {
        "description": "A Brute Force attack consists of an attacker submitting many passwords or passphrases with the hope of eventually guessing correctly. The attacker systematically checks all possible passwords and passphrases until the correct one is found.",
        "impact": "Unauthorized access, account compromise.",
        "mitigation": "Account lockout policies, multi-factor authentication (MFA), strong password policies."
    },
    "Malware Infection": {
        "description": "Malware, or malicious software, is any program or file that is harmful to a computer user. Types of malware can include computer viruses, worms, Trojan horses, and spyware.",
        "impact": "Data theft, system damage, surveillance, ransomware encryption.",
        "mitigation": "Antivirus software, regular updates, user education, network segmentation."
    },
    "Security Code Triggered": {
        "description": "A manual security override or emergency code was triggered by an administrator. This indicates a high-priority event requiring immediate attention.",
        "impact": "System lockdown, emergency protocol activation.",
        "mitigation": "Verify administrator identity and review system logs for the trigger event."
    }
}

DEFAULT_THREAT = {
    "description": "An anomalous security event has been detected that requires investigation. The specific signature does not match standard predefined categories but exhibits suspicious behavior.",
    "impact": "Potential security compromise depending on the nature of the anomaly.",
    "mitigation": "Investigate system logs, isolate affected systems, and analyze network traffic."
}

def send_report(incident_type, incident_id):
    threat_info = THREAT_DESCRIPTIONS.get(incident_type, DEFAULT_THREAT)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    subject = f"INCIDENT REPORT: {incident_type} - {incident_id}"
    
    body = f"""
***AUTOMATED INCIDENT INVESTIGATION REPORT***

**Incident ID:** {incident_id}
**Detected Threat:** {incident_type}
**Timestamp:** {timestamp}

---------------------------------------------------------------------
**THREAT ANALYSIS**
---------------------------------------------------------------------

**Description:**
{threat_info['description']}

**Potential Impact:**
{threat_info['impact']}

---------------------------------------------------------------------
**RECOMMENDED ACTIONS**
---------------------------------------------------------------------

**Mitigation Strategies:**
{threat_info['mitigation']}

**Immediate Steps for Admin:**
1. Review server access logs for the timestamp: {timestamp}
2. Isolate any affected user accounts or IP addresses.
3. Patch known vulnerabilities related to {incident_type}.
4. If this is a false positive, update the ML classifier feedback loop.

---------------------------------------------------------------------
This is an automated message generated by the VectorVault Security Engine.
"""

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

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", help="Type of the incident", required=True)
    parser.add_argument("--id", help="ID of the incident", required=True)
    args = parser.parse_args()

    if send_report(args.type, args.id):
        print(json.dumps({"success": True, "message": f"Report sent for {args.type}"}))
    else:
        print(json.dumps({"success": False, "error": "Failed to send email report"}))
