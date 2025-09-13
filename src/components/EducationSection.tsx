import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, MapPin, Award, BookOpen } from "lucide-react";

const education = [
  {
    id: 1,
    institution: "Aalim Muhammed Salegh College Of Engineering",
    degree: "Bachelor of Computer Science and Engineering",
    duration: "2021 - 2025",
    location: "Chennai, TamilNadu",
    gpa: "8/10",
    description: "Focused on software engineering, data structures, algorithms, and emerging technologies. Active member of coding club and tech society.",
    coursework: [
      "Data Structures & Algorithms",
      "Database Management Systems", 
      "Cloud Computing Fundamentals",
      "Software Engineering",
      "Operating Systems",
      "Computer Networks"
    ],
    achievements: [
      "Best Project Award for final year capstone",
     
    ],
    status: "Graduated"
  },
  {
    id: 2,
    institution: "Online Learning Platforms",
    degree: "AWS Certified Solutions Architect – Associate ",
    duration: "6 Months",
    location: "Online",
    gpa: "",
    description: "Continuous learning through industry-recognized online courses to build practical skills in DevOps and Data Analytics.",
    coursework: [
      "AWS Certified Solutions Architect – Associate  (Udemy)",
      "Docker & Kubernetes (Udemy)",
      "Python for Data Science (Coursera)",
      "Git & GitHub Masterclass",
      "Linux System Administration",
      "Introduction to DevOps"
    ],
    achievements: [
      "Completed 15+ technical courses",
      "Built 10+ hands-on projects",
      "Contributing to open-source projects"
    ],
    status: "Completed"
  }
];

const certifications = [
  { name: "Python Programming", provider: "Udemy", year: "2024", status: "completed" },
  { name: "Git & GitHub", provider: "Great Learning ", year: "2024", status: "completed" },
  { name: "AWS Certified Solutions Architect – Associate", provider: "AWS", year: "2025", status: "completed" },
  { name: "Google Data Analytics Professional Certificate", provider: "Coursera", year: "2025", status: "Completed" }
];

export const EducationSection = () => {
  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Education & Learning</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Continuous learning journey through formal education and self-directed skill development
          </p>
        </div>

        {/* Education Timeline */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-tech-accent to-data-viz opacity-30"></div>

            <div className="space-y-12">
              {education.map((edu, index) => (
                <div 
                  key={edu.id} 
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${index * 300}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background glow-effect"></div>
                  
                  <div className="ml-20">
                    <Card className="card-gradient border-border/50 p-8 hover:scale-[1.02] transition-all duration-300">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <GraduationCap className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-semibold text-card-foreground">{edu.institution}</h3>
                            <Badge 
                              className={
                                edu.status === "Graduated" 
                                  ? "bg-success/10 text-success border-success/20" 
                                  : "bg-warning/10 text-warning border-warning/20"
                              }
                            >
                              {edu.status}
                            </Badge>
                          </div>
                          
                          <h4 className="text-lg font-medium text-tech-accent mb-2">{edu.degree}</h4>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {edu.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {edu.location}
                            </div>
                            {edu.gpa && (
                              <div className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                GPA: {edu.gpa}
                              </div>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mb-6 leading-relaxed">{edu.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Key Coursework
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {edu.coursework.map((course) => (
                                  <Badge key={course} variant="outline" className="text-xs border-primary/30 text-primary">
                                    {course}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Achievements
                              </h5>
                              <ul className="space-y-1">
                                {edu.achievements.map((achievement, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8 text-gradient">Certifications & Courses</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <Card 
                key={cert.name}
                className="card-gradient border-border/50 p-4 text-center hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-2">
                  <Badge 
                    variant="outline" 
                    className={
                      cert.status === "completed"
                        ? "border-success/30 text-success"
                        : "border-warning/30 text-warning"
                    }
                  >
                    {cert.status === "completed" ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <h4 className="font-medium text-card-foreground mb-1">{cert.name}</h4>
                <p className="text-sm text-muted-foreground">{cert.provider}</p>
                <p className="text-xs text-primary mt-1">{cert.year}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};