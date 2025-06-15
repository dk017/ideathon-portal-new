
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Login = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const handleDemoLogin = (role: 'admin' | 'user') => {
    const demoEmail = role === 'admin' ? 'admin@example.com' : 'user@example.com';
    login(demoEmail, role);
  };

  const handleLogin = () => {
    if (email.includes('admin')) {
      login(email, 'admin');
    } else {
      login(email, 'user');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center">
            <span className="text-white text-2xl font-bold">H</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Hackathon Platform</CardTitle>
          <CardDescription>
            Access your hackathon management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={!email}
            >
              Sign In
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or try demo accounts</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => handleDemoLogin('admin')} 
              variant="outline" 
              className="w-full border-blue-200 hover:bg-blue-50"
            >
              <Badge variant="secondary" className="mr-2 bg-blue-100 text-blue-700">Admin</Badge>
              Demo Admin Access
            </Button>
            <Button 
              onClick={() => handleDemoLogin('user')} 
              variant="outline" 
              className="w-full border-green-200 hover:bg-green-50"
            >
              <Badge variant="secondary" className="mr-2 bg-green-100 text-green-700">User</Badge>
              Demo User Access
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p><strong>Admin Demo:</strong> Full management access, create events, manage ideas</p>
            <p><strong>User Demo:</strong> Participate in hackathons, submit ideas, join teams</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
