import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Terminal, HelpCircle, Lightbulb, Code2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface QuestionCategory {
    category: string;
    icon: any;
    color: string;
    questions: {
        question: string;
        answer: string;
        command?: string;
    }[];
    concepts: { term: string; definition: string }[];
}

const linuxCategories: QuestionCategory[] = [
    {
        category: "File System & Permissions",
        icon: Terminal,
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        questions: [
            {
                question: "What is the difference between absolute and relative paths?",
                answer: "Absolute path starts from root directory (/) and specifies complete path (e.g., /home/user/file.txt). Relative path starts from current directory (e.g., ../file.txt or ./folder/file.txt).",
                command: "pwd  # Print working directory\ncd /home/user  # Absolute path\ncd ../documents  # Relative path"
            },
            {
                question: "Explain Linux file permissions (rwx)",
                answer: "Three permission types: Read (r=4), Write (w=2), Execute (x=1). Three user categories: Owner, Group, Others. Example: rwxr-xr-- means owner has all permissions (7), group can read/execute (5), others can only read (4).",
                command: "ls -l  # View permissions\nchmod 755 file.sh  # rwxr-xr-x\nchmod u+x file.sh  # Add execute for owner\nchown user:group file.txt  # Change ownership"
            },
            {
                question: "What is the difference between hard link and soft link (symbolic link)?",
                answer: "Hard link: Points directly to inode, same data, deleting original doesn't affect link. Soft link: Points to filename, like a shortcut, breaks if original is deleted. Hard links can't cross filesystems or link directories.",
                command: "ln file.txt hardlink.txt  # Hard link\nln -s file.txt softlink.txt  # Soft link\nls -li  # View inodes"
            },
            {
                question: "How do you find files in Linux?",
                answer: "Use 'find' for comprehensive search with various criteria, 'locate' for fast filename search using database, 'which' for executables in PATH, 'whereis' for binaries/man pages.",
                command: "find /path -name \"*.log\"  # By name\nfind /path -type f -mtime -7  # Modified in last 7 days\nfind /path -size +100M  # Larger than 100MB\nlocate filename  # Fast search\nwhich python  # Find executable"
            },
            {
                question: "What is umask and how does it work?",
                answer: "Umask sets default permissions for newly created files and directories by subtracting from maximum permissions. Default file max is 666, directory max is 777. Umask 022 results in 644 for files (666-022) and 755 for directories (777-022).",
                command: "umask  # View current umask\numask 022  # Set umask\numask -S  # Symbolic notation"
            }
        ],
        concepts: [
            { term: "Inode", definition: "Data structure storing file metadata (permissions, ownership, timestamps, location) but not filename" },
            { term: "Mount Point", definition: "Directory where a filesystem is attached to the directory tree" },
            { term: "Root Directory", definition: "Top-level directory (/) in Linux filesystem hierarchy" },
            { term: "Home Directory", definition: "User's personal directory, typically /home/username, represented by ~" }
        ]
    },
    {
        category: "Process Management",
        icon: Terminal,
        color: "bg-green-500/10 text-green-500 border-green-500/20",
        questions: [
            {
                question: "What is the difference between a process and a thread?",
                answer: "Process: Independent program with own memory space, resources, and PID. Thread: Lightweight execution unit within a process, shares memory and resources. Multiple threads in one process can run concurrently.",
                command: "ps aux  # View all processes\ntop  # Interactive process viewer\nhtop  # Enhanced process viewer"
            },
            {
                question: "How do you kill a process in Linux?",
                answer: "Use kill command with signal. SIGTERM (15) gracefully terminates, SIGKILL (9) forcefully kills. Use killall for name, pkill for pattern matching.",
                command: "kill PID  # Send SIGTERM\nkill -9 PID  # Send SIGKILL (force)\nkillall process_name  # Kill by name\npkill -f pattern  # Kill by pattern"
            },
            {
                question: "What are zombie and orphan processes?",
                answer: "Zombie: Terminated process whose parent hasn't read exit status, shows as <defunct>. Orphan: Process whose parent terminated, adopted by init/systemd (PID 1). Zombies don't consume resources except PID entry.",
                command: "ps aux | grep defunct  # Find zombies\nps -elf | awk '$5 == 1'  # Find orphans"
            },
            {
                question: "Explain process states in Linux",
                answer: "Running (R): Executing or ready to run. Sleeping (S): Waiting for event, interruptible. Uninterruptible Sleep (D): Waiting for I/O. Stopped (T): Suspended by signal. Zombie (Z): Terminated, waiting for parent.",
                command: "ps aux  # S column shows state\ntop  # Shows process states"
            },
            {
                question: "What is nice and renice? How do you change process priority?",
                answer: "Nice value (-20 to 19) determines process priority. Lower nice = higher priority. Default is 0. Only root can decrease nice value (increase priority). Renice changes priority of running process.",
                command: "nice -n 10 command  # Start with nice 10\nrenice -n 5 -p PID  # Change priority\ntop  # Press 'r' to renice"
            },
            {
                question: "How do you run a process in background?",
                answer: "Append & to command for background execution. Use nohup to keep running after logout. Use disown to detach from shell. Ctrl+Z suspends, bg resumes in background.",
                command: "command &  # Run in background\nnohup command &  # Immune to hangup\njobs  # List background jobs\nfg %1  # Bring job 1 to foreground\nbg %1  # Resume job 1 in background"
            }
        ],
        concepts: [
            { term: "PID", definition: "Process ID - Unique identifier assigned to each running process" },
            { term: "PPID", definition: "Parent Process ID - PID of the process that created this process" },
            { term: "Daemon", definition: "Background process that runs continuously, typically started at boot" },
            { term: "Signal", definition: "Software interrupt sent to process to trigger specific action (SIGTERM, SIGKILL, etc.)" }
        ]
    },
    {
        category: "Networking Commands",
        icon: Terminal,
        color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        questions: [
            {
                question: "How do you check network connectivity in Linux?",
                answer: "Use ping for basic connectivity, traceroute/tracepath for route tracing, telnet/nc for port checking, curl/wget for HTTP testing.",
                command: "ping -c 4 google.com  # Send 4 packets\ntraceroute google.com  # Trace route\ntelnet host 80  # Test port\nnc -zv host 22  # Check if port is open\ncurl -I https://example.com  # HTTP headers"
            },
            {
                question: "What is the difference between netstat and ss?",
                answer: "Both show network connections and listening ports. ss is newer, faster, and provides more information. netstat is older but more widely known. ss is recommended for modern systems.",
                command: "netstat -tuln  # TCP/UDP listening ports\nss -tuln  # Same with ss (faster)\nss -s  # Summary statistics\nnetstat -r  # Routing table"
            },
            {
                question: "How do you check open ports and listening services?",
                answer: "Use ss, netstat, or lsof to check listening ports. nmap for port scanning. Each shows which process is listening on which port.",
                command: "ss -tuln  # Listening ports\nlsof -i :80  # What's using port 80\nnmap localhost  # Scan ports\nsudo netstat -tulpn  # With process names"
            },
            {
                question: "How do you configure network interfaces?",
                answer: "Use ip command (modern) or ifconfig (legacy). Configure via /etc/network/interfaces (Debian) or NetworkManager/nmcli. Temporary changes with ip, permanent via config files.",
                command: "ip addr show  # Show IP addresses\nip link set eth0 up  # Enable interface\nip addr add 192.168.1.10/24 dev eth0  # Add IP\nifconfig eth0  # Legacy command\nnmcli device status  # NetworkManager"
            },
            {
                question: "How do you troubleshoot DNS issues?",
                answer: "Use nslookup, dig, or host for DNS queries. Check /etc/resolv.conf for DNS servers. Use ping with hostname to verify resolution. Check /etc/hosts for local overrides.",
                command: "nslookup google.com  # Query DNS\ndig google.com  # Detailed DNS info\nhost google.com  # Simple lookup\ncat /etc/resolv.conf  # DNS servers\ncat /etc/hosts  # Local DNS entries"
            }
        ],
        concepts: [
            { term: "TCP", definition: "Transmission Control Protocol - Reliable, connection-oriented protocol" },
            { term: "UDP", definition: "User Datagram Protocol - Connectionless, faster but unreliable protocol" },
            { term: "Port", definition: "Logical endpoint for network communication (0-65535)" },
            { term: "Socket", definition: "Combination of IP address and port number" }
        ]
    },
    {
        category: "Package Management",
        icon: Terminal,
        color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        questions: [
            {
                question: "What is the difference between apt and apt-get?",
                answer: "apt is newer, user-friendly command combining apt-get and apt-cache features. apt has progress bar, colored output, and cleaner interface. apt-get is more stable for scripting. Both use same package database.",
                command: "apt update  # Update package list\napt upgrade  # Upgrade packages\napt install package  # Install\napt remove package  # Remove\napt search keyword  # Search packages"
            },
            {
                question: "How do you manage packages in RHEL/CentOS?",
                answer: "Use yum (older) or dnf (newer, faster). Both manage RPM packages. dnf resolves dependencies better and has improved performance. Commands are similar between yum and dnf.",
                command: "dnf update  # Update all packages\ndnf install package  # Install package\ndnf remove package  # Remove package\ndnf search keyword  # Search\nrpm -qa  # List installed packages"
            },
            {
                question: "How do you check if a package is installed?",
                answer: "Use package manager query commands. dpkg for Debian-based, rpm for RHEL-based. Can also use which/whereis for executables.",
                command: "dpkg -l | grep package  # Debian/Ubuntu\nrpm -qa | grep package  # RHEL/CentOS\napt list --installed | grep package\nwhich command  # Find executable"
            },
            {
                question: "How do you install packages from source?",
                answer: "Download source, extract, configure, compile, and install. Typical process: ./configure, make, make install. May need build dependencies. Not recommended if package available in repository.",
                command: "tar -xzf package.tar.gz\ncd package\n./configure\nmake\nsudo make install"
            }
        ],
        concepts: [
            { term: "Repository", definition: "Server containing packages and metadata for package manager" },
            { term: "Dependency", definition: "Package required by another package to function properly" },
            { term: "RPM", definition: "Red Hat Package Manager - Package format for RHEL-based systems" },
            { term: "DEB", definition: "Debian package format used by Debian and Ubuntu" }
        ]
    },
    {
        category: "System Monitoring & Performance",
        icon: Terminal,
        color: "bg-red-500/10 text-red-500 border-red-500/20",
        questions: [
            {
                question: "How do you check system resource usage?",
                answer: "Use top/htop for real-time monitoring, free for memory, df for disk space, iostat for I/O, vmstat for virtual memory statistics.",
                command: "top  # CPU and memory usage\nhtop  # Enhanced top\nfree -h  # Memory usage\ndf -h  # Disk space\ndu -sh /path  # Directory size\niostat  # I/O statistics"
            },
            {
                question: "How do you check CPU usage and load average?",
                answer: "Load average shows system load over 1, 5, and 15 minutes. Value of 1.0 means one CPU fully utilized. Use uptime, top, or /proc/loadavg. High load indicates CPU saturation or I/O wait.",
                command: "uptime  # Load average\ntop  # Press '1' for per-CPU\nmpstat  # CPU statistics\ncat /proc/loadavg"
            },
            {
                question: "How do you check memory usage and identify memory leaks?",
                answer: "Use free for overview, top/htop for per-process memory. Check /proc/meminfo for details. Monitor process memory over time to identify leaks. Use valgrind for application-level leak detection.",
                command: "free -h  # Human readable\ntop  # Sort by memory (Shift+M)\ncat /proc/meminfo  # Detailed info\nps aux --sort=-%mem | head  # Top memory users"
            },
            {
                question: "How do you check disk I/O performance?",
                answer: "Use iostat for I/O statistics, iotop for per-process I/O, hdparm for drive info. High %util indicates I/O bottleneck. Check await time for latency.",
                command: "iostat -x 1  # Extended stats every 1s\niotop  # Interactive I/O monitor\nhdparm -tT /dev/sda  # Disk speed test\ndd if=/dev/zero of=test bs=1M count=1000  # Write test"
            },
            {
                question: "How do you analyze system logs?",
                answer: "Use journalctl for systemd logs, tail/grep for traditional logs in /var/log. dmesg for kernel messages. Log rotation managed by logrotate.",
                command: "journalctl -xe  # Recent logs with explanation\njournalctl -u service  # Service logs\ntail -f /var/log/syslog  # Follow log\ngrep ERROR /var/log/app.log  # Search logs\ndmesg | tail  # Kernel messages"
            }
        ],
        concepts: [
            { term: "Load Average", definition: "Average number of processes in runnable or uninterruptible state" },
            { term: "Swap", definition: "Disk space used as virtual memory when RAM is full" },
            { term: "Inode Usage", definition: "Number of inodes (file metadata structures) used vs available" },
            { term: "Buffer/Cache", definition: "Memory used by kernel for caching disk data, can be freed if needed" }
        ]
    },
    {
        category: "User & Group Management",
        icon: Terminal,
        color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
        questions: [
            {
                question: "How do you create and manage users in Linux?",
                answer: "Use useradd to create users, usermod to modify, userdel to delete. Set passwords with passwd. User info stored in /etc/passwd, passwords in /etc/shadow.",
                command: "sudo useradd -m -s /bin/bash username  # Create user\nsudo passwd username  # Set password\nsudo usermod -aG sudo username  # Add to group\nsudo userdel -r username  # Delete with home dir"
            },
            {
                question: "What is sudo and how does it work?",
                answer: "Sudo allows users to run commands with root privileges. Configured in /etc/sudoers (edit with visudo). Can grant specific commands to specific users/groups. Logs all sudo usage.",
                command: "sudo command  # Run as root\nsudo -u user command  # Run as specific user\nsudo -i  # Interactive root shell\nvisudo  # Edit sudoers safely"
            },
            {
                question: "How do you manage groups?",
                answer: "Use groupadd to create, groupmod to modify, groupdel to delete. Add users to groups with usermod -aG or gpasswd -a. Groups defined in /etc/group.",
                command: "sudo groupadd developers  # Create group\nsudo usermod -aG developers user  # Add user\nsudo gpasswd -d user developers  # Remove user\ngroups username  # Show user's groups"
            },
            {
                question: "What is the difference between /etc/passwd and /etc/shadow?",
                answer: "/etc/passwd contains user account info (username, UID, GID, home, shell), readable by all. /etc/shadow contains encrypted passwords and password policies, readable only by root for security.",
                command: "cat /etc/passwd  # User accounts\nsudo cat /etc/shadow  # Password hashes\ngetent passwd username  # Query user info"
            }
        ],
        concepts: [
            { term: "UID", definition: "User ID - Unique numeric identifier for each user (0 for root)" },
            { term: "GID", definition: "Group ID - Unique numeric identifier for each group" },
            { term: "Primary Group", definition: "Default group for user, specified in /etc/passwd" },
            { term: "Supplementary Groups", definition: "Additional groups user belongs to" }
        ]
    }
];

const LinuxQuestions = () => {
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
                                <span className="text-gradient">Linux Interview Questions</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Comprehensive Linux system administration questions with detailed answers and command examples
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <Badge variant="outline" className="px-4 py-2 border-primary/30">
                                <Terminal className="w-4 h-4 mr-2" />
                                50+ Questions
                            </Badge>
                            <Badge variant="outline" className="px-4 py-2 border-primary/30">
                                <Code2 className="w-4 h-4 mr-2" />
                                Command Examples
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* Question Categories */}
            <section className="py-16 bg-background/50">
                <div className="container mx-auto px-4">
                    {linuxCategories.map((category) => {
                        const CategoryIcon = category.icon;
                        return (
                            <div key={category.category} className="mb-16 last:mb-0">
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className={`p-3 rounded-lg ${category.color}`}>
                                        <CategoryIcon className="w-6 h-6" />
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
                                                        <div className="space-y-4 mt-4 pl-8">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Lightbulb className="w-4 h-4 text-primary" />
                                                                    <span className="font-semibold text-sm">Answer:</span>
                                                                </div>
                                                                <p className="text-muted-foreground">{q.answer}</p>
                                                            </div>

                                                            {q.command && (
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Code2 className="w-4 h-4 text-primary" />
                                                                        <span className="font-semibold text-sm">Commands:</span>
                                                                    </div>
                                                                    <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
                                                                        <code className="text-sm">{q.command}</code>
                                                                    </pre>
                                                                </div>
                                                            )}
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
                        );
                    })}
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-16 bg-background/80 border-t border-border/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gradient">Linux Interview Tips</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="p-6 card-gradient border-border/50">
                                <AlertCircle className="w-8 h-8 text-primary mb-3" />
                                <h3 className="font-bold mb-2">Practice Commands</h3>
                                <p className="text-sm text-muted-foreground">
                                    Set up a Linux VM and practice all commands hands-on. Understanding is better than memorization.
                                </p>
                            </Card>
                            <Card className="p-6 card-gradient border-border/50">
                                <Terminal className="w-8 h-8 text-primary mb-3" />
                                <h3 className="font-bold mb-2">Explain Your Thinking</h3>
                                <p className="text-sm text-muted-foreground">
                                    When answering, explain your troubleshooting approach and why you chose specific commands.
                                </p>
                            </Card>
                        </div>
                    </div>
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

export default LinuxQuestions;
