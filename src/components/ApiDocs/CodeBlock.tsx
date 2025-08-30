import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Check, Copy} from "lucide-react";
import {useEffect, useState} from "react";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";

interface CodeBlockProps {
    code: string;
    language?: string;
    title?: string;
}

export const CodeBlock = ({code, language = "text", title}: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        Prism.highlightAll();
    }, [code, language]);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="bg-code-bg border-code-border overflow-hidden">
            {title && (
                <div className="px-4 py-2 border-b border-code-border bg-secondary/50">
                    <span className="text-sm font-medium text-muted-foreground">{title}</span>
                </div>
            )}
            <div className="relative">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-secondary z-10"
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-api-success"/>
                    ) : (
                        <Copy className="h-4 w-4"/>
                    )}
                </Button>
                <pre className="p-4 pr-12 overflow-x-auto text-sm">
          <code className={`language-${language} whitespace-pre`}>{code}</code>
        </pre>
            </div>
        </Card>
    );
};