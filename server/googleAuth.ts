import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { storage } from "./storage";

export function setupGoogleAuth() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log("Google OAuth not configured - skipping Google authentication setup");
    return;
  }

  const callbackURL = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/auth/google/callback`
    : `https://workspace.ramazorani.repl.co/api/auth/google/callback`;

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: callbackURL
  },
  async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
    try {
      // Create or update user from Google profile
      const user = await storage.upsertUser({
        id: `google_${profile.id}`,
        email: profile.emails?.[0]?.value || null,
        firstName: profile.name?.givenName || null,
        lastName: profile.name?.familyName || null,
        profileImageUrl: profile.photos?.[0]?.value || null,
        walletAddress: null,
        reputationScore: 75.0, // Default reputation for new users
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }));
}