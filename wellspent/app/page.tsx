import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";

export default async function Home() {
  const session = await getSession();
  
  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-8 py-16">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Happiness Diagnostics
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              WellSpent helps you measure, understand, and enhance your well-being using the 
              science-backed PERMA-V framework developed by Dr. Martin Seligman at the University of Pennsylvania.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {session ? (
              <>
                <Link href="/assessment">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg">
                    Start Assessment
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                    View Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg">
                    Take the Assessment
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* What is PERMA-V */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              The Science of Happiness
            </h2>
            <p className="text-lg text-muted-foreground">
              The PERMA-V model is a comprehensive framework that captures the six essential elements 
              of well-being and flourishing in both personal and professional contexts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-10">
            <div className="bg-card rounded-xl border p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold">Evidence-Based Framework</h3>
              <p className="text-muted-foreground text-lg">
                Built on Dr. Martin Seligman's research, the PERMA-V model has been validated across cultures and contexts as a comprehensive approach to measuring and improving well-being.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold">Changes That Work</h3>
              <p className="text-muted-foreground text-lg">
                Focus on interventions scientifically proven to increase happiness, from building meaningful relationships to finding flow in daily activities and cultivating a sense of purpose.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold">Productivity & Impact</h3>
              <p className="text-muted-foreground text-lg">
                Align your personal values with your work to unlock greater effectiveness. Research shows that people who thrive in both domains experience 31% higher productivity and greater resilience.
              </p>
            </div>
          </div>
        </div>
        
        {/* PERMA-V Explained */}
        <div className="bg-slate-50 rounded-2xl p-10 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">The Six Elements of Contentment</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-green-700">P - Positive Emotions</h3>
                  <p className="text-muted-foreground">Experiencing joy, gratitude, contentment, and other positive feelings that broaden our thinking and build our resources.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-green-700">E - Engagement</h3>
                  <p className="text-muted-foreground">Being fully absorbed in challenging activities that utilize your skills, often leading to a state of "flow."</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-green-700">R - Relationships</h3>
                  <p className="text-muted-foreground">Building and nurturing positive connections with others, feeling supported and valued.</p>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-6 mt-16 md:mt-0">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-green-700">M - Meaning</h3>
                  <p className="text-muted-foreground">Having a sense of purpose and feeling that what you do matters and contributes to something greater than yourself.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-green-700">A - Accomplishment</h3>
                  <p className="text-muted-foreground">Working toward and achieving goals, experiencing mastery and a sense of competence in important areas of your life.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-green-700">V - Vitality</h3>
                  <p className="text-muted-foreground">Having physical and mental energy, feeling alive and vibrant through proper nutrition, exercise, sleep, and stress management.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link href="/assessment">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg">
                Start Your Assessment Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}