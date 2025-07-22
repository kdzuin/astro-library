'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage({ projects }: { projects: React.ReactNode }) {
    return (
        <div>
            <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg shadow p-6">{projects}</div>
            </div>
        </div>
    );
}
