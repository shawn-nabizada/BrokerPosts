import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Auth.js (NextAuth) — Google sign-in with JWT sessions (no database).
 *
 * The Google account id (`sub`) becomes the stable per-broker key used to
 * isolate profiles in Vercel Blob. Sign-up is open to anyone.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    // Persist the Google account id onto the token...
    async jwt({ token, profile }) {
      if (profile?.sub) token.sub = profile.sub;
      return token;
    },
    // ...and expose it on the session as `user.id`.
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
