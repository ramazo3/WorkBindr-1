import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { storage } from "./storage";

export function setupGoogleAuth() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log("Google OAuth not configured - skipping Google authentication setup");
    return;
  }

  console.log("Setting up Google OAuth strategy...");

  // Prefer an explicit callback URL from the environment. Fallback to a relative path
  // so that the host/protocol from the incoming request are used.
  const envCallback = process.env.GOOGLE_CALLBACK_URL?.trim();
  const callbackURL = envCallback && /^https?:\/\//i.test(envCallback)
    ? envCallback
    : "/api/auth/google/callback";
  console.log(`Google OAuth callback URL configured as: ${callbackURL}`);

  passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL,
    scope: ['profile', 'email'],
    passReqToCallback: false
  },
  async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
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