import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Settings, Play } from "lucide-react"

export default function ConfigureTests() {
  const [useAI, setUseAI] = useState(false)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Configure Tests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-select">Select API</Label>
              <select id="api-select" className="w-full p-2 border rounded">
                <option>API 1</option>
                <option>API 2</option>
                <option>API 3</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-name">Test Name</Label>
              <Input id="test-name" placeholder="Enter test name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-description">Test Description</Label>
              <Textarea id="test-description" placeholder="Describe the test case" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-params">Parameters</Label>
              <Textarea id="test-params" placeholder="Enter test parameters (JSON format)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-headers">Headers</Label>
              <Textarea id="test-headers" placeholder="Enter request headers (JSON format)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-payload">Payload</Label>
              <Textarea id="test-payload" placeholder="Enter request payload (JSON format)" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="use-ai" checked={useAI} onCheckedChange={setUseAI} />
              <Label htmlFor="use-ai">Use AI to generate test data</Label>
            </div>
            <div className="flex space-x-2">
              <Button type="submit">
                <Settings className="mr-2 h-4 w-4" /> Save Configuration
              </Button>
              <Button variant="secondary">
                <Play className="mr-2 h-4 w-4" /> Run Test
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}