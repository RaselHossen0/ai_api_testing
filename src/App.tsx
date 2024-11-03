import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BarChart, Upload, Settings, List, Home } from "lucide-react"

import Dashboard from './dashboard/dashboard'
import UploadAPIs from './dashboard/upload-api'

import ConfigureTests from './dashboard/configure-api'
import TestResults from './dashboard/test-results'
import Settings1 from './dashboard/settings'


const Sidebar = () => {
  return (
    <div className="pb-12 w-64 bg-gray-800 text-white h-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight">
            API Testing Tool
          </h2>
          <div className="space-y-1">
            <Button asChild variant="secondary" className="w-full justify-start hover:bg-gray-700 transition-colors duration-200">
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start hover:bg-gray-700 transition-colors duration-200">
              <Link to="/upload" className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload APIs
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start hover:bg-gray-700 transition-colors duration-200">
              <Link to="/configure" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Configure Tests
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start hover:bg-gray-700 transition-colors duration-200">
              <Link to="/results" className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                Test Results
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start hover:bg-gray-700 transition-colors duration-200">
              <Link to="/settings" className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default Sidebar;

import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuthState = localStorage.getItem('isAuthenticated');
    console.log(savedAuthState)
    return savedAuthState ? JSON.parse(savedAuthState) : false;
  });

  React.useEffect(() => {
    console.log(isAuthenticated)
  }, [isAuthenticated]);

  return (
    <Router>
     
        {isAuthenticated ? (
           <div className="flex h-screen">
            <Sidebar />
            <Separator orientation="vertical" />
            <ScrollArea className="flex-1">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<UploadAPIs />} />
                <Route path="/configure" element={<ConfigureTests />} />
                <Route path="/results" element={<TestResults />} />
                <Route path="/settings" element={<Settings1 />} />
              </Routes>
            </ScrollArea>
            </div>
        ) : (
          <div className="">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<SignUp  />} />
          </Routes>
          </div>
        )}
     
    </Router>
  )
}