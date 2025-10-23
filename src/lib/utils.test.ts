import { cn, tagsArrayToString, tagsStringToArray } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("cn util", () => {
    it("should merge classnames", () => {
        const expected = "bg-red-500 text-white";
        expect(cn("bg-red-500", "text-white")).toEqual(expected);
    });

    it("should merge classnames with semantic overwrite", () => {
        const expected = "text-white bg-blue-500 p-4 hover:bg-blue-600";
        expect(
            cn(
                "bg-red-500",
                "text-white",
                "bg-blue-500",
                "p-1",
                "p-4",
                "hover:bg-blue-600",
            ),
        ).toEqual(expected);
    });
});

describe("Utils", () => {
    describe("tagsStringToArray", () => {
        it("should convert a string of tags separated by commas into an array", () => {
            const tagsString = "tag1, tag2, tag3";
            const expected = ["tag1", "tag2", "tag3"];
            expect(tagsStringToArray(tagsString)).toEqual(expected);
        });

        it("should handle empty string", () => {
            const tagsString = "";
            const expected: string[] = [];
            expect(tagsStringToArray(tagsString)).toEqual(expected);
        });

        it("should handle undefined args", () => {
            const expected: string[] = [];
            expect(tagsStringToArray(undefined)).toEqual(expected);
        });

        it("should handle falsy values", () => {
            const tagsString = "tag1, , tag2, , , tag3";
            const expected = ["tag1", "tag2", "tag3"];
            expect(tagsStringToArray(tagsString)).toEqual(expected);
        });
    });

    describe("tagsArrayToString", () => {
        it("should convert an array of tags into a string", () => {
            const tagsArray = ["tag1", "tag2", "tag3"];
            const expected = "tag1, tag2, tag3";
            expect(tagsArrayToString(tagsArray)).toEqual(expected);
        });

        it("should handle empty array", () => {
            const tagsArray: string[] = [];
            const expected = "";
            expect(tagsArrayToString(tagsArray)).toEqual(expected);
        });

        it("should handle falsy values", () => {
            const tagsArray = ["tag1", "tag2", "  ", "tag3", ""];
            const expected = "tag1, tag2, tag3";
            expect(tagsArrayToString(tagsArray)).toEqual(expected);
        });

        it("should handle undefined args", () => {
            const expected = "";
            expect(tagsArrayToString(undefined)).toEqual(expected);
        });
    });
});
