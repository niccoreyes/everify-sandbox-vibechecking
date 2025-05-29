"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Server, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ConfigSectionProps {
  config: {
    environment: "sandbox" | "production"
    tier: "tier1" | "tier2"
    clientId: string
    clientSecret: string
    apiKey: string
  }
  setConfig: (config: any) => void
}

export function ConfigSection({ config, setConfig }: ConfigSectionProps) {
  const updateConfig = (key: string, value: string) => {
    const newConfig = { ...config, [key]: value }

    // Auto-update credentials when tier changes in sandbox
    if (key === "tier" && config.environment === "sandbox") {
      if (value === "tier1") {
        newConfig.clientId = "tier-1-client-id"
        newConfig.clientSecret = "tier-1-client-secret"
        newConfig.apiKey = "TIER 1 TOKEN"
      } else {
        newConfig.clientId = "tier-2-client-id"
        newConfig.clientSecret = "tier-2-client-secret"
        newConfig.apiKey = "TIER 2 TOKEN"
      }
    }

    setConfig(newConfig)
  }

  const testData = [
    { type: "National ID Number", value: "1234123412341234" },
    { type: "Digital ID", value: "AAA000" },
    { type: "National ID Signed", value: '{"type":"National ID Signed"}' },
    { type: "ePhilId", value: "Type:ePhilId" },
    { type: "Philsys Card", value: '{"type":"Philsys Card"}' },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Environment Configuration
          </CardTitle>
          <CardDescription>Configure your API environment and credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="environment">Environment</Label>
            <Select value={config.environment} onValueChange={(value) => updateConfig("environment", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Base URL:{" "}
              {config.environment === "sandbox" ? "https://ws.everify.gov.ph/api/dev" : "https://ws.everify.gov.ph/api"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier">Tier Level</Label>
            <Select value={config.tier} onValueChange={(value) => updateConfig("tier", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tier1">Tier I</SelectItem>
                <SelectItem value="tier2">Tier II</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              value={config.clientId}
              onChange={(e) => updateConfig("clientId", e.target.value)}
              placeholder="Enter client ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientSecret">Client Secret</Label>
            <Input
              id="clientSecret"
              type="password"
              value={config.clientSecret}
              onChange={(e) => updateConfig("clientSecret", e.target.value)}
              placeholder="Enter client secret"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={config.apiKey}
              onChange={(e) => updateConfig("apiKey", e.target.value)}
              placeholder="Enter API key"
            />
          </div>

          {config.environment === "production" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                For production, use credentials from your approved System Application.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sandbox Test Data
          </CardTitle>
          <CardDescription>Sample QR code values for testing in sandbox environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testData.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{item.type}</Badge>
                </div>
                <code className="text-sm text-gray-700 break-all">{item.value}</code>
              </div>
            ))}
          </div>

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>These test values are only valid in the sandbox environment.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
