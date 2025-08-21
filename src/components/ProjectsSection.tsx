import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, TrendingUp, Shield, Database, Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const projects = [
  {
    id: 1,
    title: "Personal Portfolio Website",
    description: "Built a responsive portfolio website using React, TypeScript, and Tailwind CSS with modern animations and dark theme. Deployed on Vercel with continuous deployment.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vercel", "Git"],
    metrics: ["Responsive Design", "SEO Optimized", "Fast Loading"],
    icon: Cloud,
    status: "Live",
    link: "#",
    github: "https://github.com/bashairfan0911/professional_portfolio"
  },
  {
    id: 2,
    title: "Student Grade Analytics Dashboard",
    description: "Created a Python-based data analysis project that processes student performance data and generates interactive visualizations to identify learning trends.",
    technologies: ["Python", "Pandas", "Matplotlib", "Jupyter", "CSV"],
    metrics: ["500+ records analyzed", "Interactive charts", "PDF reports"],
    icon: Database,
    status: "Complete",
    link: "#",
    github: "https://github.com/bashairfan0911/student-grade-analytics"
  },
  {
    id: 3,
    title: "Dockerized Web Application",
    description: "Containerized a simple web application using Docker, learned about multi-stage builds, and practiced container orchestration fundamentals.",
    technologies: ["Docker", "Node.js", "HTML/CSS", "Docker Compose", "GitHub"],
    metrics: ["Multi-container setup", "Optimized images", "Easy deployment"],
    icon: Shield,
    status: "Learning",
    link: "#",
    github: "https://github.com/bashairfan0911/dockerized-web-app"
  },
  {
    id: 4,
    title: "Weather Data Collector",
    description: "Built a Python script that collects weather data from APIs, stores it in a database, and creates basic visualizations for trend analysis.",
    technologies: ["Python", "REST APIs", "SQLite", "Requests", "Matplotlib"],
    metrics: ["Real-time data", "7-day history", "Automated collection"],
    icon: TrendingUp,
    status: "Complete",
    link: "#",
    github: "https://github.com/bashairfan0911/weather-data-collector"
  }
];

export const ProjectsSection = () => {
  const navigate = useNavigate();

  const handleViewDetails = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <section className="py-20 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Personal Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hands-on learning projects that demonstrate my growing skills and passion for technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <Card 
                key={project.id} 
                className="card-gradient border-border/50 p-8 group hover:scale-[1.02] transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-card-foreground">{project.title}</h3>
                      <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
                  {project.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-lg font-bold text-primary">{metric.split(' ')[0]}</div>
                      <div className="text-xs text-muted-foreground">{metric.split(' ').slice(1).join(' ')}</div>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleViewDetails(project.id)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      <Github className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
