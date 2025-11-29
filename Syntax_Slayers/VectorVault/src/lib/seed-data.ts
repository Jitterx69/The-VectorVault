import { tidbService, Incident } from './tidb';

const sampleIncidents: Omit<Incident, 'embedding'>[] = [
  {
    id: "INC-2023-847",
    title: "DDoS Attack on Web Infrastructure",
    description: "Large-scale distributed denial-of-service attack targeting main web servers with traffic volume exceeding 10Gbps. Attack originated from multiple botnet sources and caused significant service degradation.",
    category: "Network Security",
    severity: "Critical",
    status: "Resolved",
    timestamp: "2023-12-15 09:22:00",
    resolution: "Implemented rate limiting and activated DDoS protection service. Deployed additional CDN nodes and blacklisted malicious IP ranges.",
    tags: ["ddos", "web-infrastructure", "high-volume", "resolved", "botnet"],
    sources: ["Firewall", "Network Monitor", "Load Balancer"]
  },
  {
    id: "INC-2023-701",
    title: "Volumetric Attack on API Gateway",
    description: "High-volume HTTP requests targeting API endpoints causing service degradation. Attack focused on authentication endpoints and caused 5xx errors for legitimate users.",
    category: "Application Security",
    severity: "High",
    status: "Resolved",
    timestamp: "2023-11-28 14:15:00",
    resolution: "Applied traffic filtering rules and scaled infrastructure. Implemented API rate limiting and enhanced monitoring for suspicious patterns.",
    tags: ["api", "volumetric-attack", "scaling", "resolved", "authentication"],
    sources: ["API Gateway", "Application Logs", "SIEM"]
  },
  {
    id: "INC-2023-623",
    title: "Network Flooding Attack",
    description: "UDP flood attack targeting network infrastructure with malformed packets. Attack caused network congestion and affected multiple services.",
    category: "Infrastructure Security",
    severity: "High",
    status: "Resolved",
    timestamp: "2023-10-12 11:30:00",
    resolution: "Deployed upstream filtering and blacklisted source IPs. Enhanced network monitoring and implemented packet inspection.",
    tags: ["udp-flood", "network", "filtering", "resolved", "congestion"],
    sources: ["Network Monitor", "Firewall", "IDS/IPS"]
  },
  {
    id: "INC-2023-445",
    title: "Suspicious Traffic Patterns",
    description: "Unusual traffic patterns detected with characteristics similar to reconnaissance activity. Multiple port scans and service enumeration attempts observed.",
    category: "Threat Intelligence",
    severity: "Medium",
    status: "Resolved",
    timestamp: "2023-09-08 16:45:00",
    resolution: "Enhanced monitoring and implemented behavioral analysis. Deployed honeypots and improved threat detection rules.",
    tags: ["reconnaissance", "traffic-analysis", "monitoring", "resolved", "port-scan"],
    sources: ["IDS/IPS", "Network Monitor", "SIEM"]
  },
  {
    id: "INC-2023-332",
    title: "SQL Injection Attempt",
    description: "Multiple SQL injection attempts detected on web application forms. Attackers attempting to exploit database vulnerabilities through user input fields.",
    category: "Application Security",
    severity: "High",
    status: "Contained",
    timestamp: "2023-08-15 13:20:00",
    resolution: "Implemented input validation and parameterized queries. Enhanced WAF rules and deployed additional security controls.",
    tags: ["sql-injection", "web-application", "database", "contained", "input-validation"],
    sources: ["WAF", "Application Logs", "Database Monitor"]
  },
  {
    id: "INC-2023-289",
    title: "Malware Detection on Endpoint",
    description: "Malicious software detected on employee workstation. Trojan horse attempting to establish command and control communication.",
    category: "Endpoint Security",
    severity: "Critical",
    status: "Resolved",
    timestamp: "2023-07-22 10:15:00",
    resolution: "Isolated affected endpoint and removed malware. Updated antivirus signatures and conducted security awareness training.",
    tags: ["malware", "endpoint", "trojan", "resolved", "isolation"],
    sources: ["Antivirus", "Endpoint Monitor", "Network Monitor"]
  },
  {
    id: "INC-2023-201",
    title: "Phishing Campaign Detection",
    description: "Large-scale phishing campaign targeting organization employees. Emails containing malicious links and credential harvesting attempts.",
    category: "Email Security",
    severity: "Medium",
    status: "Resolved",
    timestamp: "2023-06-10 08:30:00",
    resolution: "Blocked malicious emails and updated email security filters. Conducted phishing awareness training and implemented MFA.",
    tags: ["phishing", "email", "credential-harvesting", "resolved", "awareness"],
    sources: ["Email Gateway", "Antivirus", "User Reports"]
  },
  {
    id: "INC-2023-156",
    title: "Data Exfiltration Attempt",
    description: "Suspicious data transfer patterns indicating potential data exfiltration. Large file transfers to external destinations detected.",
    category: "Data Security",
    severity: "Critical",
    status: "Investigating",
    timestamp: "2023-05-18 19:45:00",
    resolution: "Blocked suspicious transfers and enhanced data loss prevention. Investigating source and scope of data access.",
    tags: ["data-exfiltration", "dlp", "investigating", "file-transfer", "external"],
    sources: ["DLP", "Network Monitor", "SIEM"]
  },
  {
    id: "INC-2023-098",
    title: "Brute Force Authentication",
    description: "Multiple failed login attempts from single IP address. Attackers attempting to gain unauthorized access to user accounts.",
    category: "Identity & Access",
    severity: "Medium",
    status: "Resolved",
    timestamp: "2023-04-25 15:10:00",
    resolution: "Blocked source IP and implemented account lockout policies. Enhanced authentication monitoring and deployed additional security measures.",
    tags: ["brute-force", "authentication", "account-lockout", "resolved", "login"],
    sources: ["Authentication System", "SIEM", "Network Monitor"]
  },
  {
    id: "INC-2023-045",
    title: "Cloud Configuration Misuse",
    description: "Unauthorized access to cloud resources detected. Potential misconfiguration allowing excessive permissions to cloud services.",
    category: "Cloud Security",
    severity: "High",
    status: "Resolved",
    timestamp: "2023-03-12 11:55:00",
    resolution: "Reviewed and corrected cloud security policies. Implemented least privilege access and enhanced monitoring.",
    tags: ["cloud", "misconfiguration", "permissions", "resolved", "least-privilege"],
    sources: ["Cloud Monitor", "IAM", "SIEM"]
  }
];

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Connect to database
    await tidbService.connect();
    
    // Create incidents
    for (const incident of sampleIncidents) {
      try {
        await tidbService.createIncident(incident);
        console.log(`Created incident: ${incident.id}`);
      } catch (error) {
        console.error(`Failed to create incident ${incident.id}:`, error);
      }
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  } finally {
    await tidbService.disconnect();
  }
};

// Export sample data for testing
export { sampleIncidents };
