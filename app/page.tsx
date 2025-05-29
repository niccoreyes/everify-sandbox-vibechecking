"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, QrCode, User, Settings } from "lucide-react"
import { AuthSection } from "@/components/auth-section"
import { VerifySection } from "@/components/verify-section"
import { QrSection } from "@/components/qr-section"
import { ConfigSection } from "@/components/config-section"

export default function PSAeVerifyTester() {
  const [config, setConfig] = useState({
    environment: "sandbox" as "sandbox" | "production",
    tier: "tier1" as "tier1" | "tier2",
    clientId: "tier-1-client-id",
    clientSecret: "tier-1-client-secret",
    apiKey: "TIER 1 TOKEN",
  })

  const [accessToken, setAccessToken] = useState("")

  const baseUrl =
    config.environment === "sandbox" ? "https://ws.everify.gov.ph/api/dev" : "https://ws.everify.gov.ph/api"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">PSA eVerify API Tester</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test and interact with the Philippine Statistics Authority eVerify API for National ID verification
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant={config.environment === "sandbox" ? "default" : "destructive"}>
              {config.environment.toUpperCase()}
            </Badge>
            <Badge variant="outline">{config.tier === "tier1" ? "Tier I" : "Tier II"}</Badge>
            {accessToken && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Key className="h-3 w-3" />
                Authenticated
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Authentication
            </TabsTrigger>
            <TabsTrigger value="verify" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Verification
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <ConfigSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="auth">
            <AuthSection config={config} baseUrl={baseUrl} accessToken={accessToken} setAccessToken={setAccessToken} />
          </TabsContent>

          <TabsContent value="verify">
            <VerifySection config={config} baseUrl={baseUrl} accessToken={accessToken} />
          </TabsContent>

          <TabsContent value="qr">
            <QrSection config={config} baseUrl={baseUrl} accessToken={accessToken} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-600">
              <p>PSA eVerify API Tester - For testing and development purposes</p>
              <p className="mt-1">© 2024 National ID | eVerify - All Rights Reserved</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
