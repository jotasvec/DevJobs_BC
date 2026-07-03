import { createAuthClient } from "better-auth/client/react";

export const authClient = createAuthClient({
    baseUrl: "/"
})

export const { signIn, signUp, signOut, useSession } = authClient;
