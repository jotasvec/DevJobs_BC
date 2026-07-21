import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseUrl: "/"
})

export const { signIn, signUp, signOut, useSession } = authClient;
