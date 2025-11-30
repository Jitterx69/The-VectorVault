import sys
import json
import argparse

# --- Threat Solutions Database ---
# Maps keywords to specific solutions
SOLUTIONS = {
    "ddos": {
        "title": "DDoS Mitigation",
        "description": "A Distributed Denial of Service (DDoS) attack attempts to overwhelm resources. Mitigation involves rate limiting and traffic filtering.",
        "cpp_snippet": """// SECURE: Advanced Rate Limiting
bool checkRateLimit(string ip_addr) {
    const int MAX_REQUESTS = 100;
    const int TIME_WINDOW = 60; // seconds
    
    auto now = getCurrentTime();
    auto& record = request_log[ip_addr];
    
    // Clean old requests
    while (!record.empty() && now - record.front() > TIME_WINDOW) {
        record.pop();
    }
    
    if (record.size() >= MAX_REQUESTS) {
        logSecurityEvent("DDoS attempt blocked", ip_addr);
        return false; // Block
    }
    
    record.push(now);
    return true; // Allow
}""",
        "assembly_snippet": """; High-Performance Packet Filter (x86_64)
filter_packet:
    mov rdi, [packet_src_ip]  ; Load Source IP
    mov rsi, blacklist_ptr    ; Load Blacklist
    
check_loop:
    cmp [rsi], rdi            ; Compare IP
    je drop_packet            ; If match, drop
    add rsi, 4                ; Next IP
    cmp [rsi], 0              ; End of list?
    jne check_loop
    
    ; Check packet rate
    mov rax, [ip_counter_ptr]
    inc qword [rax]
    cmp qword [rax], LIMIT
    jg drop_packet
    
    mov rax, 1                ; Accept
    ret

drop_packet:
    xor rax, rax              ; Reject
    ret
"""
    },
    "login": {
        "title": "Brute Force Protection",
        "description": "Suspicious login patterns often indicate brute-force attacks. Mitigation requires account locking and exponential backoff delays.",
        "cpp_snippet": """// SECURE: Account Lockout & Delay
bool validateLogin(string user, string pass) {
    if (isLockedOut(user)) {
        throw SecurityException("Account temporarily locked");
    }

    if (!checkCredentials(user, pass)) {
        int attempts = incrementFailedAttempts(user);
        
        // Exponential backoff
        int delay = std::pow(2, attempts); 
        std::this_thread::sleep_for(std::chrono::seconds(delay));
        
        if (attempts >= 5) {
            lockAccount(user, 15 * 60); // Lock for 15 mins
        }
        return false;
    }
    
    resetFailedAttempts(user);
    return true;
}""",
        "assembly_snippet": """; Constant Time Comparison (Timing Attack Prevention)
; Comparing two strings/hashes without leaking timing info
secure_compare:
    xor rax, rax            ; Result accumulator
    xor rcx, rcx            ; Loop counter
    
compare_loop:
    mov dl, [rdi + rcx]     ; Byte from string A
    mov dh, [rsi + rcx]     ; Byte from string B
    xor dl, dh              ; XOR differences
    or  al, dl              ; Accumulate difference
    inc rcx
    cmp rcx, 32             ; Assume 32-byte hash
    jl  compare_loop
    
    test al, al             ; Check if accumulator is 0
    jz   match_found
    mov  rax, 0             ; Fail
    ret

match_found:
    mov  rax, 1             ; Success
    ret
"""
    },
    "malware": {
        "title": "Malware Detection & Isolation",
        "description": "Malware detected in the system requires immediate isolation and signature verification to prevent execution.",
        "cpp_snippet": """// SECURE: PE Header Verification
bool verifyExecutable(string filepath) {
    ifstream file(filepath, ios::binary);
    
    // Check DOS Header
    uint16_t magic;
    file.read((char*)&magic, sizeof(magic));
    
    if (magic != 0x5A4D) { // 'MZ' signature
        return false; 
    }
    
    // Scan for known malicious section names
    // e.g., UPX packed sections often used by malware
    if (scanSections(file, ".upx") || scanSections(file, ".vmp")) {
        quarantineFile(filepath);
        return false;
    }
    
    return verifyDigitalSignature(filepath);
}""",
        "assembly_snippet": """; Syscall Hook Detection (Rootkit Check)
check_syscall_integrity:
    mov rcx, 0xC0000082     ; LSTAR MSR (Long Mode System Call Target)
    rdmsr                   ; Read MSR into EDX:EAX
    shl rdx, 32
    or  rax, rdx            ; Combine to get 64-bit address
    
    mov rbx, EXPECTED_SYSCALL_ADDR
    cmp rax, rbx
    jne hook_detected       ; Jump if address doesn't match kernel base
    
    ; Check first few bytes of handler for JMP (inline hook)
    mov al, [rax]
    cmp al, 0xE9            ; Opcode for JMP
    je  inline_hook_found
    
    mov rax, 1              ; Integrity OK
    ret

hook_detected:
    xor rax, rax            ; Integrity Compromised
    ret
"""
    },
    "database": {
        "title": "SQL Injection Prevention",
        "description": "Unauthorized database access attempts often exploit SQL injection vulnerabilities. Use parameterized queries.",
        "cpp_snippet": """// SECURE: Parameterized Query Implementation
void secureQuery(string userInput) {
    // NEVER concatenate strings for queries
    // string bad = "SELECT * FROM users WHERE name = '" + userInput + "'"; 
    
    sql::Connection* con = driver->connect(url, user, pass);
    
    // Prepare statement with placeholders
    sql::PreparedStatement* pstmt = con->prepareStatement(
        "SELECT id, email, role FROM users WHERE username = ? AND status = ?"
    );
    
    // Bind parameters safely
    pstmt->setString(1, userInput);
    pstmt->setString(2, "active");
    
    sql::ResultSet* res = pstmt->executeQuery();
    // ... process results
}""",
        "assembly_snippet": """; Input Validation Loop (Filter Dangerous Chars)
validate_input_string:
    mov rsi, input_buffer   ; Source string
    
scan_char:
    lodsb                   ; Load byte from RSI to AL
    test al, al             ; Check for null terminator
    jz   valid_string
    
    cmp al, 0x27            ; Check for single quote (')
    je  invalid_char
    cmp al, 0x3B            ; Check for semicolon (;)
    je  invalid_char
    cmp al, 0x2D            ; Check for dash (-) (comment)
    je  invalid_char
    
    jmp scan_char
    
invalid_char:
    mov rax, 0              ; Return False (Invalid)
    ret
    
valid_string:
    mov rax, 1              ; Return True (Valid)
    ret
"""
    },
    "ssl": {
        "title": "Certificate Management",
        "description": "SSL Certificate expiration can lead to service outages and trust issues. Automated renewal and validation is required.",
        "cpp_snippet": """// SECURE: Certificate Validation
bool checkCertificate(SSL* ssl) {
    X509* cert = SSL_get_peer_certificate(ssl);
    if (!cert) return false;
    
    // Check validity period
    if (X509_cmp_current_time(X509_get_notBefore(cert)) >= 0 ||
        X509_cmp_current_time(X509_get_notAfter(cert)) <= 0) {
        logError("Certificate expired or not yet valid");
        return false;
    }
    
    // Verify Hostname
    if (X509_check_host(cert, "api.company.com", 0, 0, NULL) != 1) {
        logError("Hostname mismatch");
        return false;
    }
    
    return true;
}""",
        "assembly_snippet": """; Date Comparison Logic (Conceptual)
compare_dates:
    ; rdi = current_timestamp
    ; rsi = cert_expiry_timestamp
    
    cmp rdi, rsi
    jg  expired             ; If current > expiry, jump
    
    ; Calculate days remaining
    sub rsi, rdi            ; rsi = remaining seconds
    mov rax, rsi
    mov rcx, 86400          ; Seconds in a day
    xor rdx, rdx
    div rcx                 ; rax = days remaining
    
    cmp rax, 30             ; Alert if < 30 days
    jl  trigger_alert
    
    mov rax, 1              ; OK
    ret

expired:
    xor rax, rax            ; Expired
    ret
"""
    }
}

DEFAULT_SOLUTION = {
    "title": "General Anomaly Mitigation",
    "description": "An anomalous event was detected. Standard protocol involves log analysis, system isolation, and patch verification.",
    "cpp_snippet": """// General Logging & Alerting
void logSecurityIncident(string type, int severity) {
    SecurityLog log;
    log.timestamp = std::time(nullptr);
    log.type = type;
    log.severity = severity;
    log.encrypt(); // Encrypt log entry before writing
    writeToSecureStorage(log);
    
    if (severity > 8) {
        triggerSysAdminAlert(type);
    }
}""",
    "assembly_snippet": """; NOP Sled Detection (Generic Exploit Check)
scan_memory:
    mov rcx, buffer_len
    mov rsi, buffer_ptr
    xor rdx, rdx            ; NOP counter
    
scan_loop:
    lodsb                   ; Load byte
    cmp al, 0x90            ; Check for NOP
    jne reset_count
    inc rdx
    cmp rdx, 16             ; If 16 consecutive NOPs
    jge exploit_detected
    loop scan_loop
    ret

reset_count:
    xor rdx, rdx
    loop scan_loop
    ret
"""
}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", help="Type of the incident", required=True)
    args = parser.parse_args()

    input_type = args.type.lower()
    solution = DEFAULT_SOLUTION
    
    # Fuzzy matching logic
    if "ddos" in input_type:
        solution = SOLUTIONS["ddos"]
    elif "login" in input_type or "auth" in input_type or "password" in input_type:
        solution = SOLUTIONS["login"]
    elif "malware" in input_type or "virus" in input_type:
        solution = SOLUTIONS["malware"]
    elif "database" in input_type or "sql" in input_type or "db" in input_type:
        solution = SOLUTIONS["database"]
    elif "ssl" in input_type or "certificate" in input_type:
        solution = SOLUTIONS["ssl"]
    elif "xss" in input_type or "script" in input_type:
        # Adding XSS dynamically if needed, or mapping to database/input validation
        solution = SOLUTIONS["database"] 
        solution["title"] = "XSS Mitigation" # Override title for context

    print(json.dumps(solution))
