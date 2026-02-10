import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import ResetDatabase from "@/components/layout/reset-database";
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
import { Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Please enter password." }),
});

export function Login() {
  const auth = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const email = value.email;
      const password = value.password;
      try {
        setIsLoggingIn(true);
        await auth?.login(email, password);
        toast.success("Log in successful.");
      } catch (error) {
        toast.error(
          "Log in failed. Please check your credentials and try again.",
        );
      } finally {
        setIsLoggingIn(false);
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
            <Coffee className="md:w-40 md:h-40 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Version Coffee</h1>
          </div>
          <p className="text-muted-foreground">Coffee store with chatbot</p>
        </div>
      </div>
      {/* FORM COLUMN - RIGHT SIDE */}
      <div className="w-full md:w-1/2 h-full p-4 md:p-8 flex flex-col items-center justify-center">
        <Card className="w-full flex flex-col justify-between rounded-xl">
          <CardHeader>
            <CardTitle as="h2">Log In</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="login-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup className="flex flex-col justify-center">
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
              form="login-form"
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? <Spinner /> : "LOG IN"}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/signup">SIGN UP FOR NEW ACCOUNT</Link>
            </Button>
            <Separator className="md:my-2" />
            <ResetDatabase />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Login;
