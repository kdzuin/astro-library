import { Button } from "@/components/ui/button.tsx";
import { Field } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { sessionsQueryKeys } from "@/hooks/use-sessions-query.ts";
import { getUserId } from "@/lib/server/auth-server-func.ts";
import { createSession } from "@/lib/server/functions/sessions.ts";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Link,
    createFileRoute,
    redirect,
    useNavigate,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import type { ZodIssue } from "zod/v3";

const formValidation = z.object({
    date: z.string().trim().min(1, "Session date is required"),
    description: z.string(),
});

type FormSchema = z.infer<typeof formValidation>;

export const Route = createFileRoute(
    "/dashboard/projects/$projectId/sessions/new",
)({
    component: RouteComponent,
    beforeLoad: async ({ params }) => {
        const userId = await getUserId();
        return { userId, projectId: params.projectId };
    },
    loader: async ({ context }) => {
        if (!context.userId) {
            throw redirect({
                to: "/",
            });
        }

        return {
            userId: context.userId,
            projectId: context.projectId,
        };
    },
});

function concatError(errors: ZodIssue[]) {
    return errors.map((error) => error?.message).join(", ");
}

function RouteComponent() {
    const { userId, projectId } = Route.useLoaderData();

    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: FormSchema) => {
            return await createSession({
                data: { ...values, userId, projectId },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: sessionsQueryKeys.byProject(projectId),
            });

            navigate({
                to: "/dashboard/projects/$projectId/sessions",
                params: { projectId },
            });
        },
    });
    const form = useForm({
        defaultValues: {
            date: "",
            description: "",
        } as FormSchema,
        validators: {
            onDynamic: formValidation,
        },
        validationLogic: revalidateLogic(),
        onSubmit: async ({ value }) => {
            try {
                await mutation.mutateAsync(value);
            } catch (error: unknown) {
                setSubmissionError(`${error}`);
            }
        },
    });

    return (
        <main className="w-full min-h-screen bg-brand-gradient text-white/80  px-4 sm:px-6 lg:px-8 py-10 space-y-4">
            <div className="flex items-center gap-4">
                <Button asChild variant="modest">
                    <Link to="..">
                        <ArrowLeft /> Go Back
                    </Link>
                </Button>
                <div className="text-3xl md:text-4xl font-bold">
                    Add New Project
                </div>
            </div>
            <div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        form.handleSubmit();
                    }}
                    className={"grid gap-4"}
                >
                    <form.Field
                        name={"date"}
                        children={(field) => (
                            <Field
                                id={field.name}
                                label={"Session Date:"}
                                component={
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                    />
                                }
                                errorMessage={concatError(
                                    field.state.meta.errors as ZodIssue[],
                                )}
                                isInvalid={
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid
                                }
                            />
                        )}
                    />
                    <form.Field
                        name={"description"}
                        children={(field) => (
                            <Field
                                id={field.name}
                                label={"Session Description:"}
                                component={
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                    />
                                }
                                errorMessage={concatError(
                                    field.state.meta.errors as ZodIssue[],
                                )}
                                isInvalid={
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid
                                }
                            />
                        )}
                    />
                    {submissionError && (
                        <div className="text-red-500">{submissionError}</div>
                    )}
                    <form.Subscribe
                        selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting || mutation.isPending,
                        ]}
                        children={([canSubmit, isSubmitting]) => (
                            <Button type="submit" disabled={!canSubmit}>
                                {isSubmitting ? "..." : "Submit"}
                            </Button>
                        )}
                    />
                </form>
            </div>
        </main>
    );
}
