import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Users, HelpCircle, Lightbulb, Target, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface BehavioralCategory {
    category: string;
    icon: any;
    color: string;
    questions: {
        question: string;
        starExample: {
            situation: string;
            task: string;
            action: string;
            result: string;
        };
        tips: string[];
    }[];
}

const behavioralCategories: BehavioralCategory[] = [
    {
        category: "Teamwork & Collaboration",
        icon: Users,
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        questions: [
            {
                question: "Tell me about a time you worked on a team project",
                starExample: {
                    situation: "During my final year project, I was part of a 4-member team building a DevOps automation platform",
                    task: "I was responsible for implementing the CI/CD pipeline while coordinating with team members working on infrastructure and monitoring",
                    action: "I set up daily standups, created a shared documentation wiki, implemented Jenkins pipelines, and helped teammates troubleshoot Docker issues",
                    result: "We delivered the project 2 weeks early with all features working. The pipeline reduced deployment time from 2 hours to 15 minutes"
                },
                tips: [
                    "Emphasize communication and collaboration",
                    "Show how you contributed to team success",
                    "Mention specific tools or processes you used",
                    "Highlight positive outcomes for the team"
                ]
            },
            {
                question: "Describe a time when you had a conflict with a team member",
                starExample: {
                    situation: "A teammate and I disagreed on whether to use Docker Compose or Kubernetes for our project",
                    task: "We needed to choose a container orchestration solution that fit our project scope and timeline",
                    action: "I scheduled a meeting to discuss pros/cons, created a comparison matrix, and we agreed to start with Docker Compose for simplicity and migrate to K8s later if needed",
                    result: "We completed the project on time, maintained good relationship, and learned to make data-driven decisions together"
                },
                tips: [
                    "Show maturity in handling disagreements",
                    "Focus on the resolution, not the conflict",
                    "Demonstrate active listening and compromise",
                    "Emphasize maintaining professional relationships"
                ]
            }
        ]
    },
    {
        category: "Problem Solving & Technical Challenges",
        icon: Target,
        color: "bg-green-500/10 text-green-500 border-green-500/20",
        questions: [
            {
                question: "Tell me about a challenging technical problem you solved",
                starExample: {
                    situation: "Our application deployment was failing intermittently in production, affecting user experience",
                    task: "I needed to identify the root cause and implement a permanent fix",
                    action: "I analyzed logs, discovered a race condition in the startup script, implemented health checks, added retry logic, and documented the fix",
                    result: "Deployment success rate improved from 70% to 99%. Documented solution helped team avoid similar issues"
                },
                tips: [
                    "Explain your troubleshooting methodology",
                    "Show systematic problem-solving approach",
                    "Mention tools and techniques used",
                    "Quantify the impact of your solution"
                ]
            },
            {
                question: "Describe a time when you had to learn a new technology quickly",
                starExample: {
                    situation: "My team needed to migrate from Jenkins to GitHub Actions within 2 weeks",
                    task: "I had no prior experience with GitHub Actions but was assigned to lead the migration",
                    action: "I completed online tutorials, read documentation, created POC workflows, tested thoroughly, and trained team members",
                    result: "Successfully migrated 15 pipelines in 10 days. Team adopted GitHub Actions smoothly with 30% faster build times"
                },
                tips: [
                    "Show your learning agility",
                    "Mention resources you used (docs, courses, mentors)",
                    "Demonstrate practical application of new knowledge",
                    "Highlight successful outcomes"
                ]
            },
            {
                question: "Tell me about a time when you made a mistake",
                starExample: {
                    situation: "I accidentally deleted a test database while practicing kubectl commands",
                    task: "I needed to recover the data and prevent future accidents",
                    action: "I immediately informed my supervisor, restored from backup, implemented RBAC restrictions, and created a pre-production checklist",
                    result: "Data recovered within 30 minutes. Implemented safeguards prevented similar incidents. Learned the importance of double-checking commands"
                },
                tips: [
                    "Be honest but choose a learning experience",
                    "Focus on what you learned",
                    "Show accountability and ownership",
                    "Explain preventive measures you implemented"
                ]
            }
        ]
    },
    {
        category: "Leadership & Initiative",
        icon: Target,
        color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        questions: [
            {
                question: "Describe a time when you took initiative",
                starExample: {
                    situation: "I noticed our team was manually deploying applications, which was time-consuming and error-prone",
                    task: "Although not assigned, I wanted to improve our deployment process",
                    action: "I researched CI/CD tools, created a proof-of-concept Jenkins pipeline, presented benefits to the team, and implemented it after approval",
                    result: "Reduced deployment time by 80%, eliminated human errors, and the solution was adopted across other teams"
                },
                tips: [
                    "Show proactive behavior",
                    "Demonstrate ownership beyond assigned tasks",
                    "Explain the business value you created",
                    "Mention stakeholder buy-in if applicable"
                ]
            },
            {
                question: "Tell me about a time you mentored or helped someone",
                starExample: {
                    situation: "A junior team member was struggling with Docker concepts and containerization",
                    task: "I wanted to help them become productive and confident with Docker",
                    action: "I created a hands-on tutorial, scheduled weekly pair programming sessions, shared resources, and reviewed their work",
                    result: "They successfully containerized 3 applications independently within a month and became the go-to person for Docker questions"
                },
                tips: [
                    "Show patience and teaching ability",
                    "Demonstrate knowledge sharing",
                    "Highlight the growth of the person you helped",
                    "Show your communication skills"
                ]
            }
        ]
    },
    {
        category: "Time Management & Priorities",
        icon: Target,
        color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        questions: [
            {
                question: "Tell me about a time you had to manage multiple priorities",
                starExample: {
                    situation: "I had to complete a project deadline, fix a production bug, and prepare for an exam in the same week",
                    task: "I needed to balance all responsibilities without compromising quality",
                    action: "I created a priority matrix, fixed the critical bug first (2 hours), scheduled focused project work (mornings), and studied in evenings. Communicated timeline to stakeholders",
                    result: "Fixed bug within SLA, submitted project on time, and scored 85% on exam. Learned effective time management"
                },
                tips: [
                    "Show your prioritization framework",
                    "Demonstrate time management skills",
                    "Mention communication with stakeholders",
                    "Explain how you handled stress"
                ]
            },
            {
                question: "Describe a time when you missed a deadline",
                starExample: {
                    situation: "I underestimated the complexity of setting up a Kubernetes cluster and missed the initial deadline",
                    task: "I needed to complete the setup and regain stakeholder trust",
                    action: "I immediately communicated the delay, provided revised timeline with buffer, worked extra hours, and delivered with comprehensive documentation",
                    result: "Completed setup 3 days late but with better quality. Learned to add buffers and communicate early. Stakeholders appreciated transparency"
                },
                tips: [
                    "Be honest about the situation",
                    "Show accountability and communication",
                    "Focus on recovery and lessons learned",
                    "Demonstrate improved planning skills"
                ]
            }
        ]
    },
    {
        category: "Adaptability & Change",
        icon: Target,
        color: "bg-red-500/10 text-red-500 border-red-500/20",
        questions: [
            {
                question: "Tell me about a time you had to adapt to a significant change",
                starExample: {
                    situation: "My team suddenly switched from AWS to Azure mid-project due to company policy",
                    task: "I needed to quickly adapt and ensure project continuity",
                    action: "I took Azure fundamentals course, mapped AWS services to Azure equivalents, updated architecture diagrams, and re-implemented infrastructure",
                    result: "Successfully migrated in 2 weeks. Gained multi-cloud experience. Project delivered only 1 week behind original schedule"
                },
                tips: [
                    "Show flexibility and resilience",
                    "Demonstrate positive attitude toward change",
                    "Explain how you managed the transition",
                    "Highlight skills gained from the experience"
                ]
            }
        ]
    },
    {
        category: "Communication & Stakeholder Management",
        icon: MessageSquare,
        color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
        questions: [
            {
                question: "Describe a time when you had to explain a technical concept to a non-technical person",
                starExample: {
                    situation: "I needed to explain our CI/CD pipeline to the marketing team who wanted to understand deployment process",
                    task: "Make them understand the value and process without technical jargon",
                    action: "I used an assembly line analogy, created visual diagrams, demonstrated with a simple example, and answered questions patiently",
                    result: "They understood the process, appreciated automation benefits, and became advocates for DevOps practices"
                },
                tips: [
                    "Show ability to simplify complex topics",
                    "Use analogies and visual aids",
                    "Demonstrate patience and clarity",
                    "Tailor communication to audience"
                ]
            },
            {
                question: "Tell me about a time you received constructive criticism",
                starExample: {
                    situation: "My supervisor told me my documentation was too technical and hard for others to follow",
                    task: "I needed to improve my documentation skills",
                    action: "I asked for specific examples, studied good documentation practices, started using templates, and requested feedback on improvements",
                    result: "My documentation became team standard. Received positive feedback. Learned the importance of writing for the audience"
                },
                tips: [
                    "Show openness to feedback",
                    "Demonstrate growth mindset",
                    "Explain specific improvements made",
                    "Show appreciation for feedback"
                ]
            }
        ]
    }
];

const BehavioralQuestions = () => {
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
                                <span className="text-gradient">Behavioral Interview Questions</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Master the STAR method with example answers for common behavioral questions
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <Badge variant="outline" className="px-4 py-2 border-primary/30">
                                <Users className="w-4 h-4 mr-2" />
                                15+ Questions
                            </Badge>
                            <Badge variant="outline" className="px-4 py-2 border-primary/30">
                                <Target className="w-4 h-4 mr-2" />
                                STAR Method
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* STAR Method Explanation */}
            <section className="py-12 bg-background/50">
                <div className="container mx-auto px-4">
                    <Card className="max-w-4xl mx-auto card-gradient border-border/50 p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gradient">The STAR Method</h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            <div>
                                <div className="font-bold text-primary mb-2">S - Situation</div>
                                <p className="text-sm text-muted-foreground">Set the context and background</p>
                            </div>
                            <div>
                                <div className="font-bold text-primary mb-2">T - Task</div>
                                <p className="text-sm text-muted-foreground">Describe your responsibility</p>
                            </div>
                            <div>
                                <div className="font-bold text-primary mb-2">A - Action</div>
                                <p className="text-sm text-muted-foreground">Explain what you did</p>
                            </div>
                            <div>
                                <div className="font-bold text-primary mb-2">R - Result</div>
                                <p className="text-sm text-muted-foreground">Share the outcome</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Question Categories */}
            <section className="py-16 bg-background/50">
                <div className="container mx-auto px-4">
                    {behavioralCategories.map((category) => {
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
                                <div className="space-y-6">
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
                                                        <div className="space-y-6 mt-4 pl-8">
                                                            {/* STAR Example */}
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <Target className="w-4 h-4 text-primary" />
                                                                    <span className="font-semibold text-sm">STAR Example Answer:</span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <div className="border-l-2 border-blue-500/50 pl-4">
                                                                        <div className="font-semibold text-sm text-blue-500">Situation</div>
                                                                        <p className="text-sm text-muted-foreground mt-1">{q.starExample.situation}</p>
                                                                    </div>
                                                                    <div className="border-l-2 border-green-500/50 pl-4">
                                                                        <div className="font-semibold text-sm text-green-500">Task</div>
                                                                        <p className="text-sm text-muted-foreground mt-1">{q.starExample.task}</p>
                                                                    </div>
                                                                    <div className="border-l-2 border-purple-500/50 pl-4">
                                                                        <div className="font-semibold text-sm text-purple-500">Action</div>
                                                                        <p className="text-sm text-muted-foreground mt-1">{q.starExample.action}</p>
                                                                    </div>
                                                                    <div className="border-l-2 border-orange-500/50 pl-4">
                                                                        <div className="font-semibold text-sm text-orange-500">Result</div>
                                                                        <p className="text-sm text-muted-foreground mt-1">{q.starExample.result}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Tips */}
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Lightbulb className="w-4 h-4 text-primary" />
                                                                    <span className="font-semibold text-sm">Tips for Answering:</span>
                                                                </div>
                                                                <ul className="space-y-2">
                                                                    {q.tips.map((tip, tipIdx) => (
                                                                        <li key={tipIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                                                                            <span className="text-primary mt-1">•</span>
                                                                            <span>{tip}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* General Tips */}
            <section className="py-16 bg-background/80 border-t border-border/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gradient">General Interview Tips</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="p-6 card-gradient border-border/50">
                                <h3 className="font-bold mb-2">Be Specific</h3>
                                <p className="text-sm text-muted-foreground">
                                    Use concrete examples with numbers, timelines, and measurable outcomes
                                </p>
                            </Card>
                            <Card className="p-6 card-gradient border-border/50">
                                <h3 className="font-bold mb-2">Be Honest</h3>
                                <p className="text-sm text-muted-foreground">
                                    Choose real experiences. Authenticity shows through and builds trust
                                </p>
                            </Card>
                            <Card className="p-6 card-gradient border-border/50">
                                <h3 className="font-bold mb-2">Practice Out Loud</h3>
                                <p className="text-sm text-muted-foreground">
                                    Rehearse your answers to sound natural and confident during the interview
                                </p>
                            </Card>
                            <Card className="p-6 card-gradient border-border/50">
                                <h3 className="font-bold mb-2">Focus on Learning</h3>
                                <p className="text-sm text-muted-foreground">
                                    Even in failure stories, emphasize what you learned and how you grew
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

export default BehavioralQuestions;
