import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Использование NextAuth старым способом, который работает на Next.js 15+
const handler = NextAuth(authOptions);

// Экспортируем обработчик как GET и POST для обработки запросов авторизации
export { handler as GET, handler as POST };
