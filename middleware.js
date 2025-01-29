import { NextResponse } from 'next/server';

const PASSWORD = '654321Imed'; // Укажи свой пароль

export function middleware(req) {
    const cookiePassword = req.cookies.get('auth');

    // Если пароль верный, пропускаем пользователя
    if (cookiePassword && cookiePassword.value === PASSWORD) {
        return NextResponse.next();
    }

    // Если пароль не верный, редирект на страницу входа
    const url = req.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
}

// Исключаем страницу входа и статические файлы из защиты
export const config = {
    matcher: '/((?!auth|_next|favicon.ico|public).*)',
};
