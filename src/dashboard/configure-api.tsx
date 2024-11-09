import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Play } from "lucide-react";
import { urls } from '@/api/urls';
// import { beautify } from 'json-beautify';

interface Api {
  id: string;
  api_url: string;
  api_name: string;
  http_method: string;
}

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
  const [useAI, setUseAI] = useState(false);
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testParams, setTestParams] = useState('');
  const [testHeaders, setTestHeaders] = useState('');
  const [testPayload, setTestPayload] = useState('');

  const [error, setError] = useState<string | null>(null);

  const [apiList, setApiList] = useState<Api[]>([]);
  const [selectedApi, setSelectedApi] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [loading, setLoading] = useState(false);
  
  const [results, setResults] = useState<TestResult[]>([]);


  // Fetch APIs on component mount
  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const response = await fetch(`https://api-tau-teal.vercel.app/api_management/apis?user_id=${user.id}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to load APIs');
        
        const data = await response.json();
        setApiList(data);
        setSelectedApi(data[0]?.api_url || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred while fetching APIs.');
      }
    };
    fetchAPIs();
  }, [user.id]);

  const handleRunTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      api_url: selectedApi,
      http_method: 'POST',
      headers: JSON.parse(testHeaders || '{}'),
      parameters: JSON.parse(testParams || '{}'),
      payload: JSON.parse(testPayload || '{}'),
    };

    try {
      const response = await fetch(urls.testapi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      const headers = Array.from(response.headers.entries()).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      setResults(prevResults => [
        ...prevResults,
        {
          description: testDescription,
          expected_status: 200, // Add expected status dynamically as per requirement
          status_code: response.status,
          success: response.status === 200, // Adjust based on your success criteria
          response_data: responseData,
          test_case: {
            description: testDescription,
            expected_status: 200, // Add expected status dynamically as per requirement
            test_type: 'Manual', // Adjust based on your test type
          },
          headers: headers,
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
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
              <select
                id="api-select"
                className="w-full p-2 border rounded"
                value={selectedApi}
                onChange={(e) => setSelectedApi(e.target.value)}
              >
                {apiList.map((api) => (
                  <option key={api.id} value={api.api_url}>
                    {api.api_name} ({api.http_method})
                  </option>
                ))}
              </select>
            </div>
            <InputField id="test-name" label="Test Name" value={testName} setValue={setTestName} placeholder="Enter test name" />
            <TextareaField id="test-description" label="Test Description" value={testDescription} setValue={setTestDescription} placeholder="Describe the test case" />
            <TextareaField id="test-params" label="Parameters" value={testParams} setValue={setTestParams} placeholder="Enter test parameters (JSON format)" />
            <TextareaField id="test-headers" label="Headers" value={testHeaders} setValue={setTestHeaders} placeholder="Enter request headers (JSON format)" />

            <Label htmlFor="headers-select">Select Header</Label>
            <select
              id="headers-select"
              className="w-full p-2 border rounded"
              onChange={(e) => setTestHeaders(e.target.value)}
            >
              <option value='{"Content-Type": "application/json"}'>Content-Type: application/json</option>
              <option value='{"Authorization": "Bearer <token>"}'>Authorization: Bearer &lt;token&gt;</option>
              <option value='{"Accept": "application/json"}'>Accept: application/json</option>
            </select>

            <TextareaField id="test-payload" label="Payload" value={testPayload} setValue={setTestPayload} placeholder="Enter request payload (JSON format)" />
            {/* <Button type="button" onClick={handleFormatJSON} variant="secondary">Format JSON</Button> */}

            <div className="flex items-center space-x-2">
              <Switch id="use-ai" checked={useAI} onCheckedChange={setUseAI} />
              <Label htmlFor="use-ai">Use AI to generate test data</Label>
            </div>
            <div className="flex space-x-2">
              <Button type="button">
                <Settings className="mr-2 h-4 w-4" /> Save Configuration
              </Button>
              <Button type="submit" variant="secondary">
              {loading ? <div>Loading...</div> : <><Play className="mr-2 h-4 w-4" /> Run Test</>}
              </Button>
            </div>
          </form>

          {results.map((result, index) => (
            <ResultDisplay key={index} result={result} />
          ))}

          {error && (
            <div className="text-red-500 mt-2">
              <strong>Error:</strong> {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InputField({ id, label, value, setValue, placeholder }: { id: string; label: string; value: string; setValue: React.Dispatch<React.SetStateAction<string>>; placeholder: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function TextareaField({ id, label, value, setValue, placeholder }: { id: string; label: string; value: string; setValue: React.Dispatch<React.SetStateAction<string>>; placeholder: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
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
      <div className="p-2 bg-gray-100 rounded">
        {Array.isArray(result.response_data) ? (
          result.response_data.map((data: TestResult, index: number) => (
            <div key={index} className="mb-4 p-4 bg-white rounded shadow-sm border">
          <div className="mt-4 p-4 bg-blue-50 rounded shadow-inner">
          <h5 className="font-semibold text-blue-700">Test Case Details</h5>
          <p className="text-blue-600"><strong>Description:</strong> {data.test_case.description || 'N/A'}</p>
          <p className="text-blue-600"><strong>Expected Status:</strong> {data.test_case.expected_status}</p>
          <p className="text-blue-600"><strong>Test Type:</strong> {data.test_case.test_type || 'N/A'}</p>
          </div>

              <h5 className="mt-2 font-semibold text-blue-600">Response Details</h5>
              <p><strong>Status Code:</strong> {data.status_code}</p>
              <p><strong>Success:</strong> {data.success ? '✅' : '❌'}</p>

              <h5 className="mt-2 font-semibold">Response Data</h5>
              <pre className="whitespace-pre-wrap bg-gray-200 p-2 rounded">{JSON.stringify(data.response_data, null, 2)}</pre>

            </div>
          ))
        ) : (
          <pre className="whitespace-pre-wrap">{JSON.stringify(result.response_data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}