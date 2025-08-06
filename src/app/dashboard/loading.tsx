import { Spinner } from '@/components/ui/spinner';

export default function DashboardLoading() {
    return (
        <div className="w-full h-full place-items-center">
            <Spinner size="small" />
        </div>
    );
}
