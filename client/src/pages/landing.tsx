import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Shield, Globe, Code, Bot, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">WorkBindr 2.0</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              variant="outline"
            >
              Sign in with Replit
            </Button>
            <Button 
              onClick={() => window.location.href = '/api/auth/google'}
              className="bg-primary hover:bg-primary/90"
            >
              Sign in with Google
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          🚀 Decentralized Business Platform
        </Badge>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          End SaaS Fatigue Forever
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          WorkBindr 2.0 unifies all your business tools into one decentralized platform. 
          Build, discover, and monetize micro-applications while maintaining complete data ownership.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/auth/google'}
            className="bg-primary hover:bg-primary/90"
          >
            Get Started with Google <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Sign in with Replit
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose WorkBindr 2.0?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of business productivity with AI-powered workflows and blockchain security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Intelligent automation with GPT-4o, Claude, and Gemini integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Multi-LLM support for diverse tasks</li>
                <li>• Business insights generation</li>
                <li>• Workflow automation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle>Micro-Apps Ecosystem</CardTitle>
              <CardDescription>
                Build and monetize custom business applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Project management tools</li>
                <li>• Donor management system</li>
                <li>• Web3 governance voting</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle>Blockchain Security</CardTitle>
              <CardDescription>
                Decentralized architecture with reputation scoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Data ownership control</li>
                <li>• Transparent transactions</li>
                <li>• Reputation-based governance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle>Developer Portal</CardTitle>
              <CardDescription>
                Comprehensive tools for building and integrating
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• API documentation</li>
                <li>• SDK libraries</li>
                <li>• Integration guides</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Connect with developers and business leaders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Collaborative development</li>
                <li>• Knowledge sharing</li>
                <li>• Revenue sharing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <CardTitle>Real-time Analytics</CardTitle>
              <CardDescription>
                Monitor performance with live dashboards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Transaction tracking</li>
                <li>• Usage analytics</li>
                <li>• Performance metrics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses already using WorkBindr 2.0 to streamline their operations.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => window.location.href = '/api/auth/google'}
              >
                Start with Google <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = '/api/login'}
                className="bg-white text-primary border-white hover:bg-gray-100"
              >
                Sign in with Replit
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 WorkBindr 2.0. Built for the decentralized future.</p>
        </div>
      </footer>
    </div>
  );
}