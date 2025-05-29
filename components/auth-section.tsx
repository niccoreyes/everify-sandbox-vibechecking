"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Key, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthSectionProps {
  config: {
    environment: "sandbox" | "production"
    tier: "tier1" | "tier2"
    clientId: string
    clientSecret: string
    apiKey: string
  }
  baseUrl: string
  accessToken: string
  setAccessToken: (token: string) => void
}

export function AuthSection({ config, baseUrl, accessToken, setAccessToken }: AuthSectionProps) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")

  const authenticate = async () => {
    setLoading(true)
    setError("")
    setResponse("")

    try {
      const requestBody = {
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }

      const res = await fetch(`${baseUrl}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))

      if (res.ok && data.data?.access_token) {
        setAccessToken(data.data.access_token)
      } else {
        setError("Authentication failed")
      }
    } catch (err) {
      setError("Network error occurred")
      setResponse(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const clearToken = () => {
    setAccessToken("")
    setResponse("")
    setError("")
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Authentication
          </CardTitle>
          <CardDescription>Get an access token for API requests (expires in 30 minutes)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              {accessToken ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Authenticated
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Not Authenticated
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Endpoint:</span>
            <code className="block p-2 bg-gray-100 rounded text-sm">POST {baseUrl}/auth</code>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Request Body:</span>
            <Textarea
              value={JSON.stringify(
                {
                  client_id: config.clientId,
                  client_secret: config.clientSecret,
                },
                null,
                2,
              )}
              readOnly
              className="font-mono text-sm"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={authenticate}
              disabled={loading || !config.clientId || !config.clientSecret}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Get Access Token"
              )}
            </Button>
            {accessToken && (
              <Button variant="outline" onClick={clearToken}>
                Clear
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
          <CardDescription>Authentication response from the API</CardDescription>
        </CardHeader>
        <CardContent>
          {response ? (
            <Textarea value={response} readOnly className="font-mono text-sm min-h-[300px]" />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No response yet. Click "Get Access Token" to authenticate.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
