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

export interface SubmitInfoFormProps {
  firstNameLabel: string;
  firstNamePlaceholder: string;
  lastNameLabel: string;
  lastNamePlaceholder: string;
  zipcodeLabel: string;
  zipcodePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailErrorMessage: string;
  phoneLabel: string;
  phonePlaceholder: string;
  buttonText: string;
  successMessage: string;
  buttonVariant?: string;
  className?: string;
}

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  zipcode: z
    .string()
    .min(1, { message: "Zipcode is required" })
    .regex(/(^\d{5}$)|(^\d{5}-\d{4}$)/, { message: "Please enter a valid zipcode" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
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

export function SubmitInfoForm(props: SubmitInfoFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const schemaWithDictionary = formSchema.extend({
    email: z.string().email({
      message: props.emailErrorMessage || "Please enter a valid email address",
    }),
  });

  const form = useForm<z.infer<typeof schemaWithDictionary>>({
    resolver: zodResolver(schemaWithDictionary),
    defaultValues: { firstName: "", lastName: "", zipcode: "", email: "", phone: "" },
  });

  function onSubmit() {
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  }

  if (isSubmitted) {
    return <SuccessCompact message={props.successMessage} />;
  }

  const formItemClasses = "relative space-y-2";
  const labelClasses = "block text-foreground text-left";
  const inputClasses = "rounded-md px-2 py-3 border-foreground bg-background text-foreground";
  const errorClasses = "absolute -translate-y-[5px] text-[#ff5252]";
  const btnVariant = (props.buttonVariant as any) || "default";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[750px] space-y-9 group-[.position-center]:mx-auto group-[.position-right]:ml-auto"
      >
        <FormField control={form.control} name="firstName" render={({ field }) => (
          <FormItem className={formItemClasses}>
            <FormLabel className={labelClasses}>{props.firstNameLabel}</FormLabel>
            <FormControl><Input type="text" placeholder={props.firstNamePlaceholder} className={inputClasses} {...field} /></FormControl>
            <FormMessage className={errorClasses} />
          </FormItem>
        )} />
        <FormField control={form.control} name="lastName" render={({ field }) => (
          <FormItem className={formItemClasses}>
            <FormLabel className={labelClasses}>{props.lastNameLabel}</FormLabel>
            <FormControl><Input type="text" placeholder={props.lastNamePlaceholder} className={inputClasses} {...field} /></FormControl>
            <FormMessage className={errorClasses} />
          </FormItem>
        )} />
        <FormField control={form.control} name="zipcode" render={({ field }) => (
          <FormItem className={formItemClasses}>
            <FormLabel className={labelClasses}>{props.zipcodeLabel}</FormLabel>
            <FormControl><Input type="tel" placeholder={props.zipcodePlaceholder} className={inputClasses} {...field} /></FormControl>
            <FormMessage className={errorClasses} />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem className={formItemClasses}>
            <FormLabel className={labelClasses}>{props.emailLabel}</FormLabel>
            <FormControl><Input type="email" placeholder={props.emailPlaceholder} className={inputClasses} {...field} /></FormControl>
            <FormMessage className={errorClasses} />
          </FormItem>
        )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem className={formItemClasses}>
            <FormLabel className={labelClasses}>{props.phoneLabel}</FormLabel>
            <FormControl><Input type="tel" placeholder={props.phonePlaceholder} className={inputClasses} {...field} /></FormControl>
            <FormMessage className={errorClasses} />
          </FormItem>
        )} />
        <div>
          <Button className="mt-4" type="submit" variant={btnVariant}>{props.buttonText}</Button>
        </div>
      </form>
    </Form>
  );
}
