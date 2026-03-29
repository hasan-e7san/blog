"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type RegisterUserResult =
  | { error: string }
  | { success: true };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUser(formData: FormData): Promise<RegisterUserResult> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!name) {
    return { error: "Please enter your full name." };
  }

  if (!email) {
    return { error: "Please enter your email address." };
  }

  if (!emailPattern.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!password) {
    return { error: "Please enter a password." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists. Try logging in instead." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "An account with this email already exists. Try logging in instead." };
    }

    return { error: "We couldn't create your account right now. Please try again in a moment." };
  }
}
