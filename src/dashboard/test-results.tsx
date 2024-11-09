import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, RefreshCw } from "lucide-react"

export default function TestResults() {
  const testResults = [
    { id: 1, api: 'API 1', testCase: 'Positive Test', status: 'Pass', responseTime: '120ms' },
    { id: 2, api: 'API 2', testCase: 'Negative Test', status: 'Fail', responseTime: '200ms' },
    { id: 3, api: 'API 3', testCase: 'Boundary Test', status: 'Pass', responseTime: '150ms' },
  ]

  const handleRefresh = () => {
    // Implement refresh logic here
    console.log('Refreshing results...')
  }

  const handleExport = () => {
    // Implement export logic here
    console.log('Exporting results...')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Test Results</h1>
      <Card>
        <CardHeader>
          <CardTitle>Latest Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Results
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export Results
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API</TableHead>
                <TableHead>Test Case</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.api}</TableCell>
                  <TableCell>{result.testCase}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded ${
                        result.status === 'Pass' 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {result.status}
                    </span>
                  </TableCell>
                  <TableCell>{result.responseTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}