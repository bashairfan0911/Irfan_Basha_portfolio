import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Network, HelpCircle, Lightbulb, Layers } from "lucide-react";
import { Link } from "react-router-dom";

interface NetworkingCategory {
    category: string;
    questions: {
        question: string;
        answer: string;
    }[];
    concepts: { term: string; definition: string }[];
}

const networkingCategories: NetworkingCategory[] = [
    {
        category: "OSI Model & TCP/IP",
        questions: [
            {
                question: "Explain the OSI model and its 7 layers",
                answer: "Layer 1-Physical (cables, signals), Layer 2-Data Link (MAC, switches), Layer 3-Network (IP, routing), Layer 4-Transport (TCP/UDP, ports), Layer 5-Session (connections), Layer 6-Presentation (encryption, formatting), Layer 7-Application (HTTP, FTP, DNS). Each layer provides services to the layer above."
            },
            {
                question: "What is the difference between TCP and UDP?",
                answer: "TCP: Connection-oriented, reliable, ordered delivery, error checking, slower, used for HTTP, SSH, FTP. UDP: Connectionless, unreliable, no ordering, faster, lower overhead, used for DNS, streaming, gaming, VoIP."
            },
            {
                question: "Explain the 3-way handshake in TCP",
                answer: "1) SYN: Client sends SYN packet to server. 2) SYN-ACK: Server responds with SYN-ACK. 3) ACK: Client sends ACK to complete connection. This establishes reliable connection before data transfer."
            },
            {
                question: "What is the difference between IPv4 and IPv6?",
                answer: "IPv4: 32-bit address (4.3 billion addresses), dotted decimal notation (192.168.1.1), address exhaustion problem. IPv6: 128-bit address (340 undecillion addresses), hexadecimal notation (2001:0db8::1), built-in security, no NAT needed."
            }
        ],
        concepts: [
            { term: "OSI Model", definition: "7-layer conceptual framework for network communication standardization" },
            { term: "TCP", definition: "Transmission Control Protocol - Reliable, connection-oriented transport protocol" },
            { term: "UDP", definition: "User Datagram Protocol - Fast, connectionless transport protocol" },
            { term: "IP", definition: "Internet Protocol - Routes packets across networks using IP addresses" }
        ]
    },
    {
        category: "DNS & DHCP",
        questions: [
            {
                question: "How does DNS work?",
                answer: "DNS translates domain names to IP addresses. Process: 1) Check local cache, 2) Query recursive resolver, 3) Query root nameserver, 4) Query TLD nameserver (.com), 5) Query authoritative nameserver, 6) Return IP address. Uses UDP port 53, TCP for zone transfers."
            },
            {
                question: "What are different types of DNS records?",
                answer: "A: Maps domain to IPv4. AAAA: Maps to IPv6. CNAME: Alias to another domain. MX: Mail server. NS: Nameserver. TXT: Text information (SPF, DKIM). SOA: Start of Authority. PTR: Reverse DNS lookup."
            },
            {
                question: "How does DHCP work?",
                answer: "DHCP automatically assigns IP addresses. DORA process: 1) Discover: Client broadcasts request, 2) Offer: Server offers IP, 3) Request: Client requests offered IP, 4) Acknowledge: Server confirms assignment. Lease time determines how long IP is valid."
            },
            {
                question: "What is DNS caching and TTL?",
                answer: "DNS caching stores query results temporarily to reduce lookup time. TTL (Time To Live) specifies how long record can be cached. Lower TTL means faster propagation of changes but more DNS queries. Higher TTL reduces load but slower updates."
            }
        ],
        concepts: [
            { term: "DNS", definition: "Domain Name System - Translates domain names to IP addresses" },
            { term: "DHCP", definition: "Dynamic Host Configuration Protocol - Automatically assigns IP addresses" },
            { term: "TTL", definition: "Time To Live - Duration a DNS record can be cached" },
            { term: "Recursive Resolver", definition: "DNS server that queries other servers on behalf of client" }
        ]
    },
    {
        category: "HTTP/HTTPS & Web Protocols",
        questions: [
            {
                question: "What is the difference between HTTP and HTTPS?",
                answer: "HTTP: Unencrypted, port 80, data visible to attackers. HTTPS: Encrypted with TLS/SSL, port 443, secure data transmission, requires SSL certificate. HTTPS provides confidentiality, integrity, and authentication."
            },
            {
                question: "Explain HTTP request methods",
                answer: "GET: Retrieve data, idempotent, cacheable. POST: Submit data, not idempotent. PUT: Update/replace resource, idempotent. PATCH: Partial update. DELETE: Remove resource. HEAD: Like GET but only headers. OPTIONS: Describe communication options."
            },
            {
                question: "What are HTTP status codes?",
                answer: "1xx: Informational. 2xx: Success (200 OK, 201 Created, 204 No Content). 3xx: Redirection (301 Moved, 302 Found, 304 Not Modified). 4xx: Client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found). 5xx: Server error (500 Internal, 502 Bad Gateway, 503 Unavailable)."
            },
            {
                question: "How does SSL/TLS work?",
                answer: "TLS handshake: 1) Client Hello (supported ciphers), 2) Server Hello (chosen cipher, certificate), 3) Client verifies certificate, 4) Key exchange, 5) Encrypted communication begins. Uses asymmetric encryption for handshake, symmetric for data transfer."
            }
        ],
        concepts: [
            { term: "HTTP", definition: "Hypertext Transfer Protocol - Application layer protocol for web communication" },
            { term: "HTTPS", definition: "HTTP Secure - HTTP with TLS/SSL encryption" },
            { term: "TLS/SSL", definition: "Transport Layer Security/Secure Sockets Layer - Encryption protocols" },
            { term: "Certificate", definition: "Digital document verifying website identity, issued by Certificate Authority" }
        ]
    },
    {
        category: "Load Balancing & High Availability",
        questions: [
            {
                question: "What is load balancing and why is it important?",
                answer: "Load balancing distributes traffic across multiple servers to improve performance, availability, and reliability. Prevents single server overload, enables horizontal scaling, provides redundancy, improves response time."
            },
            {
                question: "Explain different load balancing algorithms",
                answer: "Round Robin: Distributes sequentially. Least Connections: Sends to server with fewest connections. IP Hash: Uses client IP to determine server. Weighted: Assigns weight based on capacity. Least Response Time: Sends to fastest server."
            },
            {
                question: "What is the difference between Layer 4 and Layer 7 load balancing?",
                answer: "Layer 4 (Transport): Routes based on IP and port, faster, less intelligent, can't inspect content. Layer 7 (Application): Routes based on content (URL, headers, cookies), slower, more intelligent, can do SSL termination and content-based routing."
            },
            {
                question: "What is health checking in load balancers?",
                answer: "Health checks monitor backend server status. Active: Load balancer sends requests (HTTP GET, TCP connect). Passive: Monitors actual traffic responses. Unhealthy servers removed from pool. Checks include response time, status codes, custom endpoints."
            }
        ],
        concepts: [
            { term: "Load Balancer", definition: "Device/software distributing network traffic across multiple servers" },
            { term: "Health Check", definition: "Automated test to verify server availability and responsiveness" },
            { term: "Session Persistence", definition: "Ensuring user requests go to same server (sticky sessions)" },
            { term: "SSL Termination", definition: "Load balancer handles SSL decryption, forwards unencrypted to backends" }
        ]
    },
    {
        category: "Subnetting & IP Addressing",
        questions: [
            {
                question: "What is subnetting and why is it used?",
                answer: "Subnetting divides network into smaller sub-networks. Benefits: Better organization, improved security (isolation), reduced broadcast traffic, efficient IP allocation. Uses subnet mask to determine network and host portions."
            },
            {
                question: "Explain CIDR notation",
                answer: "CIDR (Classless Inter-Domain Routing) notation: IP/prefix length. Example: 192.168.1.0/24 means first 24 bits are network, last 8 bits are host. /24 = 256 addresses, /25 = 128, /26 = 64, /27 = 32, /28 = 16, /30 = 4 (useful for point-to-point)."
            },
            {
                question: "What are private IP address ranges?",
                answer: "Class A: 10.0.0.0/8 (10.0.0.0 - 10.255.255.255). Class B: 172.16.0.0/12 (172.16.0.0 - 172.31.255.255). Class C: 192.168.0.0/16 (192.168.0.0 - 192.168.255.255). Used for internal networks, not routable on internet, require NAT for internet access."
            },
            {
                question: "What is NAT and how does it work?",
                answer: "NAT (Network Address Translation) translates private IPs to public IP. Types: Static NAT (1:1 mapping), Dynamic NAT (pool of public IPs), PAT/NAT Overload (many private to one public using ports). Enables IP conservation, provides security layer."
            }
        ],
        concepts: [
            { term: "Subnet Mask", definition: "32-bit number separating network and host portions of IP address" },
            { term: "CIDR", definition: "Classless Inter-Domain Routing - Flexible IP addressing method" },
            { term: "NAT", definition: "Network Address Translation - Maps private IPs to public IPs" },
            { term: "Gateway", definition: "Router connecting local network to external networks" }
        ]
    },
    {
        category: "Network Troubleshooting",
        questions: [
            {
                question: "How do you troubleshoot network connectivity issues?",
                answer: "1) Check physical connection, 2) Verify IP configuration (ipconfig/ifconfig), 3) Ping localhost (127.0.0.1), 4) Ping gateway, 5) Ping external IP (8.8.8.8), 6) Ping domain name (DNS test), 7) Check firewall rules, 8) Use traceroute to find where packets fail."
            },
            {
                question: "What is the difference between ping and traceroute?",
                answer: "Ping: Tests connectivity to specific host, measures round-trip time, uses ICMP echo. Traceroute: Shows path packets take to destination, identifies each hop, helps locate where connection fails. Ping tests endpoint, traceroute maps entire route."
            },
            {
                question: "How do you diagnose slow network performance?",
                answer: "1) Check bandwidth usage (iftop, nethogs), 2) Test latency (ping), 3) Check packet loss, 4) Verify DNS resolution time, 5) Check for network congestion, 6) Test different routes (traceroute), 7) Monitor interface errors (netstat -i), 8) Check QoS settings."
            },
            {
                question: "What are common network ports and their services?",
                answer: "20/21: FTP, 22: SSH, 23: Telnet, 25: SMTP, 53: DNS, 80: HTTP, 110: POP3, 143: IMAP, 443: HTTPS, 3306: MySQL, 3389: RDP, 5432: PostgreSQL, 6379: Redis, 8080: HTTP alternate, 27017: MongoDB."
            }
        ],
        concepts: [
            { term: "Latency", definition: "Time delay in network communication, measured in milliseconds" },
            { term: "Bandwidth", definition: "Maximum data transfer rate of network connection" },
            { term: "Packet Loss", definition: "Percentage of packets that fail to reach destination" },
            { term: "MTU", definition: "Maximum Transmission Unit - Largest packet size that can be transmitted" }
        ]
    }
];

const NetworkingQuestions = () => {
    return (
        <main className="overflow-x-hidden">
            {/* Header */}
            <section className="py-12 bg-background/80 border-b border-border/50">
                <div className="container mx-auto px-4">
                    <Link to="/interview-prep">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Interview Prep
                        </Button>
                    </Link>

                    <div className="flex flex-col items-center text-center gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className="text-gradient">Networking Interview Questions</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Essential networking concepts and protocols for DevOps interviews
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <Badge variant="outline" className="px-4 py-2 border-primary/30">
                                <Network className="w-4 h-4 mr-2" />
                                40+ Questions
                            </Badge>
                            <Badge variant="outline" className="px-4 py-2 border-primary/30">
                                <Layers className="w-4 h-4 mr-2" />
                                Core Concepts
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* Question Categories */}
            <section className="py-16 bg-background/50">
                <div className="container mx-auto px-4">
                    {networkingCategories.map((category) => (
                        <div key={category.category} className="mb-16 last:mb-0">
                            {/* Category Header */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 rounded-lg bg-primary/10">
                                    <Network className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold text-gradient">{category.category}</h2>
                            </div>

                            {/* Questions */}
                            <div className="space-y-4 mb-8">
                                {category.questions.map((q, idx) => (
                                    <Card key={idx} className="card-gradient border-border/50 p-6">
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="item-1" className="border-none">
                                                <AccordionTrigger className="hover:no-underline">
                                                    <div className="flex items-start gap-3 text-left">
                                                        <HelpCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                                        <span className="font-semibold">{q.question}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="mt-4 pl-8">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Lightbulb className="w-4 h-4 text-primary" />
                                                            <span className="font-semibold text-sm">Answer:</span>
                                                        </div>
                                                        <p className="text-muted-foreground">{q.answer}</p>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </Card>
                                ))}
                            </div>

                            {/* Concepts */}
                            <Card className="card-gradient border-border/50 p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-primary" />
                                    Key Concepts
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {category.concepts.map((concept, idx) => (
                                        <div key={idx} className="border-l-2 border-primary/30 pl-3">
                                            <div className="font-semibold text-sm text-primary">{concept.term}</div>
                                            <div className="text-sm text-muted-foreground mt-1">{concept.definition}</div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background/80 border-t border-border/50 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-muted-foreground">
                        © 2026 Irfan Basha. AWS Certified DevOps Engineer.
                    </p>
                </div>
            </footer>
        </main>
    );
};

export default NetworkingQuestions;
