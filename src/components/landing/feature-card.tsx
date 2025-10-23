import type { LucideIcon } from "lucide-react";

// Feature Icon Component
interface FeatureIconProps {
    icon: LucideIcon;
    gradientClass: string;
}

export function FeatureIcon({ icon: Icon, gradientClass }: FeatureIconProps) {
    return (
        <div
            className={`w-12 h-12 ${gradientClass} rounded-lg flex items-center justify-center mb-4`}
        >
            <Icon className="h-6 w-6 text-white" />
        </div>
    );
}

// Feature Card Component
interface FeatureCardProps {
    icon: LucideIcon;
    gradientClass: string;
    title: string;
    description: string;
}

export function FeatureCard({
    icon,
    gradientClass,
    title,
    description,
}: FeatureCardProps) {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
            <FeatureIcon icon={icon} gradientClass={gradientClass} />
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-white/70">{description}</p>
        </div>
    );
}
