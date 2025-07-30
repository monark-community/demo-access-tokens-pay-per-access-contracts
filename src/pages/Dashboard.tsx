import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Key, 
  Settings, 
  BarChart3, 
  Code, 
  Shield,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2
} from 'lucide-react';

const Dashboard = () => {
  // Check if wallet is connected - in real app this would come from context/state management
  const isWalletConnected = true; // For demo purposes
  const [selectedSection, setSelectedSection] = useState('overview');
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production API', key: 'gp_live_abc123...', created: '2024-01-15', lastUsed: '2024-01-20' },
    { id: '2', name: 'Development API', key: 'gp_test_def456...', created: '2024-01-10', lastUsed: '2024-01-19' }
  ]);
  const [showKeys, setShowKeys] = useState({});

  if (!isWalletConnected) {
    return <Navigate to="/" replace />;
  }

  const navigationSections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: BarChart3
    },
    {
      id: 'api-keys',
      title: 'API Keys',
      icon: Key
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Code
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings
    }
  ];

  const toggleKeyVisibility = (keyId) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification here
  };

  const handleCreateApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: `gp_test_${Math.random().toString(36).substring(2, 15)}...`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleDeleteApiKey = (keyId) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-black/20 backdrop-blur-md border-r border-white/10 min-h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Dashboard</h2>
            <nav className="space-y-2">
              {navigationSections.map((section) => (
                <button
                  key={section.id}
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
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-8 py-12">
            
            {/* Overview Section */}
            {selectedSection === 'overview' && (
              <div>
                <h1 className="text-4xl font-bold text-white mb-8">Dashboard Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-white/5 backdrop-blur-md border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Total Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-400">12,453</div>
                      <p className="text-gray-300 text-sm">+12% from last month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 backdrop-blur-md border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-400">$8,920</div>
                      <p className="text-gray-300 text-sm">+8% from last month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 backdrop-blur-md border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Active Integrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-400">7</div>
                      <p className="text-gray-300 text-sm">2 new this month</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* API Keys Section */}
            {selectedSection === 'api-keys' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-bold text-white">API Keys</h1>
                  <Button 
                    onClick={handleCreateApiKey}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Key
                  </Button>
                </div>

                <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Generate API Keys</CardTitle>
                    <CardDescription className="text-gray-300">
                      Create and manage API keys to integrate GatePay with your applications. Keep your keys secure and rotate them regularly.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <Card key={key.id} className="bg-white/5 backdrop-blur-md border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-medium mb-2">{key.name}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <Input 
                                value={showKeys[key.id] ? key.key.replace('...', 'def456789abc123def456') : key.key}
                                readOnly
                                className="bg-black/30 border-white/10 text-gray-300 font-mono text-sm"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleKeyVisibility(key.id)}
                                className="border-white/30 text-white hover:bg-white/10"
                              >
                                {showKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(key.key)}
                                className="border-white/30 text-white hover:bg-white/10"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="text-sm text-gray-400">
                              Created: {key.created} • Last used: {key.lastUsed}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteApiKey(key.id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Other Sections Placeholder */}
            {['integrations', 'security', 'settings'].includes(selectedSection) && (
              <div>
                <h1 className="text-4xl font-bold text-white mb-8 capitalize">{selectedSection}</h1>
                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      {selectedSection === 'integrations' && <Code className="w-16 h-16 mx-auto mb-4" />}
                      {selectedSection === 'security' && <Shield className="w-16 h-16 mx-auto mb-4" />}
                      {selectedSection === 'settings' && <Settings className="w-16 h-16 mx-auto mb-4" />}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} Coming Soon
                    </h3>
                    <p className="text-gray-300">
                      This section is under development and will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
