import { MainHeader } from "@/components/ApiDocs/MainHeader";
import { ApiDocsHeader } from "@/components/ApiDocs/Header";
import { AuthSection } from "@/components/ApiDocs/AuthSection";
import { EndpointCard } from "@/components/ApiDocs/EndpointCard";
import { HelpSection } from "@/components/ApiDocs/HelpSection";
import PricingSection from "@/components/ApiDocs/PricingSection";
import { QuickTest } from "@/components/ApiDocs/QuickTest";
import docs from '../../docs.json';
import React from 'react';

// Helper function to generate example code from endpoint data
const generateExampleCode = (endpoint: any, authType: 'query' | 'header') => {
    const baseUrl = docs.api.base_url;
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const endpointPath = endpoint.path;
    const cleanPath = endpointPath.replace(/^\/+/, '');
    const url = cleanPath ? `${cleanBaseUrl}/${cleanPath}` : cleanBaseUrl;

    if (authType === 'query') {
        let params = {
            api_key: 'Your api key here',
            ...Object.keys(endpoint.params || {}).reduce((acc, key) => {
                if (endpoint.params[key].example) {
                    acc[key] = endpoint.params[key].example;
                }
                return acc;
            }, {} as Record<string, any>)
        };

        const paramsStr = Object.entries(params)
            .map(([key, value]) => `    "${key}": ${JSON.stringify(value)}`)
            .join(',\n');

        return `import requests as r

url = "${url}"
params = {
${paramsStr}
}

req = r.get(url, params=params)

print(req.json())`;
    } else {
        // Header auth
        const params = Object.keys(endpoint.params || {}).reduce((acc, key) => {
            if (endpoint.params[key].example) {
                acc[key] = endpoint.params[key].example;
            }
            return acc;
        }, {} as Record<string, any>);

        const paramsStr = Object.entries(params)
            .map(([key, value]) => `    "${key}": ${JSON.stringify(value)}`)
            .join(',\n');

        return `import requests as r

url = "${url}"
headers = {
    "X-API-Key": "Your api key here"
}
params = {
${paramsStr}
}

req = r.get(url, headers=headers, params=params)

print(req.json())`;
    }
};

// Type for the transformed endpoint data
interface EndpointData {
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
    parameters: Array<{
        name: string;
        type: string;
        required: boolean;
        description: string;
    }>;
}

// Function to transform API endpoint data
const transformEndpoints = (endpoints: any[]): EndpointData[] => {
    return endpoints.map(endpoint => {
        const requestExamples = {
            query: generateExampleCode(endpoint, 'query'),
            header: generateExampleCode(endpoint, 'header')
        };

        return {
            method: endpoint.method,
            endpoint: endpoint.path,
            title: endpoint.description,
            description: endpoint.description,
            platforms: ['All Platforms'],
            requestExamples,
            responseExample: JSON.stringify(
                endpoint.response?.success?.example || // Try success.example first
                endpoint.response?.example ||         // Then try response.example
                endpoint.response ||                  // Then the entire response object
                { message: 'No example response available' },
                null,
                2
            ),
            parameters: Object.entries(endpoint.params || {}).map(([name, param]: [string, any]) => ({
                name,
                type: param.type || 'string',
                required: param.required || false,
                description: param.description || ''
            }))
        };
    });
};

const Index: React.FC = () => {
    // State to hold the transformed endpoints
    const [endpoints, setEndpoints] = React.useState<EndpointData[]>([]);

    // Load and transform endpoints on component mount
    React.useEffect(() => {
        setEndpoints(transformEndpoints(docs.api.endpoints));
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="min-h-screen bg-background">
            <MainHeader />
            <main className="container mx-auto px-4 py-8">
                <ApiDocsHeader />
                <AuthSection />

                <section className="py-8">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">API Endpoints</h2>
                            <p className="text-muted-foreground">
                                Explore the available endpoints to integrate with our API.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {endpoints.map((endpoint, index) => (
                                <EndpointCard
                                    key={index}
                                    method={endpoint.method}
                                    endpoint={endpoint.endpoint}
                                    title={endpoint.title}
                                    description={endpoint.description}
                                    platforms={endpoint.platforms}
                                    requestExamples={endpoint.requestExamples}
                                    responseExample={endpoint.responseExample}
                                    parameters={endpoint.parameters}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Projects Using This API
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Discover amazing applications built with our powerful music and media API
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* FallenBeatZBot Card */}
                        <div
                            className="group relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                            <div className="relative p-8">
                                <div
                                    className="flex items-center justify-center w-16 h-16 mb-6 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                                    <svg className="w-8 h-8 text-primary-foreground" fill="currentColor"
                                         viewBox="0 0 24 24">
                                        <path
                                            d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-center mb-3 text-foreground">FallenBeatzBot</h3>
                                <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                                    Experience seamless music in your Telegram voice chats with high-quality audio
                                    streaming
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => window.open('https://t.me/FallenBeatZBot', '_blank')}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-semibold hover:from-primary/90 hover:to-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 select-none"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                        </svg>
                                        Try Bot
                                    </button>
                                    <button
                                        onClick={() => window.open('https://github.com/TOPVEGA/TgMusicBot', '_blank')}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border hover:border-primary/50 text-foreground font-semibold hover:bg-primary/5 transition-all duration-200 select-none"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                        View on GitHub
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* SpTubeBot Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                            <div className="relative p-8">
                                <div className="flex items-center justify-center w-16 h-16 mb-6 mx-auto rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-lg">
                                    <svg className="w-8 h-8 text-accent-foreground" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-center mb-3 text-foreground">SpTubeBot</h3>
                                <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                                    Download songs in high quality from multiple platforms with advanced search
                                    capabilities
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => window.open('https://t.me/NoiNoi_Bot', '_blank')}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent/90 text-accent-foreground font-semibold hover:from-accent/90 hover:to-accent transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 select-none"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                        </svg>
                                        Try Bot
                                    </button>
                                    <button
                                        onClick={() => window.open('https://github.com/TOPVEGA/SpTubeBot', '_blank')}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border hover:border-accent/50 text-foreground font-semibold hover:bg-accent/5 transition-all duration-200 select-none"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                        View on GitHub
                                    </button>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>
            </main>

            <HelpSection/>

            <PricingSection/>

            <section id="quick-test" className="container mx-auto px-4 py-8">
                <QuickTest endpoints={docs.api.endpoints} baseUrl={docs.api.base_url} />
            </section>

            <footer className="bg-card border-t border-border py-6 sm:py-8">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Built with ❤️ for developers by{" "}
                        <a
                            href="https://github.com/TOPVEGA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent/80 transition-colors"
                        >
                            TOPVEGA
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Index;
