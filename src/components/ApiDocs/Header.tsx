import {Badge} from "@/components/ui/badge";

export const ApiDocsHeader = () => {
    return (
        <header className="border-b border-border bg-card">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <div
                        className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-primary-foreground">FA</span>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                            Fallen API
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Extract content from music platforms and social media
                        </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                        v3.0
                    </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                    <div className="p-4 sm:p-6 rounded-xl bg-secondary border border-border">
                        <h3 className="font-semibold text-accent mb-2">Music Platforms</h3>
                        <p className="text-sm text-muted-foreground">
                            YouTube, Spotify, Apple Music, SoundCloud
                        </p>
                    </div>
                    <div className="p-4 sm:p-6 rounded-xl bg-secondary border border-border">
                        <h3 className="font-semibold text-api-info mb-2">Social Media</h3>
                        <p className="text-sm text-muted-foreground">
                            Instagram, Twitter, Facebook, TikTok, Threads, Twitch, Reddit, Pinterest, Bilibili
                        </p>
                    </div>
                    <div
                        className="p-4 sm:p-6 rounded-xl bg-secondary border border-border sm:col-span-2 lg:col-span-1">
                        <h3 className="font-semibold text-api-warning mb-2">Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                            API Key via header or query parameter
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};