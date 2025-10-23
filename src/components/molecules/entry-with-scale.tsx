import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EntryWithScaleProps {
    title: string;
}

function Scale({ bandName, value }: { bandName: string; value: number }) {
    const mapBandToColor: Record<string, string> = {
        Ha: "bg-red-400",
        OIII: "bg-blue-400",
        SII: "bg-green-400",
    };

    return (
        <div
            className={cn("h-1 rounded-md", mapBandToColor[bandName])}
            style={{ width: `${value * 100}%` }}
        />
    );
}

export function EntryWithScale({ title }: EntryWithScaleProps) {
    return (
        <Card className="p-2 gap-1 rounded-sm">
            <CardHeader className="px-0">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-0.5 px-0">
                <Scale bandName="Ha" value={0.8} />
                <Scale bandName="OIII" value={0.6} />
                <Scale bandName="SII" value={0.4} />
            </CardContent>
        </Card>
    );
}
