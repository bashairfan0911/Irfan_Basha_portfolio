import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

export const ProfessionalSummary = () => {
  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Professional Summary</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="card-gradient border-border/50 p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Fresh graduate with a strong foundation in DevOps practices, cloud computing, and data analytics. 
                  Passionate about automation, infrastructure as code, and building scalable solutions. 
                  AWS Certified Solutions Architect with hands-on experience in containerization, CI/CD pipelines, 
                  and cloud infrastructure management. Eager to contribute to innovative projects and grow in a 
                  dynamic technology environment.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
