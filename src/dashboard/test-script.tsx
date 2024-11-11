import  { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Download } from "lucide-react"

export default function IntegratedTestDashboard() {
  // State for Test Script Creation
  const [framework, setFramework] = useState('postman')
  const [language, setLanguage] = useState('javascript')
  const [generatedScript, setGeneratedScript] = useState('')

  // State for Test Execution
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  // State for Test Results
  const [testResults, setTestResults] = useState<Array<{
    id: number;
    name: string;
    status: 'Passed' | 'Failed';
    responseTime: string;
    validationResult: string;
  }>>([])
  const [exportFormat, setExportFormat] = useState('html')

  const handleGenerateScript = () => {
    setGeneratedScript(`// Generated ${framework} script in ${language}\n// Add your test logic here`)
  }

  const handleStartTest = () => {
    setIsRunning(true)
    setProgress(0)
    setLogs([])
    setTestResults([])

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          generateTestResults()
          return 100
        }
        setLogs((prevLogs) => [...prevLogs, `Executing test step ${prev + 10}`])
        return prev + 10
      })
    }, 1000)
  }

  const generateTestResults = () => {
    const newResults = [
      { id: 1, name: 'API Endpoint 1', status: 'Passed' as const, responseTime: '200ms', validationResult: 'Success' },
      { id: 2, name: 'API Endpoint 2', status: 'Failed' as const, responseTime: '500ms', validationResult: 'Error: 404 Not Found' },
      { id: 3, name: 'API Endpoint 3', status: 'Passed' as const, responseTime: '150ms', validationResult: 'Success' },
    ]
    setTestResults(newResults)
  }

  const handleExport = () => {
    alert(`Exporting report in ${exportFormat} format`)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">API Testing Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Create and Execute Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="framework">Framework</Label>
                  <Select value={framework} onValueChange={setFramework}>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postman">Postman</SelectItem>
                      <SelectItem value="junit">JUnit</SelectItem>
                      <SelectItem value="cypress">Cypress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleGenerateScript}>Generate Script</Button>
              <Tabs defaultValue="preview">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <pre className="p-4 bg-muted rounded-md overflow-auto max-h-[200px]">
                    {generatedScript}
                  </pre>
                </TabsContent>
                <TabsContent value="edit">
                  <textarea
                    className="w-full h-[200px] p-4 font-mono text-sm border rounded-md"
                    value={generatedScript}
                    onChange={(e) => setGeneratedScript(e.target.value)}
                  />
                </TabsContent>
              </Tabs>
              <div className="flex justify-between items-center">
                <Button onClick={handleStartTest} disabled={isRunning}>
                  <Play className="mr-2 h-4 w-4" /> {isRunning ? 'Running...' : 'Start Test'}
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Progress:</span>
                  <Progress value={progress} className="w-[200px]" />
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Execution Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] border rounded-md p-4">
              {logs.map((log, index) => (
                <div key={index} className="py-1">
                  {log}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Validation Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.status}</TableCell>
                    <TableCell>{result.responseTime}</TableCell>
                    <TableCell>{result.validationResult}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center space-x-4 mt-4">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}