import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {CodeBlock} from "./CodeBlock";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Bot, ExternalLink, Key, Shield} from "lucide-react";

export const AuthSection = () => {
    const headerAuth = `curl -X GET "https://tgmusic.fallenapi.fun/get_track?url=..." \\
  -H "X-API-Key: your-api-key-here"`;

    const queryAuth = `curl -X GET "https://tgmusic.fallenapi.fun/get_track?url=...&api_key=your-api-key-here"`;

    return (
        <section className="py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-8 sm:mb-12">
                    <Badge variant="outline" className="mb-4">
                        <Shield className="w-3 h-3 mr-1"/>
                        Authentication
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">API Authentication</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                        All endpoints require a valid API key for access. Get yours instantly from our bot.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="w-5 h-5"/>
                                Get Your API Key
                            </CardTitle>
                            <CardDescription>
                                Instant API key generation through our Telegram bot
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-code-bg border border-code-border rounded-lg text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Bot className="w-5 h-5 text-primary"/>
                                    <code className="text-sm font-mono">@FallenApiBot</code>
                                </div>
                                <code className="text-xs text-muted-foreground">Send: /apikey</code>
                            </div>

                            <Button
                                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                                onClick={() => window.open("http://t.me/FallenApiBot?start=genApi", "_blank")}
                                onContextMenu={(e) => e.preventDefault()}
                                style={{WebkitTouchCallout: "none", WebkitUserSelect: "none"}}
                            >
                                <Bot className="w-4 h-4 mr-2"/>
                                Open Telegram Bot
                                <ExternalLink className="w-3 h-3 ml-2"/>
                            </Button>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                    <div
                                        className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs">
                                        1
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium">Open Telegram Bot</p>
                                        <p className="text-muted-foreground">Click the button above to open our bot</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                    <div
                                        className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs">
                                        2
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium">Request API Key</p>
                                        <p className="text-muted-foreground">Send <code>/apikey</code> to get your key
                                            instantly</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>How to Use Your API Key</CardTitle>
                            <CardDescription>
                                Two ways to authenticate your requests
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="header" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="header" className="text-xs sm:text-sm">HTTP Header</TabsTrigger>
                                    <TabsTrigger value="query" className="text-xs sm:text-sm">Query
                                        Parameter</TabsTrigger>
                                </TabsList>

                                <TabsContent value="header" className="mt-4">
                                    <CodeBlock code={headerAuth} language="bash"/>
                                </TabsContent>

                                <TabsContent value="query" className="mt-4">
                                    <CodeBlock code={queryAuth} language="bash"/>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};