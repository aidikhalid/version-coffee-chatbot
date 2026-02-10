import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquareCode } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Spinner } from "@/components/ui/spinner";

const signupSchema = z.object({
  name: z.string().min(1, { message: "Please enter your name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Please enter password." }),
});

export function Signup() {
  const auth = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      const name = value.name;
      const email = value.email;
      const password = value.password;
      try {
        setIsSigningUp(true);
        await auth?.signup(name, email, password);
        toast.success("Sign up successful.");
      } catch (error) {
        toast.error("Sign up failed. Please try again.");
      } finally {
        setIsSigningUp(false);
      }
    },
  });

  return (
    <div className="h-full flex flex-col md:flex-row relative items-center">
      <div className="absolute top-0 w-full flex p-4 md:p-8 justify-end">
        <ModeToggle />
      </div>
      {/* LOW-GOW COLUMN - LEFT SIDE */}
      <div className="w-full md:w-1/2 h-full pt-4 md:pt-6 pb-2 flex items-center justify-center">
        <div className="text-center">
          <div className="flex md:flex-col md:mb-2 items-center justify-center gap-2">
            <MessageSquareCode className="md:w-40 md:h-40 text-primary" />
            <h1 className="text-2xl font-bold text-primary">AI Chat Type</h1>
          </div>
          <p className="text-muted-foreground">Powered by ChatGPT 4o Mini</p>
        </div>
      </div>
      {/* FORM COLUMN - RIGHT SIDE */}
      <div className="w-full md:w-1/2 h-full p-4 md:p-8 flex flex-col items-center justify-center">
        <Card className="w-full flex flex-col justify-between rounded-xl">
          <CardHeader>
            <CardTitle as="h2">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="signup-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup className="flex flex-col justify-center">
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Enter your name"
                          autoComplete="name"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Enter your email"
                          autoComplete="email"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              form="signup-form"
              className="w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? <Spinner /> : "SIGN UP"}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/login">HAVE AN ACCOUNT? LOG IN</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Signup;
