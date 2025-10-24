import type { Express } from "express";
import session from "express-session";
import passport from "passport";
import { storage } from "./storage";

export function setupSessionAndPassport(app: Express) {
  const isProd = process.env.NODE_ENV === "production";
  const sessionSecret = process.env.SESSION_SECRET || (isProd ? undefined : "dev-secret");
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET is required in production");
  }

  app.set("trust proxy", 1);

  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Store only a user id in the session cookie
  passport.serializeUser((user: any, done) => done(null, user.id));

  // Re-hydrate user from DB on each request
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || false);
    } catch (e) {
      done(e as any);
    }
  });
}
