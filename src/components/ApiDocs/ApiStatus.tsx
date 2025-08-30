import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Activity, Clock, Shield} from "lucide-react";

export const ApiStatus = () => {
    return (
        <section className="py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">API Status</CardTitle>
                            <Activity className="h-4 w-4 ml-auto text-api-success"/>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-api-success rounded-full animate-pulse"></div>
                                <span className="text-api-success font-medium">All Systems Operational</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                99.9% uptime guarantee
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                            <Clock className="h-4 w-4 ml-auto text-api-info"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-api-info">~1.2s</div>
                            <p className="text-xs text-muted-foreground">
                                Average response time
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Security</CardTitle>
                            <Shield className="h-4 w-4 ml-auto text-api-success"/>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="secondary" className="bg-api-success/10 text-api-success">
                                SSL Secured
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                                Enterprise-grade encryption
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};