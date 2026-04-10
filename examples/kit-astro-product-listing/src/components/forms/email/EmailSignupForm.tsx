import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface EmailSignupFormProps {
  emailPlaceholder: string;
  emailErrorMessage: string;
  emailSubmitLabel: string;
  emailSuccessMessage: string;
  buttonVariant?: string;
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

function SuccessCompact({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <svg className="mx-auto mb-4 h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}

export function EmailSignupForm(props: EmailSignupFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const schemaWithDictionary = formSchema.extend({
    email: z.string().email({
      message: props.emailErrorMessage || "Please enter a valid email address",
    }),
  });

  const form = useForm<z.infer<typeof schemaWithDictionary>>({
    resolver: zodResolver(schemaWithDictionary),
    defaultValues: { email: "" },
  });

  function onSubmit() {
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  }

  if (isSubmitted) {
    return <SuccessCompact message={props.emailSuccessMessage} />;
  }

  const btnVariant = (props.buttonVariant as any) || "default";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("@sm:flex-nowrap @sm:flex-row relative flex h-auto w-full gap-2")}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="@sm:min-w-52 shrink-1 grow-1 mt-0 basis-full space-y-0">
              <FormLabel className="sr-only">Email address</FormLabel>
              <FormControl>
                <Input type="email" placeholder={props.emailPlaceholder} {...field} />
              </FormControl>
              <FormMessage className="absolute top-[100%] pt-1 text-inherit" />
            </FormItem>
          )}
        />
        <Button type="submit" variant={btnVariant}>
          {props.emailSubmitLabel}
        </Button>
      </form>
    </Form>
  );
}
