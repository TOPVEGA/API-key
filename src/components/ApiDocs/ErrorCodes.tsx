import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {AlertTriangle, Info, XCircle} from "lucide-react";

interface ErrorCode {
    code: number;
    title: string;
    description: string;
    type: "error" | "warning" | "info";
}

interface ErrorCodesProps {
    codes: ErrorCode[];
}

export const ErrorCodes = ({codes}: ErrorCodesProps) => {
    const getIcon = (type: string) => {
        switch (type) {
            case "error":
                return <XCircle className="w-4 h-4"/>;
            case "warning":
                return <AlertTriangle className="w-4 h-4"/>;
            default:
                return <Info className="w-4 h-4"/>;
        }
    };

    const getVariant = (type: string) => {
        switch (type) {
            case "error":
                return "destructive";
            case "warning":
                return "secondary";
            default:
                return "outline";
        }
    };

    const getTextColor = (type: string) => {
        switch (type) {
            case "error":
                return "text-api-error";
            case "warning":
                return "text-api-warning";
            default:
                return "text-api-info";
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-api-warning"/>
                    Error Codes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {codes.map((error) => (
                        <div key={error.code} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                            <Badge variant={getVariant(error.type)} className="shrink-0">
                                {error.code}
                            </Badge>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                  <span className={getTextColor(error.type)}>
                    {getIcon(error.type)}
                  </span>
                                    <h4 className="font-medium">{error.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">{error.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};