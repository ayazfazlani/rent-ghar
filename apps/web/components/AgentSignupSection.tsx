'use client';

import React from 'react';
import { UserPlus, UserCheck, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const steps = [
  {
    icon: <UserPlus className="w-10 h-10" />,
    title: "Create Account",
    description: "Sign up as an agent in minutes. Start with your first listing for free and manage your inventory with our professional dashboard.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: <UserCheck className="w-10 h-10" />,
    title: "Complete Profile",
    description: "Add your professional details, experience, and contact info to build trust with potential clients.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: <Home className="w-10 h-10" />,
    title: "List Properties",
    description: "Upload high-quality photos and details of your properties to reach thousands of buyers and tenants.",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
];

export default function AgentSignupSection() {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Content Side */}
            <div className="p-8 lg:p-16 flex flex-col justify-center">
              <div className="inline-block px-4 py-1.5 bg-black/5 rounded-full text-sm font-semibold text-gray-900 mb-6">
                Become a Partner
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                List Your Property & <br />
                <span className="text-primary">Grow Your Agency</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
                Join Pakistan's fastest growing property portal. Gain access to thousands of daily visitors and professional tools to manage your listings effectively.
              </p>

              <div className="space-y-8 mb-12">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${step.color}`}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-2xl bg-black hover:bg-black/90 group">
                  <Link href="/register?role=agent">
                    Register as Agent
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="h-14 px-8 text-lg rounded-2xl border-2 hover:bg-gray-50">
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>

            {/* Visual Side */}
            <div className="relative bg-black hidden lg:block overflow-hidden">
              <div className="absolute inset-0 opacity-40">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
                  alt="Modern office"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              <div className="absolute bottom-16 left-16 right-16">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 text-white">
                  <div className="flex gap-4 mb-6">
                    <div className="flex -space-x-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-black/20 overflow-hidden">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                            alt="Agent avatar"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Trusted by Professionals</p>
                      <p className="text-xl font-bold">5,000+ Active Agents</p>
                    </div>
                  </div>
                  <blockquote className="text-xl font-medium leading-relaxed italic">
                    "Rent Ghar has transformed how I manage my property portfolio. The leads are high-quality and the platform is incredibly intuitive."
                  </blockquote>
                  <div className="mt-6">
                    <p className="font-bold text-lg">Hamza Aziz</p>
                    <p className="opacity-70 text-sm">Platinum Real Estate Agency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
