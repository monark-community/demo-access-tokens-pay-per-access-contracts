import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, Zap, Building } from 'lucide-react';

const Pricing = () => {
  const pricingTiers = [
    {
      icon: Zap,
      title: "Developer",
      price: "Free",
      description: "Perfect for testing and small-scale implementations",
      features: [
        "Up to 1,000 transactions/month",
        "Basic API access",
        "Community support",
        "Testnet access",
        "Standard documentation"
      ],
      popular: false
    },
    {
      icon: DollarSign,
      title: "Professional",
      price: "$99/month",
      description: "Ideal for growing platforms and businesses",
      features: [
        "Up to 50,000 transactions/month",
        "Full API access",
        "Priority support",
        "Mainnet access",
        "Advanced analytics",
        "Custom webhooks"
      ],
      popular: true
    },
    {
      icon: Building,
      title: "Enterprise",
      price: "Custom",
      description: "For large-scale implementations and organizations",
      features: [
        "Unlimited transactions",
        "Dedicated infrastructure",
        "24/7 premium support",
        "Custom integrations",
        "SLA guarantees",
        "On-premise deployment options"
      ],
      popular: false
    }
  ];

  const transactionFees = [
    {
      type: "Standard Token Transfer",
      fee: "0.5% + network gas",
      description: "Basic token-gated access transactions"
    },
    {
      type: "Smart Contract Execution",
      fee: "1% + network gas",
      description: "Complex access control with custom logic"
    },
    {
      type: "Cross-Chain Transactions",
      fee: "2% + bridge fees",
      description: "Multi-blockchain access control"
    },
    {
      type: "IoT Device Integration",
      fee: "0.3% + device fees",
      description: "Physical device access control"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Simple, Transparent
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your platform's needs. All plans include our core infrastructure and security features.
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`bg-white/5 backdrop-blur-md border-white/10 relative ${
                  tier.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <tier.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">{tier.title}</CardTitle>
                  <div className="text-3xl font-bold text-white mb-2">{tier.price}</div>
                  <CardDescription className="text-gray-300">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transaction Fees */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Transaction Fees
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transactionFees.map((fee, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{fee.type}</CardTitle>
                    <div className="text-2xl font-bold text-purple-400">{fee.fee}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{fee.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-white mb-2">Network Fees</h4>
                <p>Gas fees vary by blockchain network and are paid directly to validators. GatePay optimizes transactions for minimal gas usage.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Volume Discounts</h4>
                <p>Enterprise customers with high transaction volumes can negotiate custom pricing and reduced fees.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">No Hidden Fees</h4>
                <p>All pricing is transparent. No setup fees, no cancellation fees, no surprises.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Billing Cycle</h4>
                <p>Monthly billing with the option to upgrade or downgrade at any time. Enterprise contracts available annually.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;