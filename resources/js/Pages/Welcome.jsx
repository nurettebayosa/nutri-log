import { Head } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Sprout, Droplet, Activity } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Sanity Test" />
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sprout className="h-6 w-6 text-primary" />
                            <CardTitle>Nutri-Log Sanity Test</CardTitle>
                        </div>
                        <CardDescription>
                            Foundation Phase 1 ✅ — sekarang test shadcn
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant="default">Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                            <Badge variant="outline">Outline</Badge>
                        </div>
                        <div className="space-y-2">
                            <Button className="w-full">
                                <Droplet className="mr-2 h-4 w-4" />
                                Primary Button
                            </Button>
                            <Button variant="secondary" className="w-full">
                                <Activity className="mr-2 h-4 w-4" />
                                Secondary Button
                            </Button>
                            <Button variant="outline" className="w-full">
                                Outline Button
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
