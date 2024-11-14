import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BarChart, Upload, Settings, List, Home } from "lucide-react"
import {  useLocation } from 'react-router-dom';



import ConfigureTests from './dashboard/configure-api'

import Settings1 from './dashboard/settings'


const Sidebar = () => {
  const location = useLocation();
  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
  
    // Clear session storage
    sessionStorage.clear();
  
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  
    // Redirect to login page or home page
    window.location.href = "/"; // Adjust the path as needed
  };
  const isActive = (path: string) => location.pathname === path;
    <Button
              asChild
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isActive('/settings') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <Link to="/settings" className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
  return (
    <div className="pb-12 w-64 bg-gray-800 text-white h-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight">
           AI API Testing Tool
          </h2>
          <div className="space-y-1">
           
            <Button
              asChild
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isActive('/generate-test') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <Link to="/generate-test" className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Generate Test
              </Link>
            </Button>
           
          
            <Button
              asChild
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isActive('/scripts') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <Link to="/scripts" className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                Scripts
              </Link>
            </Button>
            
            <Button
              asChild
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isActive('/settings') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <Link to="/settings" className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button
  asChild
  variant="ghost"
  className="w-full justify-start transition-colors duration-200 hover:bg-gray-700"
  onClick={handleLogout}
>
  <div className="flex items-center cursor-pointer">
    <List className="mr-2 h-4 w-4" />
    Logout
  </div>
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
import { urls } from './api/urls'
import IntegratedTestDashboard from './dashboard/test-script'

export default function App() {
  const [isAuthenticated] = useState(() => {
    const savedAuthState = localStorage.getItem('access_token');
    console.log(savedAuthState);
    try {
      fetch(urls.getCurrentUser, {
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer '+savedAuthState
        }}).then(response => response.json())
        .then(data => {
          console.log(data);
          if(data.message){
            // localStorage.removeItem('access_token');
          }
        });
    }
    catch (error) {
      console.log(error);
    }
    return savedAuthState || false;
    // const accessToken = localStorage.getItem('accessToken');
    // console.log(savedAuthState, accessToken);
   
  });

  React.useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex h-screen">
          <Sidebar />
          <Separator orientation="vertical" />
          <ScrollArea className="flex-1">
            <Routes>
             
              
              <Route path="/generate-test" element={<ConfigureTests />} />
           
              <Route path="/settings" element={<Settings1 />} />
              <Route path="/scripts" element={<IntegratedTestDashboard/>} />
            </Routes>
          </ScrollArea>
        </div>
      ) : (
        <div className="">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<SignUp />} />
          </Routes>
        </div>
      )}
    </Router>
  );
}
