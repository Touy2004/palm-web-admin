import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { users } from "../mock-data";

/**
 * Server function to fetch all users.
 * In a real app, this would query a database.
 */
export const getUsers = createServerFn({ method: "GET" })
  .handler(async () => {
    // Simulate DB fetch
    return users;
  });

/**
 * Server function to create a new user.
 */
export const createUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      department: z.string(),
      code: z.string(),
    })
  )
  .handler(async ({ data }) => {
    console.log("Creating user:", data);
    // In a real app, you would insert into DB here.
    return { success: true, user: data };
  });

/**
 * Server function to get a single user by ID.
 */
export const getUserById = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    return user;
  });
