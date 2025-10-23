import { createServerFn } from "@tanstack/react-start";
import { getWebRequest, setHeader } from "@tanstack/react-start/server";

export const setCookieFn = createServerFn({ method: "POST" })
    .validator((data: { name: string; value: string }) => data)
    .handler(async ({ data }: { data: { name: string; value: string } }) => {
        // Create cookie string with proper options
        const cookieOptions = [
            `${data.name}=${data.value}`,
            "HttpOnly",
            "SameSite=Lax",
            `Max-Age=${60 * 60 * 24 * 7}`, // 7 days
            "Path=/",
        ];

        if (process.env.NODE_ENV === "production") {
            cookieOptions.push("Secure");
        }

        setHeader("Set-Cookie", cookieOptions.join("; "));
    });

export const deleteCookieFn = createServerFn({ method: "POST" })
    .validator((data: { name: string }) => data)
    .handler(async ({ data }: { data: { name: string } }) => {
        // Set cookie with past expiration date to delete it
        const cookieOptions = [
            `${data.name}=`,
            "HttpOnly",
            "SameSite=Lax",
            "Max-Age=0",
            "Path=/",
            "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        ];

        if (process.env.NODE_ENV === "production") {
            cookieOptions.push("Secure");
        }

        setHeader("Set-Cookie", cookieOptions.join("; "));
    });

export const getCookieFn = createServerFn({ method: "GET" })
    .validator((name: string) => name)
    .handler(async ({ data: name }: { data: string }) => {
        const request = getWebRequest();
        const cookieHeader = request.headers.get("cookie");

        if (!cookieHeader) {
            return null;
        }

        // Parse cookies from header
        const cookies = cookieHeader.split(";").reduce(
            (acc, cookie) => {
                const [key, value] = cookie.trim().split("=");
                if (key && value) {
                    acc[key] = decodeURIComponent(value);
                }
                return acc;
            },
            {} as Record<string, string>,
        );

        return cookies[name] || null;
    });
