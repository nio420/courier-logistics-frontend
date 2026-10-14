"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  getGoogleLoginUrl,
  loginUser,
  logoutUser,
  registerUser,
  resendOtp,
  resetPassword as resetPasswordApi,
  sendForgotPassword as sendForgotPasswordApi,
  verifyEmail,
} from "@/lib/api/auth";

export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginUser,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
  });

  const verifyEmailMutation = useMutation({
    mutationFn: verifyEmail,
  });

  const resendOtpMutation = useMutation({
    mutationFn: resendOtp,
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: sendForgotPasswordApi,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordApi,
  });

  // async function login(payload: { email: string; password: string }) {
  //   const response = await loginMutation.mutateAsync(payload);

  //   if (response.data?.user) {
  //     queryClient.setQueryData(["current-user"], response.data.user);

  //     void queryClient.invalidateQueries({
  //       queryKey: ["current-user"],
  //     });
  //   }

  //   return response;
  // }

  async function login(payload: { email: string; password: string }) {
    const response = await loginMutation.mutateAsync(payload);

    const { accessToken, refreshToken } = response.data;

    if (!accessToken || !refreshToken) {
      throw new Error("Login response did not include authentication tokens.");
    }

    const sessionResponse = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, refreshToken }),
    });

    if (!sessionResponse.ok) {
      const result = (await sessionResponse.json()) as {
        message?: string;
      };

      throw new Error(
        result.message || "Could not establish your login session.",
      );
    }

    return response;
  }

  function register(payload: Parameters<typeof registerUser>[0]) {
    return registerMutation.mutateAsync(payload);
  }

  function verifyEmailOtp(payload: { email: string; otp: string }) {
    return verifyEmailMutation.mutateAsync(payload);
  }

  function resendVerificationOtp(payload: { email: string }) {
    return resendOtpMutation.mutateAsync(payload);
  }

  function sendForgotPassword(payload: { email: string }) {
    return forgotPasswordMutation.mutateAsync(payload);
  }

  function logout() {
    return logoutMutation.mutateAsync();
  }

  function loginWithGoogle() {
    window.location.assign(getGoogleLoginUrl());
  }

  function reset(payload: { email: string; otp: string; newPassword: string }) {
    return resetPasswordMutation.mutateAsync(payload);
  }

  return {
    login,
    loginWithGoogle,
    register,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    sendForgotPassword,
    isLoading: forgotPasswordMutation.isPending,
    reset,
    isResettingPassword: resetPasswordMutation.isPending,
    verifyEmailOtp,
    isVerifyingEmail: verifyEmailMutation.isPending,
    resendVerificationOtp,
    isResendingOtp: resendOtpMutation.isPending,
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
}
