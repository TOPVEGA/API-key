import {Button} from "@/components/ui/button";
import {Monitor, Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";

export const MainHeader = () => {
    const {setTheme, theme} = useTheme();

    const cycleTheme = () => {
        if (theme === "system") {
            setTheme("light");
        } else if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("system");
        }
    };

    const getThemeIcon = () => {
        switch (theme) {
            case "light":
                return <Sun className="h-4 w-4"/>;
            case "dark":
                return <Moon className="h-4 w-4"/>;
            default:
                return <Monitor className="h-4 w-4"/>;
        }
    };

    return (
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-primary-foreground">FA</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                Fallen API
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Powerful content extraction API
                            </p>
                        </div>
                    </div>

                    <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={cycleTheme}>
                        {getThemeIcon()}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};