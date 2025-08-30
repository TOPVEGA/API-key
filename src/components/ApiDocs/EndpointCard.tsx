import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {CodeBlock} from "./CodeBlock";
import {ErrorCodes} from "./ErrorCodes";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Info} from "lucide-react";

interface EndpointCardProps {
    method: string;
    endpoint: string;
    title: string;
    description: string;
    platforms: string[];
    requestExamples: {
        query: string;
        header: string;
    };
    responseExample: string;
    parameters?: Array<{
        name: string;
        type: string;
        required: boolean;
        description: string;
    }>;
}

export const EndpointCard = ({
                                 method,
                                 endpoint,
                                 title,
                                 description,
                                 platforms,
                                 requestExamples,
                                 responseExample,
                                 parameters = []
                             }: EndpointCardProps) => {
    const errorCodes = [
        {
            code: 400,
            title: "Bad Request",
            description: "Missing, invalid URL parameter, or malformed request",
            type: "error" as const,
        },
        {
            code: 401,
            title: "Unauthorized",
            description: "Invalid or missing API key",
            type: "error" as const,
        },
        {
            code: 404,
            title: "Not Found",
            description: endpoint === "/get_track" ? "Track not found or unavailable" : "Content not found or private",
            type: "warning" as const,
        },
        {
            code: 403,
            title: "Forbidden",
            description: "Content private or restricted access",
            type: "warning" as const,
        },
        {
            code: 500,
            title: "Server Error",
            description: endpoint === "/snap" ? "Failed to process media content" : "Download or processing failed",
            type: "error" as const,
        },
    ];
    const getMethodColor = (method: string) => {
        switch (method.toUpperCase()) {
            case 'GET':
                return 'text-api-success border-api-success';
            case 'POST':
                return 'text-api-info border-api-info';
            case 'PUT':
                return 'text-api-warning border-api-warning';
            case 'DELETE':
                return 'text-api-error border-api-error';
            default:
                return 'text-muted-foreground border-muted-foreground';
        }
    };

    return (
        <Card className="mb-6 sm:mb-8 border-border">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <Badge variant="outline" className={`${getMethodColor(method)} font-mono font-bold`}>
                        {method.toUpperCase()}
                    </Badge>
                    <code
                        className="text-sm sm:text-lg font-mono bg-secondary px-3 py-2 rounded-lg border border-border break-all">
                        {endpoint}
                    </code>
                </div>
                <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">{description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                    {platforms.map((platform) => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                        </Badge>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-0">
                <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        Parameters
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-border rounded-lg">
                            <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left p-3 font-medium">Parameter</th>
                                <th className="text-left p-3 font-medium">Type</th>
                                <th className="text-left p-3 font-medium">Required</th>
                                <th className="text-left p-3 font-medium">Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            {parameters.map((param, index) => (
                                <tr key={index} className="border-b border-border last:border-b-0">
                                    <td className="p-3 font-mono text-sm">{param.name}</td>
                                    <td className="p-3">
                                        <Badge variant="secondary" className="text-xs">
                                            {param.type}
                                        </Badge>
                                    </td>
                                    <td className="p-3">
                                        <Badge
                                            variant={param.required ? "destructive" : "secondary"}
                                            className="text-xs"
                                        >
                                            {param.required ? "Yes" : "No"}
                                        </Badge>
                                    </td>
                                    <td className="p-3 text-sm text-muted-foreground">{param.description}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Tabs defaultValue="request" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="request" className="text-xs sm:text-sm">Request</TabsTrigger>
                        <TabsTrigger value="response" className="text-xs sm:text-sm">Response</TabsTrigger>
                        <TabsTrigger value="errors" className="text-xs sm:text-sm">Error Codes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="request" className="mt-4">
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                Example Request
                            </h4>
                            <Tabs defaultValue="query" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="query" className="text-xs sm:text-sm">Query
                                        Parameter</TabsTrigger>
                                    <TabsTrigger value="header" className="text-xs sm:text-sm">HTTP Header</TabsTrigger>
                                </TabsList>

                                <TabsContent value="query" className="mt-4">
                                    <CodeBlock code={requestExamples.query} language="python"/>
                                </TabsContent>

                                <TabsContent value="header" className="mt-4">
                                    <CodeBlock code={requestExamples.header} language="python"/>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </TabsContent>

                    <TabsContent value="response" className="mt-4">
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                Example Response
                            </h4>
                            <CodeBlock code={responseExample} language="json"/>
                        </div>
                    </TabsContent>

                    <TabsContent value="errors" className="mt-4">
                        <ErrorCodes codes={errorCodes}/>
                    </TabsContent>
                </Tabs>

                {endpoint === "/snap" && (
                    <div className="bg-api-info/10 border border-api-info/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-api-info mt-0.5 shrink-0"/>
                            <div className="space-y-2">
                                <h5 className="font-medium text-api-info">Important Notes</h5>
                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>Response may contain either video or image array, or both</li>
                                    <li>Video array includes both video URL and thumbnail</li>
                                    <li>Some platforms may have rate limiting or access restrictions</li>
                                    <li>Private accounts or protected content will return 403 errors</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {endpoint === "/get_track" && (
                    <div className="bg-api-info/10 border border-api-info/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-api-info mt-0.5 shrink-0"/>
                            <div className="space-y-2">
                                <h5 className="font-medium text-api-info">Important Notes</h5>
                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>cdnurl provides direct download stream link (may expire after some time)</li>
                                    <li>For YouTube URLs, cdnurl can return a Telegram post link where the audio file is
                                        served in our channel. For direct stream URLs, you can deploy your own instance
                                        of <a href="https://github.com/AshokShau/TgStream" target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-500 hover:underline hover:text-blue-600 transition-colors">TgStream</a><span
                                            className="text-xs text-muted-foreground ml-1">(opens in new tab)</span> to
                                        get direct stream URLs.
                                    </li>
                                    <li className="mt-2">
                                        <span className="font-medium">Looking for Spotify decryption guides?</span>{' '}
                                        <a
                                            href="https://gist.github.com/AshokShau/ac1009be0a357c72d288371f73ac868c"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                                        >
                                            Check out our comprehensive Spotify decryption guides on GitHub Gist
                                        </a>
                                        <span className="text-xs text-muted-foreground ml-1">(opens in new tab)</span>
                                    </li>
                                    <li>key field is used for internal decryption if needed</li>
                                    <li>lyrics field may be empty if not available for the track</li>
                                    <li>artists array contains all featured artists on the track</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};