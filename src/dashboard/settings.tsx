import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { GitBranch, Clock, Save } from "lucide-react"

export default function Settings() {
  const [enableGitHub, setEnableGitHub] = useState(false)
  const [enableScheduling, setEnableScheduling] = useState(false)
  const [githubRepo, setGithubRepo] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [scheduleInterval, setScheduleInterval] = useState('')
  const [emailNotifications, setEmailNotifications] = useState('')

  const handleSaveGitHub = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement GitHub settings save logic here
    console.log('Saving GitHub settings:', { enableGitHub, githubRepo, githubToken })
  }

  const handleSaveScheduling = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement scheduling settings save logic here
    console.log('Saving scheduling settings:', { enableScheduling, scheduleInterval, emailNotifications })
  }

  const handleSaveAll = () => {
    // Implement logic to save all settings
    console.log('Saving all settings')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>GitHub Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGitHub} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="enable-github" 
                  checked={enableGitHub} 
                  onCheckedChange={setEnableGitHub}
                />
                <Label htmlFor="enable-github">Enable GitHub Integration</Label>
              </div>
              {enableGitHub && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="github-repo">GitHub Repository URL</Label>
                    <Input 
                      id="github-repo" 
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      placeholder="https://github.com/username/repo" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github-token">GitHub Access Token</Label>
                    <Input 
                      id="github-token" 
                      type="password" 
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="Enter your GitHub access token" 
                    />
                  </div>
                </>
              )}
              <Button type="submit">
                <GitBranch className="mr-2 h-4 w-4" /> Save GitHub Settings
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Scheduling</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveScheduling} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="enable-scheduling" 
                  checked={enableScheduling} 
                  onCheckedChange={setEnableScheduling}
                />
                <Label htmlFor="enable-scheduling">Enable Test Scheduling</Label>
              </div>
              {enableScheduling && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-interval">Schedule Interval (hours)</Label>
                    <Input 
                      id="schedule-interval" 
                      type="number" 
                      min="1" 
                      value={scheduleInterval}
                      onChange={(e) => setScheduleInterval(e.target.value)}
                      placeholder="Enter interval in hours" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-notifications">Email for Notifications</Label>
                    <Input 
                      id="email-notifications" 
                      type="email" 
                      value={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.value)}
                      placeholder="Enter email address" 
                    />
                  </div>
                </>
              )}
              <Button type="submit">
                <Clock className="mr-2 h-4 w-4" /> Save Scheduling Settings
              </Button>
            </form>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleSaveAll}>
          <Save className="mr-2 h-4 w-4" /> Save All Settings
        </Button>
      </div>
    </div>
  )
}