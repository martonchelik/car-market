import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';

// Mock users database for demonstration purposes
// In a real application, this would be in your database
const USERS = [
  {
    id: '1',
    name: 'Демо Пользователь',
    email: 'demo@example.com',
    password: '$2b$10$ThiFTcmVxdkCJgNHl0EY3uIkFWOPDFpj5JOv3h2XxlpL4Tf9p2OMC', // "password123"
    image: 'https://ui-avatars.com/api/?name=Демо+Пользователь&background=2ab4ac&color=fff'
  },
  {
    id: '2',
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    password: '$2b$10$ThiFTcmVxdkCJgNHl0EY3uIkFWOPDFpj5JOv3h2XxlpL4Tf9p2OMC', // "password123"
    image: 'https://ui-avatars.com/api/?name=Иван+Иванов&background=2ab4ac&color=fff'
  },
];

export const authOptions: NextAuthOptions = {
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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Allow any email and password
        // Generate a fake user based on the provided email
        const userName = credentials.email.split('@')[0];

        return {
          id: Math.random().toString(36).substr(2, 9), // Generate random ID
          name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
          email: credentials.email,
          image: `https://ui-avatars.com/api/?name=${userName}&background=2ab4ac&color=fff`
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
