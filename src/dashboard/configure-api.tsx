import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Play } from "lucide-react";

export default function ConfigureTests() {
  const [useAI, setUseAI] = useState(false);
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testParams, setTestParams] = useState('');
  const [testHeaders, setTestHeaders] = useState('');
  const [testPayload, setTestPayload] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleRunTest = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      api_url: 'https://example.com/',  // Replace with selected API URL if dynamic
      http_method: 'POST',
      headers: JSON.parse(testHeaders || '{}'),
      parameters: JSON.parse(testParams || '{}'),
      payload: JSON.parse(testPayload || '{}'),
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api_testing/test-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setApiResponse(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An unexpected error occurred.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Configure Tests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRunTest} className="space-y-4">
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
              <Input id="test-name" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="Enter test name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-description">Test Description</Label>
              <Textarea id="test-description" value={testDescription} onChange={(e) => setTestDescription(e.target.value)} placeholder="Describe the test case" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-params">Parameters</Label>
              <Textarea id="test-params" value={testParams} onChange={(e) => setTestParams(e.target.value)} placeholder="Enter test parameters (JSON format)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-headers">Headers</Label>
              <Textarea id="test-headers" value={testHeaders} onChange={(e) => setTestHeaders(e.target.value)} placeholder="Enter request headers (JSON format)" />
              <Label htmlFor="headers-select">Select Header</Label>
              <select id="headers-select" className="w-full p-2 border rounded" onChange={(e) => setTestHeaders(e.target.value)}>
              <option value='{"Content-Type": "application/json"}'>Content-Type: application/json</option>
              <option value='{"Authorization": "Bearer <token>"}'>Authorization: Bearer &lt;token&gt;</option>
              <option value='{"Accept": "application/json"}'>Accept: application/json</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-payload">Payload</Label>
              <Textarea id="test-payload" value={testPayload} onChange={(e) => setTestPayload(e.target.value)} placeholder="Enter request payload (JSON format)" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="use-ai" checked={useAI} onCheckedChange={setUseAI} />
              <Label htmlFor="use-ai">Use AI to generate test data</Label>
            </div>
            <div className="flex space-x-2">
              <Button type="button">
                <Settings className="mr-2 h-4 w-4" /> Save Configuration
              </Button>
              <Button type="submit" variant="secondary">
                <Play className="mr-2 h-4 w-4" /> Run Test
              </Button>
            </div>
          </form>
          {apiResponse && <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(apiResponse, null, 2)}</pre>}
          {error && <div className="text-red-500 mt-2"><strong>Error:</strong> {error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}