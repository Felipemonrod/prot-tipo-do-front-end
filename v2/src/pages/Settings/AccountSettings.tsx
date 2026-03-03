import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useAppContext } from "../../context/AppContext";
import { Settings, Bell, Database, Palette, Shield, Save } from "lucide-react";

export default function AccountSettings() {
    const { products } = useAppContext();
    const [geminiKey, setGeminiKey] = useState("");
    const [notifications, setNotifications] = useState(true);
    const [csvDelimiter, setCsvDelimiter] = useState(",");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <>
            <PageMeta title="Configurações | Meu Índice de Preços" description="Configurações do sistema" />
            <div className="max-w-3xl mx-auto space-y-5">

                {/* Cabeçalho */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-violet-50 dark:bg-violet-900/30 rounded-xl">
                            <Settings size={20} className="text-violet-600 dark:text-violet-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Configurações do Sistema</h2>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">Gerencie as preferências e integrações do Meu Índice de Preços.</p>
                </div>

                {/* Status da Base de Dados */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Database size={18} className="text-emerald-500" />
                        <h3 className="font-bold text-gray-800 dark:text-white">Base de Dados</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            { label: "Total de Produtos", value: products.length.toString() },
                            { label: "Supermercado", value: products.filter(p => p.storeType === "supermercado").length.toString() },
                            { label: "Postos", value: products.filter(p => p.storeType === "posto").length.toString() },
                            { label: "Categorias", value: [...new Set(products.map(p => p.category))].length.toString() },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                                <p className="text-2xl font-black text-gray-800 dark:text-white">{stat.value}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Integração com Gemini AI */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Palette size={18} className="text-violet-500" />
                        <h3 className="font-bold text-gray-800 dark:text-white">Integração Gemini AI</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Configure sua chave da API do Google AI Studio para ativar a análise inteligente de produtos.
                    </p>
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Chave da API (VITE_GEMINI_API_KEY)</label>
                        <input
                            type="password"
                            value={geminiKey}
                            onChange={e => setGeminiKey(e.target.value)}
                            placeholder="AIza..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-mono"
                        />
                        <p className="text-xs text-gray-400">
                            Obtenha sua chave em{" "}
                            <a href="https://aistudio.google.com" target="_blank" rel="noopener" className="text-violet-500 underline">aistudio.google.com</a>
                        </p>
                    </div>
                </div>

                {/* Importação CSV */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield size={18} className="text-sky-500" />
                        <h3 className="font-bold text-gray-800 dark:text-white">Importação de CSV</h3>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Delimitador</label>
                        <div className="flex gap-3">
                            {[",", ";", "\t"].map(d => (
                                <button key={d} onClick={() => setCsvDelimiter(d)}
                                    className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all ${csvDelimiter === d
                                            ? "bg-sky-600 text-white border-sky-600"
                                            : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                                        }`}>
                                    {d === "\t" ? "Tab" : `"${d}"`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notificações */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell size={18} className="text-amber-500" />
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-white">Notificações de Upload</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Exibir alerta ao importar CSV com sucesso</p>
                            </div>
                        </div>
                        <button onClick={() => setNotifications(!notifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                    </div>
                </div>

                {/* Salvar */}
                <button onClick={handleSave}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md ${saved ? "bg-emerald-500 shadow-emerald-500/20" : "bg-violet-600 hover:bg-violet-700 shadow-violet-500/20"
                        }`}>
                    <Save size={18} />
                    {saved ? "✅ Configurações Salvas!" : "Salvar Configurações"}
                </button>
            </div>
        </>
    );
}
