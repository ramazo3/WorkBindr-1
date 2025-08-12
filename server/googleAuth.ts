import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { storage } from "./storage";

export function setupGoogleAuth() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log("Google OAuth not configured - skipping Google authentication setup");
    return;
  }

  console.log("Setting up Google OAuth strategy...");

  // Use custom domain if available, otherwise fall back to Replit domain
  const customDomain = process.env.CUSTOM_DOMAIN || 'itinerecloud.com';
  const domain = process.env.NODE_ENV === 'production' && customDomain 
    ? customDomain 
    : process.env.REPLIT_DOMAINS;
  const callbackURL = `https://${domain}/api/auth/google/callback`;
  console.log(`Google OAuth callback URL: ${callbackURL}`);
  console.log(`Using domain: ${domain} (Custom domain: ${customDomain})`);

  passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: callbackURL,
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