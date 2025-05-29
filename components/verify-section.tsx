"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VerifySectionProps {
  config: {
    environment: "sandbox" | "production"
    tier: "tier1" | "tier2"
    clientId: string
    clientSecret: string
    apiKey: string
  }
  baseUrl: string
  accessToken: string
}

export function VerifySection({ config, baseUrl, accessToken }: VerifySectionProps) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [formData, setFormData] = useState({
    first_name: "Juan",
    middle_name: "Santos",
    last_name: "Dela Cruz",
    suffix: "JR",
    birth_date: "1989-09-12",
    face_liveness_session_id: "1234567890",
  })

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const verifyPerson = async () => {
    if (!accessToken && !config.apiKey) {
      setResponse(JSON.stringify({ error: "No access token or API key available" }, null, 2))
      return
    }

    setLoading(true)
    setResponse("")

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      }

      // Use access token if available, otherwise use API key
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`
      } else {
        headers["Authorization"] = `Bearer ${config.apiKey}`
      }

      const res = await fetch(`${baseUrl}/query`, {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setResponse(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const fillSampleData = () => {
    setFormData({
      first_name: "Juan",
      middle_name: "Santos",
      last_name: "Dela Cruz",
      suffix: "JR",
      birth_date: "1989-09-12",
      face_liveness_session_id: "1234567890",
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information Verification
          </CardTitle>
          <CardDescription>Verify personal information against National ID database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!accessToken && !config.apiKey && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please authenticate first or configure an API key to use this endpoint.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <span className="text-sm font-medium">Endpoint:</span>
            <code className="block p-2 bg-gray-100 rounded text-sm">POST {baseUrl}/query</code>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => updateFormData("first_name", e.target.value)}
                placeholder="Juan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                value={formData.middle_name}
                onChange={(e) => updateFormData("middle_name", e.target.value)}
                placeholder="Santos"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => updateFormData("last_name", e.target.value)}
                placeholder="Dela Cruz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">Suffix</Label>
              <Input
                id="suffix"
                value={formData.suffix}
                onChange={(e) => updateFormData("suffix", e.target.value)}
                placeholder="JR"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date">Birth Date</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => updateFormData("birth_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="face_liveness_session_id">Face Liveness Session ID</Label>
            <Input
              id="face_liveness_session_id"
              value={formData.face_liveness_session_id}
              onChange={(e) => updateFormData("face_liveness_session_id", e.target.value)}
              placeholder="UUID from face liveness JS SDK"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={verifyPerson} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Person"
              )}
            </Button>
            <Button variant="outline" onClick={fillSampleData}>
              Sample Data
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">Expected Response: {config.tier === "tier1" ? "Tier I" : "Tier II"}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
          <CardDescription>Verification response from the API</CardDescription>
        </CardHeader>
        <CardContent>
          {response ? (
            <Textarea value={response} readOnly className="font-mono text-sm min-h-[400px]" />
          ) : (
            <div className="flex items-center justify-center h-[400px] text-gray-500">
              No response yet. Fill the form and click "Verify Person".
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
