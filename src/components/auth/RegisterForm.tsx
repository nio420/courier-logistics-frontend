"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/hooks/auth/useAuth";
import {
  type CourierRegisterInput,
  type CustomerRegisterInput,
  courierRegisterSchema,
  customerRegisterSchema,
} from "@/schemas/auth.schema";

type AccountType = "CUSTOMER" | "COURIER";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const errorClass = "mt-1 text-sm text-red-600";

export default function RegisterForm() {
  const router = useRouter();

  const { register: submitRegistration, isRegistering } = useAuth();

  const [accountType, setAccountType] = useState<AccountType>("CUSTOMER");

  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [showCustomerConfirmPassword, setShowCustomerConfirmPassword] =
    useState(false);

  const [showCourierPassword, setShowCourierPassword] = useState(false);
  const [showCourierConfirmPassword, setShowCourierConfirmPassword] =
    useState(false);

  const [submitError, setSubmitError] = useState("");

  const customerForm = useForm<CustomerRegisterInput>({
    resolver: zodResolver(customerRegisterSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const courierForm = useForm<CourierRegisterInput>({
    resolver: zodResolver(courierRegisterSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      vehicleType: "",
      vehicleNumber: "",
      licenseNumber: "",
    },
  });

  async function handleCustomerSubmit(
    data: CustomerRegisterInput,
  ): Promise<void> {
    setSubmitError("");

    try {
      const { confirmPassword, ...formData } = data;
      void confirmPassword;

      await submitRegistration({
        ...formData,
        role: "CUSTOMER",
      });

      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    }
  }

  async function handleCourierSubmit(
    data: CourierRegisterInput,
  ): Promise<void> {
    setSubmitError("");

    try {
      const { confirmPassword, ...formData } = data;
      void confirmPassword;

      await submitRegistration({
        ...formData,
        role: "COURIER",
      });

      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    }
  }

  function switchAccountType(type: AccountType): void {
    setAccountType(type);
    setSubmitError("");
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Join our courier and logistics platform.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => switchAccountType("CUSTOMER")}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            accountType === "CUSTOMER"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Customer
        </button>

        <button
          type="button"
          onClick={() => switchAccountType("COURIER")}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            accountType === "COURIER"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Courier
        </button>
      </div>

      {submitError && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {submitError}
        </div>
      )}

      {accountType === "CUSTOMER" ? (
        <form
          onSubmit={customerForm.handleSubmit(handleCustomerSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <label htmlFor="customer-name" className={labelClass}>
              Full name
            </label>
            <input
              id="customer-name"
              autoComplete="name"
              placeholder="Enter your full name"
              className={inputClass}
              {...customerForm.register("name")}
            />
            {customerForm.formState.errors.name?.message && (
              <p className={errorClass}>
                {customerForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="customer-email" className={labelClass}>
              Email address
            </label>
            <input
              id="customer-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
              {...customerForm.register("email")}
            />
            {customerForm.formState.errors.email?.message && (
              <p className={errorClass}>
                {customerForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="customer-password" className={labelClass}>
              Password
            </label>
            <div className="relative">
              <input
                id="customer-password"
                type={showCustomerPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a strong password"
                className={`${inputClass} pr-12`}
                {...customerForm.register("password")}
              />
              <button
                type="button"
                aria-label={
                  showCustomerPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowCustomerPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
              >
                {showCustomerPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
            {customerForm.formState.errors.password?.message && (
              <p className={errorClass}>
                {customerForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="customer-confirm-password" className={labelClass}>
              Confirm password
            </label>
            <div className="relative">
              <input
                id="customer-confirm-password"
                type={showCustomerConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your password"
                className={`${inputClass} pr-12`}
                {...customerForm.register("confirmPassword")}
              />
              <button
                type="button"
                aria-label={
                  showCustomerConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() =>
                  setShowCustomerConfirmPassword((current) => !current)
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
              >
                {showCustomerConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
            {customerForm.formState.errors.confirmPassword?.message && (
              <p className={errorClass}>
                {customerForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <p className="text-xs leading-5 text-gray-500">
            Password must be at least 8 characters and contain uppercase,
            lowercase, numeric and special characters.
          </p>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRegistering ? "Creating account..." : "Create account"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={courierForm.handleSubmit(handleCourierSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <label htmlFor="courier-name" className={labelClass}>
              Full name
            </label>
            <input
              id="courier-name"
              autoComplete="name"
              placeholder="Enter your full name"
              className={inputClass}
              {...courierForm.register("name")}
            />
            {courierForm.formState.errors.name?.message && (
              <p className={errorClass}>
                {courierForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="courier-email" className={labelClass}>
              Email address
            </label>
            <input
              id="courier-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
              {...courierForm.register("email")}
            />
            {courierForm.formState.errors.email?.message && (
              <p className={errorClass}>
                {courierForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vehicle-type" className={labelClass}>
              Vehicle type
            </label>
            <input
              id="vehicle-type"
              placeholder="e.g. Motorcycle, Bicycle, Van"
              className={inputClass}
              {...courierForm.register("vehicleType")}
            />
            {courierForm.formState.errors.vehicleType?.message && (
              <p className={errorClass}>
                {courierForm.formState.errors.vehicleType.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vehicle-number" className={labelClass}>
              Vehicle number
            </label>
            <input
              id="vehicle-number"
              placeholder="Enter vehicle registration number"
              className={inputClass}
              {...courierForm.register("vehicleNumber")}
            />
            {courierForm.formState.errors.vehicleNumber?.message && (
              <p className={errorClass}>
                {courierForm.formState.errors.vehicleNumber.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="license-number" className={labelClass}>
              License number
            </label>
            <input
              id="license-number"
              placeholder="Enter your license number"
              className={inputClass}
              {...courierForm.register("licenseNumber")}
            />
            {courierForm.formState.errors.licenseNumber?.message && (
              <p className={errorClass}>
                {courierForm.formState.errors.licenseNumber.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="courier-password" className={labelClass}>
              Password
            </label>
            <div className="relative">
              <input
                id="courier-password"
                type={showCourierPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a strong password"
                className={`${inputClass} pr-12`}
                {...courierForm.register("password")}
              />
              <button
                type="button"
                aria-label={
                  showCourierPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowCourierPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
              >
                {showCourierPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            {courierForm.formState.errors.password?.message && (
              <p className={errorClass}>
                {courierForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="courier-confirm-password" className={labelClass}>
              Confirm password
            </label>
            <div className="relative">
              <input
                id="courier-confirm-password"
                type={showCourierConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your password"
                className={`${inputClass} pr-12`}
                {...courierForm.register("confirmPassword")}
              />
              <button
                type="button"
                aria-label={
                  showCourierConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() =>
                  setShowCourierConfirmPassword((current) => !current)
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
              >
                {showCourierConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
            {courierForm.formState.errors.confirmPassword?.message && (
              <p className={errorClass}>
                {courierForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <p className="text-xs leading-5 text-gray-500">
            Password must be at least 8 characters and contain uppercase,
            lowercase, numeric and special characters.
          </p>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRegistering ? "Creating account..." : "Register as courier"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
