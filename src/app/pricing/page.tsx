'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LanguageSelector from '@/components/LanguageSelector';
import { getTranslation } from '@/lib/translations';
import { getUser, getSubscription, setSubscription } from '@/lib/localStorage';

interface PricingPlan {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export default function PricingPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>('en');
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<string>('free');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('sautileja_language') || 'en';
      setLanguage(savedLanguage);

      const userData = getUser();
      setUser(userData);

      const sub = getSubscription();
      setCurrentPlan(sub);
    }
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sautileja_language', newLanguage);
    }
  };

  const plans: { [key: string]: PricingPlan } = {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Basic transaction tracking',
        'Manual transaction entry',
        'Simple inventory management',
        'Basic dashboard',
        'Up to 100 transactions/month',
        'Limited AI insights',
      ],
    },
    pro: {
      name: 'Pro',
      price: 499,
      popular: true,
      features: [
        'Everything in Free',
        'Voice transaction recording',
        'Advanced AI insights',
        'SautiBot assistant',
        'Unlimited transactions',
        'Advanced analytics',
        'Generate reports (PDF, CSV)',
        'Priority support',
      ],
    },
    business: {
      name: 'Business',
      price: 999,
      features: [
        'Everything in Pro',
        'Multi-user access',
        'Team management',
        'Advanced reporting',
        'Custom integrations',
        'Dedicated support',
        'Data export & backup',
        'API access',
      ],
    },
  };

  const handleSubscribe = (planName: string) => {
    if (user) {
      setSubscription(planName);
      setCurrentPlan(planName);
      alert(`Successfully subscribed to ${plans[planName].name} plan!`);
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pricing Plans</h1>
              <p className="text-gray-600 mt-2">
                Choose the perfect plan for your business
              </p>
            </div>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                plan.popular ? 'ring-2 ring-primary transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-primary text-white py-2 text-center text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="bg-white p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">KES {plan.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>

                <Button
                  onClick={() => handleSubscribe(key)}
                  variant={currentPlan === key ? 'outline' : 'primary'}
                  size="lg"
                  className="w-full mb-6"
                  disabled={currentPlan === key}
                >
                  {currentPlan === key ? 'Current Plan' : 'Choose Plan'}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="text-green-600 mr-3 font-bold">✓</span>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card title="Can I change plans anytime?">
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected
                immediately on your account.
              </p>
            </Card>

            <Card title="What payment methods do you accept?">
              <p className="text-gray-600">
                We accept M-Pesa, credit cards, and bank transfers. Payment processing is secure
                and encrypted.
              </p>
            </Card>

            <Card title="Is there a free trial?">
              <p className="text-gray-600">
                Yes! The Free plan is essentially a trial. You can use all basic features forever
                at no cost.
              </p>
            </Card>

            <Card title="What if I need help?">
              <p className="text-gray-600">
                All plans include support. Pro and Business plans get priority support via email
                and WhatsApp.
              </p>
            </Card>

            <Card title="Can I export my data?">
              <p className="text-gray-600">
                Pro plan users can generate reports. Business plan users get full data export and
                backup capabilities.
              </p>
            </Card>

            <Card title="Is my data secure?">
              <p className="text-gray-600">
                Yes! We use industry-standard encryption and security measures to protect your
                business data.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to grow your business?
          </h3>
          <p className="text-gray-600 mb-6">
            Start with the Free plan or upgrade to Pro for advanced features.
          </p>
          {!user ? (
            <Link href="/register">
              <Button variant="primary" size="lg">
                Get Started Today
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button variant="primary" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
