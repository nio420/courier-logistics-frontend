import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(254, "Email is too long.")
    .email("Enter a valid email address.")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password must not exceed 128 characters.")
    .refine(
      (password) => password.trim().length > 0,
      "Password cannot contain only spaces.",
    ),
});

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters.")
  .max(80, "Name cannot exceed 80 characters.")
  .regex(/^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u, "Enter a valid name.");
const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.")
  .max(254, "Email is too long.")
  .transform((email) => email.toLowerCase());
const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(64, "Password cannot exceed 64 characters.")
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[0-9]/, "Password must contain a number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character.")
  .refine((value) => !/\s/.test(value), "Password cannot contain spaces.");
const confirmPasswordSchema = z
  .string()
  .min(1, "Please confirm your password.");
const registrationBaseSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});
export const customerRegisterSchema = registrationBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords do not match.", path: ["confirmPassword"] },
);
const vehicleTypeSchema = z
  .string()
  .trim()
  .min(2, "Vehicle type must be at least 2 characters.")
  .max(40, "Vehicle type cannot exceed 40 characters.");
const vehicleNumberSchema = z
  .string()
  .trim()
  .min(3, "Vehicle number must be at least 3 characters.")
  .max(20, "Vehicle number cannot exceed 20 characters.")
  .regex(
    /^[A-Za-z0-9 -]+$/,
    "Vehicle number can contain only letters, numbers, spaces and hyphens.",
  );
const licenseNumberSchema = z
  .string()
  .trim()
  .min(4, "License number must be at least 4 characters.")
  .max(30, "License number cannot exceed 30 characters.")
  .regex(/^[A-Za-z0-9/-]+$/, "Enter a valid license number.");
export const courierRegisterSchema = registrationBaseSchema
  .extend({
    vehicleType: vehicleTypeSchema,
    vehicleNumber: vehicleNumberSchema,
    licenseNumber: licenseNumberSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type LoginInput = { email: string; password: string };
export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;
export type CourierRegisterInput = z.infer<typeof courierRegisterSchema>;

export const verifyEmailSchema = z.object({
  email: z.string().trim().email("A valid email address is required."),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the complete 6-digit OTP."),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
