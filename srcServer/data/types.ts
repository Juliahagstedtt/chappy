import * as z from "zod";

// Registrering
export const userPostSchema = z.object({
    username: z.string().min(5, "Användarnamnet måste vara minst 5 tecken"),
    password: z.string().min(6, "Lösenordet måste vara minst 6 tecken")
});

export const userSchema = z.object({
    Pk: z.string(),
    password: z.string(),
    username: z.string()
})

export interface Payload {
    userId: string;
}

export const payloadSchema = z.object({
  userId: z.string(),
});