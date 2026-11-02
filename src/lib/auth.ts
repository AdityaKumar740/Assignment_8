import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db("assignment-8");

const configuredBaseURL = process.env.BETTER_AUTH_URL?.trim()
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://assignment-8-taupe-five.vercel.app"
    : configuredBaseURL ?? "http://localhost:3000"

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins: [
    baseURL,
    "http://localhost:3000",
    "https://assignment-8-taupe-five.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins : [jwt()],
  session : {
    cookieCache:{
      enabled : true,
      strategy : 'jwt',
      maxAge : 7 * 24 * 60 * 60
    }
  }
});