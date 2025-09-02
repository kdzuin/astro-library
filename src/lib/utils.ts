import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function tagsStringToArray(tagsString?: string): string[] {
	if (!tagsString) return [];

	return tagsString
		.split(",")
		.map((tag) => tag.trim())
		.filter(Boolean);
}

export function tagsArrayToString(tagsArray?: string[]): string {
	if (!tagsArray) return "";

	return tagsArray
		.map((tag) => tag.trim())
		.filter(Boolean)
		.join(", ");
}

export function convertSecondsToHoursMinutes(seconds: number) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	return `${hours}h ${minutes}m`;
}
