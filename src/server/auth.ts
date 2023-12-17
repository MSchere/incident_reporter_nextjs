import { env } from "$src/env";
import { UserRole } from "$src/lib/types";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials) {
          return { id: "1", name: credentials.name, role: UserRole.USER };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
