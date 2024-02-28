import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/app/(models)/User";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        let userRole = "GitHub User";
        if (profile?.email === "maxime.prevot1804kz@gmail.com") {
          userRole = "admin";
        }

        return {
          ...profile,
          role: userRole,
          image: profile.avatar_url,
          phone: profile.phone, // Ajouter le numéro de téléphone depuis le profil GitHub si disponible
          // Ajouter l'image depuis le profil GitHub
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_Secret,
    }),
    GoogleProvider({
      profile(profile) {
        let userRole = "Google User";

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
          image: profile.picture,
          phone: profile.phoneNumber, // Ajouter le numéro de téléphone depuis le profil GitHub si disponible
          // Ajouter l'image depuis le profil Google
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_Secret,
      scope: "https://www.googleapis.com/auth/user.phonenumbers.read",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "your-email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        try {
          const foundUser = await User.findOne({ email: credentials.email })
            .lean()
            .exec();
      
          if (foundUser) {
            const match = await bcrypt.compare(
              credentials.password,
              foundUser.password
            );
      
            if (match) {
              delete foundUser.password
      
              foundUser["role"] = "Unverified Email ";
              return foundUser
            }
          }
        } catch (err) {
          console.log(err);
        }
        return null;
      },      
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.phone = user.phone; // Ajoute le numéro de téléphone au jeton
      }
      return token;
    },
    async session({ session, token }) {
      if (session && token && token.role) {
        session.user.role = token.role;
        session.user.phone = token.phone;
        // Ajoute le numéro de téléphone à la session utilisateur
      }
      return session;
    },
  },
};
