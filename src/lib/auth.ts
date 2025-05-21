import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare, hash } from 'bcrypt';
import prisma from '@/lib/prisma';

// Helper to check if a string is likely a bcrypt hash
const isBcryptHash = (str: string) => {
  return str && str.startsWith('$2') && str.length > 50;
};

// Helper for password verification that handles both bcrypt and plain passwords
const verifyPassword = async (plainPassword: string, storedPassword: string) => {
  // If stored password is a bcrypt hash, use bcrypt compare
  if (isBcryptHash(storedPassword)) {
    console.log('Verifying with bcrypt hash');
    return compare(plainPassword, storedPassword);
  }

  // For backwards compatibility: direct comparison for plain text passwords
  console.log('Verifying with plain text comparison');
  return plainPassword === storedPassword;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true, // Enable debug mode for all environments
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' }
      },
      async authorize(credentials) {
        console.log('Starting authorize callback with credentials:', credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.error('Missing email or password');
          return null;
        }

        try {
          // Find user in the database
          console.log('Finding user by email:', credentials.email);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          // If user not found
          if (!user) {
            console.error('User not found:', credentials.email);
            return null;
          }

          console.log('User found:', user.email, 'Active status:', user.active);

          // If user account is inactive
          if (!user.active) {
            console.error('User account is inactive:', credentials.email);
            return null;
          }

          // Verify password using our custom function
          console.log('Verifying password for user:', credentials.email);
          console.log('Stored password length:', user.password.length);

          const passwordMatches = await verifyPassword(credentials.password, user.password);
          console.log('Password matches:', passwordMatches);

          if (!passwordMatches) {
            console.error('Password does not match for user:', credentials.email);
            return null;
          }

          // If password is not hashed, migrate it to bcrypt hash
          if (!isBcryptHash(user.password)) {
            try {
              console.log('Migrating plain password to bcrypt hash for user:', user.email);
              const hashedPassword = await hash(credentials.password, 10);

              // Update the user's password with the bcrypt hash
              await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
              });
              console.log('Password migration completed for user:', user.email);
            } catch (updateError) {
              // Log the error but don't block authentication
              console.error('Failed to migrate password to hash:', updateError);
            }
          }

          // Return user data without password
          console.log('Authentication successful, returning user data:', user.email);
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2ab4ac&color=fff`,
            acctype: user.acctype
          };
        } catch (error) {
          console.error('Error in authorize callback:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          phone: "0", // Default value
          acctype: "user", // Regular user by default
          password: "", // Empty password for OAuth users
          foreignkey: "1", // Default value
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Add user data to token on login
      if (user) {
        token.id = user.id;
        token.acctype = user.acctype;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.acctype = token.acctype as string;
      }
      return session;
    },
  },
};
