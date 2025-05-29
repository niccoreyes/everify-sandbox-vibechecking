"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QrSectionProps {
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

export function QrSection({ config, baseUrl, accessToken }: QrSectionProps) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [qrValue, setQrValue] = useState('{"type":"Digital ID","value":"AAA000"}')
  const [faceLivenessId, setFaceLivenessId] = useState("9cd0cb37-5661-4ccd-9d84-9dmn139c229b")

  const testQrData = [
    { type: "National ID Number", value: "1234123412341234" },
    { type: "Digital ID", value: "AAA000" },
    { type: "National ID Signed", value: '{"type":"National ID Signed"}' },
    { type: "ePhilId", value: "Type:ePhilId" },
    { type: "Philsys Card", value: '{"type":"Philsys Card"}' },
  ]

  const makeRequest = async (endpoint: string, includeSessionId = false) => {
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

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`
      } else {
        headers["Authorization"] = `Bearer ${config.apiKey}`
      }

      const body: any = { value: qrValue }
      if (includeSessionId) {
        body.face_liveness_session_id = faceLivenessId
      }

      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })

      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setResponse(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const checkQr = () => makeRequest("/query/qr/check", false)
  const verifyQr = () => makeRequest("/query/qr", true)

  const loadTestData = (value: string) => {
    setQrValue(value)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Testing
          </CardTitle>
          <CardDescription>Test QR code validation and verification endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!accessToken && !config.apiKey && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please authenticate first or configure an API key to use these endpoints.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="check" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="check">QR Check</TabsTrigger>
              <TabsTrigger value="verify">QR Verify</TabsTrigger>
            </TabsList>

            <TabsContent value="check" className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Endpoint:</span>
                <code className="block p-2 bg-gray-100 rounded text-sm">POST {baseUrl}/query/qr/check</code>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qr-value-check">QR Code Value</Label>
                <Textarea
                  id="qr-value-check"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  placeholder="Enter raw QR code value"
                  className="font-mono text-sm"
                  rows={3}
                />
              </div>

              <Button onClick={checkQr} disabled={loading || !qrValue} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check QR Code
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="verify" className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Endpoint:</span>
                <code className="block p-2 bg-gray-100 rounded text-sm">POST {baseUrl}/query/qr</code>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qr-value-verify">QR Code Value</Label>
                <Textarea
                  id="qr-value-verify"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  placeholder="Enter raw QR code value"
                  className="font-mono text-sm"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="face-liveness">Face Liveness Session ID</Label>
                <Input
                  id="face-liveness"
                  value={faceLivenessId}
                  onChange={(e) => setFaceLivenessId(e.target.value)}
                  placeholder="UUID from face liveness JS SDK"
                />
              </div>

              <Button onClick={verifyQr} disabled={loading || !qrValue || !faceLivenessId} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify QR Code
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>Test Data (Sandbox Only)</Label>
            <div className="grid gap-2">
              {testQrData.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadTestData(item.value)}
                  className="justify-start text-left h-auto p-2"
                >
                  <div>
                    <div className="font-medium">{item.type}</div>
                    <div className="text-xs text-gray-500 truncate">{item.value}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">Expected Response: {config.tier === "tier1" ? "Tier I" : "Tier II"}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
          <CardDescription>QR code validation/verification response from the API</CardDescription>
        </CardHeader>
        <CardContent>
          {response ? (
            <Textarea value={response} readOnly className="font-mono text-sm min-h-[500px]" />
          ) : (
            <div className="flex items-center justify-center h-[500px] text-gray-500">
              No response yet. Enter QR data and test the endpoints.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
