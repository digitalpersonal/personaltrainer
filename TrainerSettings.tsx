import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Eye, EyeOff } from "lucide-react";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Falha ao autenticar. Verifique suas credenciais e se o provedor de E-mail/Senha está habilitado no console do Firebase.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop"
          alt="Personal Trainer"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold">Gestão de Treinos</h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
        <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Login Admin</h2>
          {error && <p className="mb-4 text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}
          
          <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
          </div>
          
          <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
          </div>
          
          <button type="submit" className="w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium transition duration-200">Entrar</button>
        </form>
      </div>
    </div>
  );
}
