
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleWalletConnect = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <header className="relative z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            <span className="text-white font-bold text-xl">GatePay</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <a href="#integrations" className="text-gray-300 hover:text-white transition-colors">
              Integrations
            </a>
            <Link to="/docs" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={handleWalletConnect}
              className={`${
                isWalletConnected
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              } text-white`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isWalletConnected ? 'Connected' : 'Connect Wallet'}
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10 p-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <a href="#integrations" className="text-gray-300 hover:text-white transition-colors">
                Integrations
              </a>
              <Link to="/docs" className="text-gray-300 hover:text-white transition-colors">
                Docs
              </Link>
              <Button
                onClick={handleWalletConnect}
                className={`${
                  isWalletConnected
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                } text-white w-full`}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isWalletConnected ? 'Connected' : 'Connect Wallet'}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
