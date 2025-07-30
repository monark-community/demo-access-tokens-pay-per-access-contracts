
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, FileText, Calendar, Wifi, Building, Play, Smartphone } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Digital Publishing",
      description: "Enable book publishers and authors to gate premium content with tokenized access control."
    },
    {
      icon: GraduationCap,
      title: "Online Education",
      description: "Power course platforms with secure, time-limited access to educational content and materials."
    },
    {
      icon: Play,
      title: "Video Streaming",
      description: "Integrate with video platforms for pay-per-view content and subscription-based streaming services."
    },
    {
      icon: Calendar,
      title: "Live Events",
      description: "Gate access to virtual events, webinars, and live streams with blockchain-verified tickets."
    },
    {
      icon: Building,
      title: "Public Services",
      description: "Enable government and public services to implement secure, transparent access control systems."
    },
    {
      icon: Smartphone,
      title: "IoT & Smart Devices",
      description: "Connect smart locks, devices, and IoT systems with tokenized access for physical spaces."
    }
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Platforms Powered by
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              GatePay Technology
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how content platforms across industries leverage our decentralized access control infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
