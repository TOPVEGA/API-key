import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {ExternalLink, MessageCircle} from "lucide-react";

export const HelpSection = () => {
    return (
        <section className="py-8 sm:py-12 bg-secondary/30">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-8">
                    <Badge variant="outline" className="mb-4">
                        <MessageCircle className="w-3 h-3 mr-1"/>
                        Need Help?
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Get Support</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Get support, report issues, or request new features
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <Card className="text-center">
                        <CardHeader>
                            <MessageCircle className="w-8 h-8 mx-auto text-primary mb-2"/>
                            <CardTitle className="text-lg">Contact Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Get help from our support team
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => window.open('https://t.me/GuardxSupport', '_blank')}
                            >
                                <MessageCircle className="w-4 h-4 mr-2"/>
                                Telegram Support
                                <ExternalLink className="w-3 h-3 ml-1"/>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardHeader>
                            <MessageCircle className="w-8 h-8 mx-auto text-accent mb-2"/>
                            <CardTitle className="text-lg">Join Our Channel</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Stay updated with latest projects
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => window.open('https://t.me/FallenProjects', '_blank')}
                            >
                                <MessageCircle className="w-4 h-4 mr-2"/>
                                FallenProjects
                                <ExternalLink className="w-3 h-3 ml-1"/>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};