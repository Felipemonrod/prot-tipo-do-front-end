import PageMeta from "../../components/common/PageMeta";
import { HelpCircle, FileText, Book, Mail, Github, AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        q: "Como importar produtos pelo CSV?",
        a: "No header do sistema, clique em 'Importar CSV'. O arquivo deve ter as colunas: Nº, Produto, Preço, ICMS (%), -, PIS (%), -, COFINS (%), -, IPI (%). O sistema classifica automaticamente os produtos entre Supermercado e Postos.",
    },
    {
        q: "Como funciona a análise por Inteligência Artificial?",
        a: "No Painel e Análises, clique em qualquer barra do gráfico. O sistema envia os dados do produto para a API Google Gemini e retorna uma análise textual sobre a carga tributária. É necessário configurar uma chave de API em Configurações.",
    },
    {
        q: "O que é carga tributária?",
        a: "É o percentual total do preço de um produto que representa impostos. Por exemplo, se um produto custa R$ 10,00 e tem 21% de carga tributária, R$ 2,10 são impostos embutidos (ICMS, IPI, PIS e COFINS).",
    },
    {
        q: "Qual a diferença entre Supermercado e Postos?",
        a: "O sistema separa automaticamente os produtos em duas categorias: produtos de supermercado (alimentos, bebidas, higiene etc.) e produtos de postos de combustível (gasolina, etanol, diesel). Cada categoria tem seu próprio painel de análise.",
    },
    {
        q: "Os dados são salvos após fechar o navegador?",
        a: "Não. Na versão atual, os dados ficam apenas em memória. Ao recarregar a página, os produtos voltam à base de dados inicial. A persistência em banco de dados é uma melhoria planejada para as próximas versões.",
    },
];

export default function Support() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <>
            <PageMeta title="Suporte | Meu Índice de Preços" description="Central de ajuda e suporte do sistema." />
            <div className="max-w-3xl mx-auto space-y-5">

                {/* Banner */}
                <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <HelpCircle size={28} />
                        <h2 className="text-2xl font-bold">Central de Ajuda</h2>
                    </div>
                    <p className="text-sky-100 text-base leading-relaxed">
                        Bem-vindo ao suporte do <strong>Meu Índice de Preços</strong>. Encontre respostas rápidas nas perguntas frequentes abaixo ou entre em contato diretamente.
                    </p>
                </div>

                {/* Links rápidos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: FileText, label: "Documentação", sub: "Guia completo do sistema", href: "#" },
                        { icon: Book, label: "Sobre os Impostos", sub: "ICMS, IPI, PIS e COFINS", href: "/taxes" },
                        { icon: Github, label: "Código Fonte", sub: "Repositório GitHub", href: "https://github.com/FernandoAlves049/prot-tipo-do-front-end" },
                    ].map((item) => (
                        <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener"
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                            <div className="p-3 bg-sky-50 dark:bg-sky-900/30 rounded-xl">
                                <item.icon size={20} className="text-sky-600 dark:text-sky-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* FAQ */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <AlertCircle size={18} className="text-amber-500" />
                            Perguntas Frequentes
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {faqs.map((faq, i) => (
                            <div key={i}>
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm pr-4">{faq.q}</span>
                                    <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contato */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Mail size={18} className="text-violet-500" />
                        Não encontrou o que precisava?
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                        Este é um projeto de extensão acadêmica do IF Goiano — Campus Morrinhos. Para dúvidas técnicas ou sugestões, entre em contato:
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Desenvolvedor</span>
                            <span className="text-gray-600 dark:text-gray-400">Fernando Alves — ADS, IF Goiano</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">GitHub</span>
                            <a href="https://github.com/FernandoAlves049" target="_blank" rel="noopener" className="text-sky-500 underline">github.com/FernandoAlves049</a>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Versão</span>
                            <span className="text-gray-600 dark:text-gray-400">v2.0 — TailAdmin + TypeScript</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
