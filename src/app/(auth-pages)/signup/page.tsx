"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader } from "@heroui/card";
import { Button, Input } from "@heroui/react";
import { GrFormNext } from "react-icons/gr";

export default function RegisterForm() {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward (optional)
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    church: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && (!formData.firstName || !formData.lastName)) {
      return setError("Please enter name and last name");
    }
    if (step === 2 && !formData.church) {
      return setError("Please enter your church name");
    }
    setDirection(1);
    setStep(step + 1);
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    const { email, password, firstName, lastName, church } = formData;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          church,
        },
      },
    });

    setLoading(false);
    if (error) return setError(error.message);
    setSuccess(true);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="container-sub">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 overflow-hidden">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center mb-4">Iscriviti</h2>
        </CardHeader>

        {success ? (
          <div className="text-green-600 text-center font-medium">
            Check your email to confirm registration!
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-4"
                transition={{ duration: 0.4 }}
              >
                {step === 1 && (
                  <>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </>
                )}

                {step === 2 && (
                  <Input
                    type="text"
                    name="church"
                    placeholder="Church Name"
                    value={formData.church}
                    onChange={handleChange}
                  />
                )}

                {step === 3 && (
                  <>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

            <div className="flex justify-between items-center mt-4">
              {step < 3 ? (
                <Button
                color="primary"
                  onPress={handleNext}
                >
                  Next <GrFormNext />
                </Button>
              ) : (
                <Button onPress={handleRegister} disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
