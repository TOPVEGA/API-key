import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, Play, XCircle } from "lucide-react";

interface EndpointParam {
    type: string;
    required?: boolean;
    default?: any;
    example?: any;
    description: string;
    enum?: string[];
}

interface Endpoint {
    path?: string;
    endpoint?: string;
    method: string;
    description: string;
    params?: Record<string, EndpointParam>;
    requiresUrl?: boolean;
}

interface QuickTestProps {
    endpoints: Endpoint[];
    baseUrl: string;
}

export const QuickTest = ({ endpoints, baseUrl }: QuickTestProps) => {
    const [apiKey, setApiKey] = useState("");
    const [selectedEndpoint, setSelectedEndpoint] = useState("");
    const [endpointParams, setEndpointParams] = useState<Record<string, any>>({});
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    
    // Get the currently selected endpoint data
    const currentEndpoint = endpoints.find(ep => 
        ep.path === selectedEndpoint || ep.endpoint === selectedEndpoint
    );
    const requiresUrl = currentEndpoint?.requiresUrl ?? true; // Default to true for backward compatibility
    
    // Update form values when endpoint changes
    useEffect(() => {
        if (currentEndpoint?.params) {
            const initialValues: Record<string, any> = {};
            if (currentEndpoint.requiresUrl !== false) {
                initialValues.url = "https://open.spotify.com/track/6v8mSl4GZXok3Ebe9x4Jmr?si=92f724a39de84108";
            }
            
            Object.entries(currentEndpoint.params).forEach(([paramName, paramDef]) => {
                if (paramDef.default !== undefined) {
                    initialValues[paramName] = paramDef.default;
                } else if (paramDef.example !== undefined) {
                    initialValues[paramName] = paramDef.example;
                } else if (paramDef.type === 'boolean') {
                    initialValues[paramName] = false;
                } else if (paramDef.type === 'number') {
                    initialValues[paramName] = 0;
                } else if (paramDef.type === 'array') {
                    initialValues[paramName] = [];
                } else {
                    initialValues[paramName] = '';
                }
            });
            setFormValues(initialValues);
            
        }
    }, [selectedEndpoint]);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [statusCode, setStatusCode] = useState<number | null>(null);
    const {toast} = useToast();

    const handleInputChange = (name: string, value: any) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const testEndpoint = async () => {
        // Validate required fields
        const missingFields = [];
        if (!apiKey) missingFields.push('API Key');
        if (!selectedEndpoint) missingFields.push('Endpoint');
        
        // Check required params
        currentEndpoint?.params && Object.entries(currentEndpoint.params).forEach(([param, def]) => {
            if (def.required && !formValues[param]) {
                missingFields.push(param);
            }
        });
        
        if (missingFields.length > 0) {
            toast({
                title: "Missing required fields",
                description: `Please fill in: ${missingFields.join(', ')}`,
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setResponse(null);
        setStatusCode(null);

        try {
            if (!selectedEndpoint) {
                throw new Error('No endpoint selected');
            }
            
            const params = new URLSearchParams();
            
            // Add API key
            params.append('api_key', apiKey);
            
            // Add all form values to params
            Object.entries(formValues).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, v));
                    } else {
                        params.append(key, String(value));
                    }
                }
            });

            // Get the endpoint path, removing any leading/trailing slashes
            const endpointPath = selectedEndpoint.replace(/^\/+|\/+$/g, '');
            
            // Construct the full URL
            const apiBaseUrl = baseUrl.replace(/\/+$/, '');
            const endpointUrl = `${apiBaseUrl}/${endpointPath}?${params}`;
            
            const apiResponse = await fetch(endpointUrl);
            const responseData = await apiResponse.json();

            setStatusCode(apiResponse.status);
            setResponse(responseData);

            toast({
                title: apiResponse.ok ? "Success!" : "API Error",
                description: `Status: ${apiResponse.status}`,
                variant: apiResponse.ok ? "default" : "destructive",
            });
        } catch (error) {
            setStatusCode(0);
            setResponse({error: "Network error occurred"});
            toast({
                title: "Network Error",
                description: "Failed to connect to the API",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: number | null) => {
        if (!status) return "text-gray-600";
        if (status >= 200 && status < 300) return "text-green-600";
        if (status >= 400 && status < 500) return "text-yellow-600";
        if (status >= 500) return "text-red-600";
        return "text-gray-600";
    };

    const getStatusIcon = (status: number | null) => {
        if (!status) return null;
        if (status >= 200 && status < 300)
            return <CheckCircle className="w-4 h-4 text-green-600"/>;
        return <XCircle className="w-4 h-4 text-red-600"/>;
    };

    return (
        <section className="py-10 sm:py-16 bg-gradient-to-b from-muted/50 to-background">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <Badge variant="secondary" className="mb-3 inline-flex items-center px-2 py-1">
                        <Play className="w-4 h-4 mr-1"/>
                        API Tester
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">Test API Endpoints</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                        Enter your credentials and instantly see responses from your selected API.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto border shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">API Endpoint Tester</CardTitle>
                        <CardDescription>
                            Provide your API key, pick an endpoint, and test it with a sample URL.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="api-key">API Key</Label>
                                <Input
                                    id="api-key"
                                    type="password"
                                    placeholder="Enter your API key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endpoint">Endpoint</Label>
                                <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an endpoint">
                                            {currentEndpoint?.description || 'Select an endpoint'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {endpoints.map((endpoint) => (
                                            <SelectItem 
                                                key={endpoint.path || endpoint.endpoint} 
                                                value={endpoint.path || endpoint.endpoint || ''}
                                            >
                                                {(endpoint.path || endpoint.endpoint || '').replace(/^\//, '')} — {endpoint.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {currentEndpoint?.params && Object.entries(currentEndpoint.params).map(([paramName, paramDef]) => (
                            <div key={paramName} className="space-y-2">
                                <Label htmlFor={paramName}>
                                    {paramName}
                                    {paramDef.required && <span className="text-destructive ml-1">*</span>}
                                </Label>
                                {paramDef.type === 'select' || paramDef.enum ? (
                                    <Select
                                        value={formValues[paramName] || ''}
                                        onValueChange={(value) => handleInputChange(paramName, value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Select ${paramName}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paramDef.enum?.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : paramDef.type === 'boolean' ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={paramName}
                                            checked={!!formValues[paramName]}
                                            onChange={(e) => handleInputChange(paramName, e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor={paramName} className="text-sm font-medium">
                                            {paramDef.description}
                                        </Label>
                                    </div>
                                ) : (
                                    <Input
                                        id={paramName}
                                        type={paramDef.type === 'number' ? 'number' : 'text'}
                                        placeholder={paramDef.description}
                                        value={formValues[paramName] || ''}
                                        onChange={(e) => {
                                            const value = paramDef.type === 'number' 
                                                ? parseFloat(e.target.value) || 0 
                                                : e.target.value;
                                            handleInputChange(paramName, value);
                                        }}
                                    />
                                )}
                                {paramDef.description && (
                                    <p className="text-xs text-muted-foreground">
                                        {paramDef.description}
                                    </p>
                                )}
                            </div>
                        ))}
                        
                        <Button
                            onClick={testEndpoint}
                            disabled={isLoading || !apiKey || !selectedEndpoint}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                    Testing API...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2"/>
                                    Test Endpoint
                                </>
                            )}
                        </Button>

                        {statusCode !== null && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(statusCode)}
                                    <span className={`font-medium ${getStatusColor(statusCode)}`}>
                    Status: {statusCode}
                  </span>
                                </div>

                                {response && (
                                    <div className="space-y-2">
                                        <Label>Response</Label>
                                        <div className="bg-muted rounded-lg p-4 max-h-96 overflow-auto">
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};
