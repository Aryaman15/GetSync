import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/logo";
import { EMPLOYEE_CREDENTIALS } from "@/constant";

const SignUp = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          GetSync.
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Login access only</CardTitle>
              <CardDescription>
                Sign-up is disabled. Use your assigned employee credentials to
                sign in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="rounded-md border text-sm">
                  <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-2 border-b bg-muted/40 px-3 py-2 font-medium">
                    <span>Name</span>
                    <span>Employee code</span>
                    <span>Password</span>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {EMPLOYEE_CREDENTIALS.map((credential) => (
                      <div
                        key={credential.employeeCode}
                        className="grid grid-cols-[1.2fr_1fr_1fr] gap-2 border-b px-3 py-2 last:border-b-0"
                      >
                        <span>{credential.name}</span>
                        <span>{credential.employeeCode}</span>
                        <span>{credential.password}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link to="/">Go to login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
