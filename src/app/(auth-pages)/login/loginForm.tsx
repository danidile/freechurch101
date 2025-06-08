"use client";
import { Spinner } from "@heroui/spinner";
import { signUpAction } from "@/app/actions";
import { signInAction } from "@/app/actions";
import { FormMessage } from "@/app/components/form-message";
import { Input, Button, CardHeader, CardFooter } from "@heroui/react";
import { authSchema, TauthSchema } from "@/utils/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TalertMessage } from "@/utils/types/types";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import SignInWithGoogleButton from "../SignInWithGoogleButton";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import GetParamsMessage from "@/app/components/getParams";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TauthSchema>({
    resolver: zodResolver(authSchema),
  });
  const [selected, setSelected] = useState<string>("accedi");
  const signUpFunction = async (data: TauthSchema) => {
    await signUpAction(data);
    fetchUser();
  };
  const loginFunction = async (data: TauthSchema) => {
    await signInAction(data);
    fetchUser();
    router.push("/protected/dashboard/account"); // Or wherever you want to redirect
  };
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { userData, loading, fetchUser } = useUserStore();
  useEffect(() => {
    if (!loading && userData.loggedIn && userData.fetched) {
      router.push("/protected/dashboard/account");
    }
  }, [loading, userData.loggedIn, userData.fetched]);
  return (
    <div className="container-sub">
      <div className="flex flex-col">
        <Card className="max-w-full w-[340px]">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-medium capitalize mx-auto my-4">
              {selected}
            </h1>
          </CardHeader>
          <CardBody>
            <Tabs
              fullWidth
              aria-label="Tabs form"
              selectedKey={selected}
              size="md"
              onSelectionChange={(key) => setSelected(String(key))}
            >
              <Tab key="accedi" title="Accedi">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(loginFunction)}
                >
                  <Input
                    {...register("email")}
                    isRequired
                    label="Email"
                    placeholder="email..."
                    type="email"
                  />
                  <Input
                    {...register("password")}
                    isRequired
                    label="Password"
                    minLength={8}
                    placeholder="password..."
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                        ) : (
                          <FaEye className="text-xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                  />
                  <Link
                    href="/forgot-password"
                    className="text-center text-small text-blue-600 underline"
                  >
                    Password dimenticata?
                  </Link>
                  <Button
                    fullWidth
                    color="primary"
                    variant="shadow"
                    type="submit"
                    className="mb-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Accedi"
                    )}
                  </Button>
                  <SignInWithGoogleButton />
                </form>
              </Tab>

              <Tab key="iscriviti" title="Iscriviti">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(signUpFunction)}
                >
                  <Input
                    {...register("email")}
                    isRequired
                    label="Email"
                    placeholder="email..."
                    type="email"
                  />
                  <Input
                    {...register("password")}
                    isRequired
                    label="Password"
                    minLength={8}
                    placeholder="password..."
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                        ) : (
                          <FaEye className="text-xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                  />
                  <p className="text-center text-small">
                    Hai già un account?{" "}
                    <Button size="sm" onPress={() => setSelected("accedi")}>
                      Accedi
                    </Button>
                  </p>
                  <Button
                    fullWidth
                    color="primary"
                    variant="shadow"
                    type="submit"
                    className="mb-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Iscriviti"
                    )}
                  </Button>
                  <SignInWithGoogleButton />
                </form>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
