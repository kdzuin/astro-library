import { Badge } from "@/components/ui/badge";

interface EntrySimpleProps {
    title: string;
}

export function EntrySimple({ title }: EntrySimpleProps) {
    return <Badge>{title}</Badge>;
}
