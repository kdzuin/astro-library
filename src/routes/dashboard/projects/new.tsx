import { Button } from "@/components/ui/button.tsx";
import { Field } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { projectQueryKeys } from "@/hooks/use-projects-query.ts";
import { getUserId } from "@/lib/server/auth-server-func.ts";
import { createProject } from "@/lib/server/functions/projects.ts";
import type { Project } from "@/schemas/project.ts";
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
    name: z.string().trim().min(1, "Project name is required"),
    description: z.string(),
});

type FormSchema = z.infer<typeof formValidation>;

export const Route = createFileRoute("/dashboard/projects/new")({
    component: RouteComponent,
    beforeLoad: async () => {
        const userId = await getUserId();
        return { userId };
    },
    loader: async ({ context }) => {
        if (!context.userId) {
            throw redirect({
                to: "/",
            });
        }

        return {
            userId: context.userId,
        };
    },
});

function concatError(errors: ZodIssue[]) {
    return errors.map((error) => error?.message).join(", ");
}

function RouteComponent() {
    const { userId } = Route.useLoaderData();

    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: FormSchema) =>
            await createProject({ data: values }),
        onSuccess: (data: Project) => {
            queryClient.setQueryData(projectQueryKeys.byId(data.id), data);

            queryClient.invalidateQueries({
                queryKey: projectQueryKeys.byUser(userId),
            });

            navigate({
                to: "/dashboard/projects/$projectId",
                params: { projectId: data.id },
            });
        },
    });
    const form = useForm({
        defaultValues: {
            name: "",
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
                <Button asChild>
                    <Link to="..">
                        <ArrowLeft />
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
                        name={"name"}
                        children={(field) => (
                            <Field
                                id={field.name}
                                label={"Project Name:"}
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
                                label={"Description:"}
                                component={
                                    <Textarea
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
                            <div>
                                <Button type="submit" disabled={!canSubmit}>
                                    {isSubmitting ? "..." : "Submit"}
                                </Button>
                            </div>
                        )}
                    />
                </form>
            </div>
        </main>
    );
}
