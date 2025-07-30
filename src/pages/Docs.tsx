import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Code, 
  Zap, 
  Shield, 
  ChevronRight,
  FileText,
  Wrench,
  Globe,
  Key
} from 'lucide-react';

const Docs = () => {
  const [selectedSection, setSelectedSection] = useState('getting-started');

  const navigationSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      items: [
        'Quick Start Guide',
        'Authentication Setup',
        'First Integration',
        'Testing Environment'
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      items: [
        'Authentication API',
        'Access Control API',
        'Payment API',
        'Webhook API'
      ]
    },
    {
      id: 'integrations',
      title: 'Platform Integrations',
      icon: Globe,
      items: [
        'React SDK',
        'Node.js SDK',
        'WordPress Plugin',
        'REST API'
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      items: [
        'Smart Contract Security',
        'Token Standards',
        'Access Control Best Practices',
        'Audit Reports'
      ]
    }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: "Get API Credentials",
      description: "Sign up and get your API keys from the GatePay developer dashboard.",
      code: `// Environment variables
GATEPAY_API_KEY=your_api_key_here
GATEPAY_SECRET=your_secret_here`
    },
    {
      step: 2,
      title: "Install SDK",
      description: "Add GatePay to your project using your preferred package manager.",
      code: `npm install @gatepay/sdk
# or
yarn add @gatepay/sdk`
    },
    {
      step: 3,
      title: "Initialize Client",
      description: "Set up the GatePay client in your application.",
      code: `import { GatePay } from '@gatepay/sdk';

const gatepay = new GatePay({
  apiKey: process.env.GATEPAY_API_KEY,
  secret: process.env.GATEPAY_SECRET,
  environment: 'sandbox' // or 'production'
});`
    },
    {
      step: 4,
      title: "Create Gated Content",
      description: "Define your content access rules and pricing.",
      code: `const contentAccess = await gatepay.createAccess({
  contentId: 'premium-course-1',
  priceInTokens: 100,
  duration: '30d', // 30 days access
  blockchain: 'ethereum'
});`
    }
  ];

  const useCases = [
    {
      icon: BookOpen,
      title: "Digital Publishing",
      description: "Gate premium articles, ebooks, and research papers",
      link: "/docs/use-cases/publishing"
    },
    {
      icon: FileText,
      title: "Educational Content",
      description: "Control access to online courses and learning materials",
      link: "/docs/use-cases/education"
    },
    {
      icon: Key,
      title: "IoT & Smart Devices",
      description: "Integrate with physical devices and smart locks",
      link: "/docs/use-cases/iot"
    },
    {
      icon: Wrench,
      title: "SaaS Platforms",
      description: "Add tokenized access to your software features",
      link: "/docs/use-cases/saas"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-black/20 backdrop-blur-md border-r border-white/10 min-h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Documentation</h2>
            <nav className="space-y-2">
              {navigationSections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedSection === section.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                  {selectedSection === section.id && (
                    <ul className="ml-7 mt-2 space-y-1">
                      {section.items.map((item, index) => (
                        <li key={index}>
                          <a 
                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                GatePay Documentation
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Learn how to integrate decentralized access control into your platform with our comprehensive guides and API references.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  View Quick Start
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-transparent">
                  API Reference
                </Button>
              </div>
            </div>

            {/* Quick Start Guide */}
            {selectedSection === 'getting-started' && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-8">Quick Start Guide</h2>
                <div className="space-y-8">
                  {quickStartSteps.map((step) => (
                    <Card key={step.step} className="bg-white/5 backdrop-blur-md border-white/10">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{step.step}</span>
                          </div>
                          <CardTitle className="text-white">{step.title}</CardTitle>
                        </div>
                        <CardDescription className="text-gray-300">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-green-400 text-sm">
                            <code>{step.code}</code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Use Cases */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8">Popular Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {useCases.map((useCase, index) => (
                  <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <useCase.icon className="w-5 h-5 text-white" />
                        </div>
                        <CardTitle className="text-white">{useCase.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300 mb-4">
                        {useCase.description}
                      </CardDescription>
                      <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-transparent">
                        View Guide
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Support Section */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
                <CardDescription className="text-gray-300">
                  Our team is here to help you integrate GatePay successfully.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-transparent">
                    Join Discord Community
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-transparent">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-transparent">
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Docs;