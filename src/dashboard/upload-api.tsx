import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText } from "lucide-react"
import { urls } from "../api/urls"
import { url } from 'inspector'

export default function UploadAPIs() {
  const [activeTab, setActiveTab] = useState("individual")
  const [apiName, setApiName] = useState("")
  const [apiUrl, setApiUrl] = useState("")
  const [httpMethod, setHttpMethod] = useState("GET")
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponseMessage(null)
    setErrorMessage(null)

    try {
      const response = await fetch(urls.uploadIndividualAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_name: apiName,
          api_url: apiUrl,
          http_method: httpMethod,
          user_id: user.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResponseMessage(data.message)
      } else if (response.status === 422) {
        const errorData = await response.json()
        setErrorMessage(errorData.detail[0].msg || "Validation error")
      } else {
        setErrorMessage("An unexpected error occurred.")
      }
    } catch (error) {
      setErrorMessage("Failed to connect to the server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Upload APIs</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Add Individual API</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-name">API Name</Label>
                  <Input
                    id="api-name"
                    placeholder="Enter API name"
                    value={apiName}
                    onChange={(e) => setApiName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-url">API URL</Label>
                  <Input
                    id="api-url"
                    placeholder="https://api.example.com/endpoint"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
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
                
                {loading ? (
                  <p className="text-gray-500">Submitting...</p>
                ) : (
                  <Button type="submit">
                    <Upload className="mr-2 h-4 w-4" /> Add API
                  </Button>
                )}
                
                {responseMessage && (
                  <p className="text-green-500 mt-4">{responseMessage}</p>
                )}
                {errorMessage && (
                  <p className="text-red-500 mt-4">{errorMessage}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload APIs</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload CSV/JSON File</Label>
                  <Input id="file-upload" type="file" accept=".csv,.json" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-list">Or Paste API List</Label>
                  <Textarea
                    id="api-list"
                    placeholder="Paste your API list here (JSON or CSV format)"
                    rows={10}
                  />
                </div>
                <Button type="submit">
                  <FileText className="mr-2 h-4 w-4" /> Upload APIs
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}