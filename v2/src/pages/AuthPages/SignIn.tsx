import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { useAppContext } from '../../context/AppContext';

// Contas demo para simular seletor do Google
const DEMO_ACCOUNTS = [
  {
    name: 'Fernando Alves',
    email: 'fernando.alves@ifgoiano.edu.br',
    picture: '/images/user/avatar.png',
  },
  {
    name: 'Conta pessoal',
    email: 'testedefreefire67@gmail.com',
    picture: '',
  },
];

export default function SignIn() {
  const { setIsLoggedIn, setGoogleUser } = useAppContext();
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState<number | null>(null);

  const handleSelectAccount = (idx: number) => {
    setLoading(idx);
    // Simula delay do OAuth
    setTimeout(() => {
      const acc = DEMO_ACCOUNTS[idx];
      setGoogleUser({ name: acc.name, email: acc.email, picture: acc.picture });
      setIsLoggedIn(true);
      navigate('/');
    }, 1200);
  };

  return (
    <>
      <PageMeta title="Login | Meu Índice de Preços" description="Faça login para acessar o Meu Índice de Preços." />
      <div className="min-h-screen bg-slate-100 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] w-full max-w-md flex flex-col items-center">

          {/* Google Logo */}
          <div className="flex gap-1 mb-4 select-none">
            <span className="text-4xl font-bold text-[#4285F4]">G</span>
            <span className="text-4xl font-bold text-[#EA4335]">o</span>
            <span className="text-4xl font-bold text-[#FBBC05]">o</span>
            <span className="text-4xl font-bold text-[#4285F4]">g</span>
            <span className="text-4xl font-bold text-[#34A853]">l</span>
            <span className="text-4xl font-bold text-[#EA4335]">e</span>
          </div>

          <h1 className="text-2xl font-medium text-slate-800 dark:text-white mb-2 tracking-tight">Fazer login</h1>
          <p className="text-base text-slate-600 dark:text-gray-400 mb-8 text-center">
            Ir para <span className="font-medium text-slate-800 dark:text-white">Meu Índice de Preços</span>
          </p>

          {/* Botão Google */}
          <button
            onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-3 border border-slate-300 dark:border-gray-700 rounded-[4px] px-6 py-3 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <span className="text-slate-700 dark:text-gray-200 font-medium text-sm">Continuar com o Google</span>
          </button>

          <div className="text-xs text-slate-400 dark:text-gray-600 text-center mt-6 leading-relaxed">
            Não está no seu computador? Use o modo visitante para fazer login com privacidade.
          </div>
        </div>
      </div>

      {/* Modal seletor de conta — simulação do Google Account Picker */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex gap-1 select-none">
                <span className="text-xl font-bold text-[#4285F4]">G</span>
                <span className="text-xl font-bold text-[#EA4335]">o</span>
                <span className="text-xl font-bold text-[#FBBC05]">o</span>
                <span className="text-xl font-bold text-[#4285F4]">g</span>
                <span className="text-xl font-bold text-[#34A853]">l</span>
                <span className="text-xl font-bold text-[#EA4335]">e</span>
              </div>
              <button
                onClick={() => { setShowPicker(false); setLoading(null); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 pt-4 pb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Escolha uma conta</p>
              <p className="text-xs text-gray-400 mt-0.5">para continuar em <strong className="text-gray-600 dark:text-gray-300">Meu Índice de Preços</strong></p>
            </div>

            {/* Contas */}
            <div className="px-3 pb-4 space-y-1">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAccount(idx)}
                  disabled={loading !== null}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left disabled:opacity-60"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 overflow-hidden">
                    {acc.picture && acc.picture !== '' ? (
                      <img src={acc.picture} alt={acc.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-base">
                        {acc.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{acc.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{acc.email}</p>
                  </div>

                  {/* Spinner se selecionando */}
                  {loading === idx && (
                    <svg className="animate-spin h-4 w-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                </button>
              ))}

              {/* Usar outra conta */}
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left text-sm text-gray-600 dark:text-gray-400">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Usar outra conta
              </button>
            </div>

            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Para continuar, o Google vai compartilhar seu nome, endereço de e-mail e foto do perfil com Meu Índice de Preços.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
