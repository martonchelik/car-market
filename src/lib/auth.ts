import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV !== 'production',
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

        try {
          // Ищем пользователя в базе данных
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          // Если пользователь не найден или неактивен
          if (!user || !user.active) {
            console.log('Пользователь не найден или неактивен:', credentials.email);
            return null;
          }

          // Проверяем пароль
          const passwordMatches = await compare(credentials.password, user.password);
          if (!passwordMatches) {
            console.log('Неверный пароль для пользователя:', credentials.email);
            return null;
          }

          // Возвращаем данные пользователя без пароля
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2ab4ac&color=fff`,
            acctype: user.acctype
          };
        } catch (error) {
          console.error('Ошибка при авторизации:', error);
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
          phone: "0", // Значение по умолчанию
          acctype: "user", // Обычный пользователь по умолчанию
          password: "", // Пустой пароль для OAuth пользователей
          foreignkey: "1", // Значение по умолчанию
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Добавляем данные пользователя в токен при входе
      if (user) {
        token.id = user.id;
        token.acctype = user.acctype;
      }
      return token;
    },
    async session({ session, token }) {
      // Добавляем данные пользователя в сессию
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.acctype = token.acctype as string;
      }
      return session;
    },
  },
};
