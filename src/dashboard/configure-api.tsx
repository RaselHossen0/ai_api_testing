import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Play } from "lucide-react";
import { urls } from "@/api/urls";

interface TestResult {
  description: string;
  expected_status: number;
  status_code: number;
  success: boolean;
  response_data: any;
  test_case: {
    description: string;
    expected_status: number;
    test_type: string;
  };
  headers: Record<string, string>;
}

export default function ConfigureTests() {
  const [apiName, setApiName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [httpMethod, setHttpMethod] = useState("GET");
  const [useAI, setUseAI] = useState(false);
  const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [testParams, setTestParams] = useState("");
  const [testHeaders, setTestHeaders] = useState("");
  const [testPayload, setTestPayload] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleAddAndRunTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Upload API
    try {
      const uploadResponse = await fetch(urls.uploadIndividualAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_name: apiName,
          api_url: apiUrl,
          http_method: httpMethod,
        }),
      });

      if (!uploadResponse.ok) {
        setError("Failed to upload API.");
        setLoading(false);
        return;
      }

      const data = await uploadResponse.json();
      setResponseMessage(data.message);

      // Run test
      const payload = {
        api_url: apiUrl,
        http_method: httpMethod,
        headers: JSON.parse(testHeaders || "{}"),
        parameters: JSON.parse(testParams || "{}"),
        payload: JSON.parse(testPayload || "{}"),
      };

      const testResponse = await fetch(urls.testapi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await testResponse.json();
      const headers = Array.from(testResponse.headers.entries()).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      setResults((prevResults) => [
        ...prevResults,
        {
          description: testDescription,
          expected_status: 200,
          status_code: testResponse.status,
          success: testResponse.status === 200,
          response_data: responseData,
          test_case: {
            description: testDescription,
            expected_status: 200,
            test_type: "Manual",
          },
          headers,
        },
      ]);
    } catch (err) {
      setError("An error occurred while uploading or testing the API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Configure Tests and Add API</h1>
      <Card>
        <CardHeader>
          <CardTitle>API and Test Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAndRunTest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-name">API Name</Label>
              <Input
                id="api-name"
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                placeholder="Enter API name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-url">API URL</Label>
              <Input
                id="api-url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-method">HTTP Method</Label>
              <select
                id="api-method"
                className="w-full p-2 border rounded"
                value={httpMethod}
                onChange={(e) => setHttpMethod(e.target.value)}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>

            <InputField id="test-name" label="Test Name" value={testName} setValue={setTestName} placeholder="Enter test name" />
            <TextareaField id="test-description" label="Test Description" value={testDescription} setValue={setTestDescription} placeholder="Describe the test case" />
            <TextareaField id="test-params" label="Parameters" value={testParams} setValue={setTestParams} placeholder="Enter test parameters (JSON format)" />
            <TextareaField id="test-headers" label="Headers" value={testHeaders} setValue={setTestHeaders} placeholder="Enter request headers (JSON format)" />
            <TextareaField id="test-payload" label="Payload" value={testPayload} setValue={setTestPayload} placeholder="Enter request payload (JSON format)" />

            <div className="flex items-center space-x-2">
              <Switch id="use-ai" checked={useAI} onCheckedChange={setUseAI} />
              <Label htmlFor="use-ai">Use AI to generate test data</Label>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" variant="secondary">
                {loading ? "Loading..." : <><Play className="mr-2 h-4 w-4" /> Add API & Run Test</>}
              </Button>
            </div>
          </form>

          {responseMessage && <p className="text-green-500 mt-4">{responseMessage}</p>}
          {results.map((result, index) => (
            <ResultDisplay key={index} result={result} />
          ))}
          {error && <div className="text-red-500 mt-2"><strong>Error:</strong> {error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

function InputField({ id, label, value, setValue, placeholder }: { id: string; label: string; value: string; setValue: React.Dispatch<React.SetStateAction<string>>; placeholder: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function TextareaField({ id, label, value, setValue, placeholder }: { id: string; label: string; value: string; setValue: React.Dispatch<React.SetStateAction<string>>; placeholder: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ResultDisplay({ result }: { result: TestResult }) {
  return (
    <div className={`p-4 mb-4 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
      <h3 className="font-semibold text-lg">{result.description || 'Test Results'}</h3>
      <p>Expected Status: {result.expected_status}</p>
      <p>Actual Status: {result.status_code}</p>
      <p>Success: {result.success ? '✅' : '❌'}</p>
      <h4 className="mt-4 font-semibold text-blue-600">Response Data</h4>
      <pre className="whitespace-pre-wrap bg-gray-200 p-2 rounded">{JSON.stringify(result.response_data, null, 2)}</pre>
    </div>
  );
}