'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        const correctPassword = '654321Imed'; 

        if (password === correctPassword) {
            Cookies.set('auth', password, { expires: 1 }); // Устанавливаем куку на 1 день
            router.push('/'); // Перенаправляем на главную страницу
        } else {
            setError('Неверный пароль!');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-80"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Введите пароль</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    className="w-full px-3 py-2 border rounded mb-2"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded mt-2"
                >
                    Войти
                </button>
            </form>
        </div>
    );
}
