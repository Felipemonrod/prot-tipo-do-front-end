import { useState, useMemo } from 'react';

import PageMeta from '../../components/common/PageMeta';
import { useAppContext } from '../../context/AppContext';
import type { Product } from '../../context/AppContext';
import { TrendingUp, BarChart3, AlertCircle, Sparkles, Loader2, Filter, Search } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

async function askGemini(prompt: string): Promise<string> {
    if (!GEMINI_API_KEY) return '🔑 Chave da API Gemini não configurada. Adicione VITE_GEMINI_API_KEY ao arquivo .env do projeto.';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    let delay = 1000;
    for (let i = 0; i < 5; i++) {
        try {
            const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.';
        } catch {
            if (i === 4) return '⚠️ Erro ao conectar com a IA. Tente novamente mais tarde.';
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
        }
    }
    return '';
}

// SVG donut chart for tax breakdown
function TaxPieChart({ product, color }: { product: Product; color: string }) {
    const taxes = [
        { label: 'ICMS', value: product.taxes.icms, fill: '#10b981' },
        { label: 'IPI', value: product.taxes.ipi, fill: '#3b82f6' },
        { label: 'PIS', value: product.taxes.pis, fill: '#f59e0b' },
        { label: 'COFINS', value: product.taxes.cofins, fill: '#ef4444' },
    ].filter(t => t.value > 0);

    const total = taxes.reduce((s, t) => s + t.value, 0);

    if (total === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
                <p className="text-2xl font-bold text-gray-300">0%</p>
                <p className="text-xs text-gray-400 mt-1">Produto sem tributação declarada</p>
            </div>
        );
    }

    const cx = 80, cy = 80, r = 65, ir = 42;
    let angle = -Math.PI / 2;
    const slices = taxes.map(t => {
        const sweep = (t.value / total) * 2 * Math.PI;
        const end = angle + sweep;
        const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
        const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
        const ix1 = cx + ir * Math.cos(angle), iy1 = cy + ir * Math.sin(angle);
        const ix2 = cx + ir * Math.cos(end), iy2 = cy + ir * Math.sin(end);
        const lg = sweep > Math.PI ? 1 : 0;
        const d = `M${ix1} ${iy1} L${x1} ${y1} A${r} ${r} 0 ${lg} 1 ${x2} ${y2} L${ix2} ${iy2} A${ir} ${ir} 0 ${lg} 0 ${ix1} ${iy1}Z`;
        angle = end;
        return { ...t, d, pct: (t.value * 100).toFixed(2) };
    });

    return (
        <div className="flex items-center gap-4">
            <svg width={160} height={160} viewBox="0 0 160 160" className="shrink-0">
                {slices.map((s, i) => <path key={i} d={s.d} fill={s.fill} />)}
                <text x={cx} y={cy - 5} textAnchor="middle" fontSize={11} fill="#6b7280">Total</text>
                <text x={cx} y={cy + 13} textAnchor="middle" fontSize={15} fontWeight="bold" fill={color}>{(total * 100).toFixed(1)}%</text>
            </svg>
            <div className="space-y-2 text-xs">
                {slices.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: s.fill }} />
                        <span className="text-gray-500 dark:text-gray-400">{s.label}</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-200 ml-auto">{s.pct}%</span>
                    </div>
                ))}
                <div className="pt-1 border-t border-gray-100 dark:border-gray-700 text-gray-400">
                    = R$ {(total * product.price).toFixed(2)} em impostos
                </div>
            </div>
        </div>
    );
}

// SVG sparkline for price history
function HistoryLine({ history, color }: { history: number[]; color: string }) {
    const W = 260, H = 80;
    if (history.length < 2) return null;
    const min = Math.min(...history) * 0.97;
    const max = Math.max(...history) * 1.03;
    const range = max - min || 1;
    const pts = history.map((v, i) => ({
        x: (i / (history.length - 1)) * W,
        y: H - ((v - min) / range) * (H - 20) - 10,
    }));
    const poly = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const months = ['Mês -3', 'Mês -2', 'Mês -1', 'Atual'];

    return (
        <svg width="100%" height={H + 28} viewBox={`0 0 ${W} ${H + 28}`} preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={`0,${H} ${poly} ${W},${H}`} fill="url(#lg)" />
            <polyline points={poly} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r={4} fill={color} />
                    <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={9} fill="#6b7280">R${history[i].toFixed(2)}</text>
                    <text x={p.x} y={H + 22} textAnchor="middle" fontSize={8} fill="#9ca3af">{months[i] ?? `M${i}`}</text>
                </g>
            ))}
        </svg>
    );
}

type StoreType = 'supermercado' | 'posto';

export default function PainelAnalises() {
    const { products } = useAppContext();
    const [activeStore, setActiveStore] = useState<StoreType>('supermercado');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [dashSearch, setDashSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [isExplaining, setIsExplaining] = useState(false);

    const storeProducts = useMemo(() => products.filter(p => p.storeType === activeStore), [products, activeStore]);
    const categories = useMemo(() => ['Todos', ...new Set(storeProducts.map(p => p.category))], [storeProducts]);
    const filtered = useMemo(() =>
        storeProducts.filter(p =>
            (selectedCategory === 'Todos' || p.category === selectedCategory) &&
            p.name.toLowerCase().includes(dashSearch.toLowerCase())
        ), [storeProducts, selectedCategory, dashSearch]);

    const totalPrice = filtered.reduce((s, p) => s + p.price, 0);
    const totalTax = filtered.reduce((s, p) => s + (p.taxes.icms + p.taxes.ipi + p.taxes.pis + p.taxes.cofins) * p.price, 0);
    const mostExpensive = filtered.reduce((a, b) => a.price > b.price ? a : b, filtered[0]);
    const mostTaxed = filtered.reduce((a, b) => {
        const ta = (a?.taxes.icms + a?.taxes.ipi + a?.taxes.pis + a?.taxes.cofins) || 0;
        const tb = (b?.taxes.icms + b?.taxes.ipi + b?.taxes.pis + b?.taxes.cofins) || 0;
        return ta > tb ? a : b;
    }, filtered[0]);

    // category avg price chart data
    const categoryStats = useMemo(() => {
        const map: Record<string, number[]> = {};
        filtered.forEach(p => { (map[p.category] ??= []).push(p.price); });
        return Object.entries(map)
            .map(([cat, prices]) => ({ cat, avg: prices.reduce((s, v) => s + v, 0) / prices.length, count: prices.length }))
            .sort((a, b) => b.avg - a.avg);
    }, [filtered]);
    const maxAvg = Math.max(...categoryStats.map(c => c.avg), 1);

    const handleExplain = async (product: Product) => {
        setSelectedProduct(product);
        setIsExplaining(true);
        setAiExplanation('');
        const totalTaxPct = ((product.taxes.icms + product.taxes.ipi + product.taxes.pis + product.taxes.cofins) * 100).toFixed(2);
        const prompt = `Explique de forma simples e educativa, em português, como os impostos funcionam para o produto "${product.name}" que custa R$ ${product.price.toFixed(2)}. ICMS: ${(product.taxes.icms * 100).toFixed(2)}%, IPI: ${(product.taxes.ipi * 100).toFixed(2)}%, PIS: ${(product.taxes.pis * 100).toFixed(2)}%, COFINS: ${(product.taxes.cofins * 100).toFixed(2)}%. Carga tributária total: ${totalTaxPct}%.`;
        const explanation = await askGemini(prompt);
        setAiExplanation(explanation);
        setIsExplaining(false);
    };

    const accent = activeStore === 'supermercado'
        ? { text: 'text-emerald-600', bg: 'bg-emerald-500', hex: '#10b981', light: 'bg-emerald-50' }
        : { text: 'text-orange-600', bg: 'bg-orange-500', hex: '#f97316', light: 'bg-orange-50' };

    // Bar chart dimensions
    const chartProducts = filtered.slice(0, 8);
    const maxPrice = Math.max(...chartProducts.map(p => p.price), 1);
    const chartH = 160;
    const topPad = 20; // espaço acima das barras para os labels de preço não serem cortados

    return (
        <>
            <PageMeta title="Painel e Análises | Meu Índice de Preços" description="Dashboard de análise de preços e tributos dos produtos." />
            <div className="space-y-5">

                {/* Toggle Supermercado / Posto */}
                <div className="flex gap-2">
                    {(['supermercado', 'posto'] as StoreType[]).map(s => (
                        <button key={s} onClick={() => { setActiveStore(s); setSelectedCategory('Todos'); setSelectedProduct(null); }}
                            className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-sm ${activeStore === s ? `${accent.bg} text-white` : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>
                            {s === 'supermercado' ? '🛒 Supermercado' : '⛽ Postos'}
                        </button>
                    ))}
                </div>

                {/* KPI Cards */}
                {filtered.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total em Produtos', value: `R$ ${totalPrice.toFixed(2)}`, sub: `${filtered.length} produtos`, icon: BarChart3 },
                            { label: 'Total em Impostos', value: `R$ ${totalTax.toFixed(2)}`, sub: `${totalPrice > 0 ? ((totalTax / totalPrice) * 100).toFixed(1) : 0}% do preço`, icon: AlertCircle },
                            { label: 'Produto Mais Caro', value: mostExpensive?.name?.slice(0, 16) ?? '—', sub: `R$ ${mostExpensive?.price?.toFixed(2) ?? '0'}`, icon: TrendingUp },
                            { label: 'Mais Tributado', value: mostTaxed?.name?.slice(0, 16) ?? '—', sub: `${mostTaxed ? ((mostTaxed.taxes.icms + mostTaxed.taxes.ipi + mostTaxed.taxes.pis + mostTaxed.taxes.cofins) * 100).toFixed(1) : 0}%`, icon: Sparkles },
                        ].map((kpi, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className={`w-10 h-10 ${accent.light} dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-3`}>
                                    <kpi.icon size={20} className={accent.text} />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{kpi.label}</p>
                                <p className="text-base font-bold text-gray-800 dark:text-gray-100 mt-0.5 truncate">{kpi.value}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filtros */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <Search size={16} className="text-gray-400" />
                        <input type="text" value={dashSearch} onChange={e => setDashSearch(e.target.value)}
                            placeholder="Buscar produto..." className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                            className="bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none border-l border-gray-200 dark:border-gray-700 pl-3">
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Gráfico de Barras SVG */}
                {chartProducts.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4 text-sm">Preço vs Impostos por Produto</h3>
                        <svg width="100%" height={topPad + chartH + 30} viewBox={`0 0 ${chartProducts.length * 80} ${topPad + chartH + 30}`} preserveAspectRatio="xMidYMid meet">
                            {chartProducts.map((p, i) => {
                                const barH = (p.price / maxPrice) * chartH;
                                const taxH = ((p.taxes.icms + p.taxes.ipi + p.taxes.pis + p.taxes.cofins) * p.price / maxPrice) * chartH;
                                const x = i * 80 + 10;
                                const labelY = Math.max(topPad - 4, topPad + chartH - barH - 4);
                                return (
                                    <g key={p.id} onClick={() => handleExplain(p)} className="cursor-pointer">
                                        <rect x={x} y={topPad + chartH - barH} width={28} height={barH} rx={4} fill={accent.hex} opacity={0.25} />
                                        <rect x={x} y={topPad + chartH - taxH} width={28} height={taxH} rx={4} fill={accent.hex} />
                                        <text x={x + 14} y={topPad + chartH + 16} textAnchor="middle" fontSize={9} fill="#9ca3af">{p.name.slice(0, 8)}</text>
                                        <text x={x + 14} y={labelY} textAnchor="middle" fontSize={9} fill="#6b7280">R${p.price}</text>
                                    </g>
                                );
                            })}
                        </svg>
                        <p className="text-xs text-gray-400 mt-2 text-center">Clique em uma barra para analisar com IA</p>
                    </div>
                )}

                {/* Produto selecionado: Pizza de impostos + Histórico de preços */}
                {selectedProduct && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pizza tributária */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-4">
                                Composição Tributária — {selectedProduct.name}
                            </h3>
                            <TaxPieChart product={selectedProduct} color={accent.hex} />
                        </div>

                        {/* Histórico de preços */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-4">
                                Histórico de Preços — {selectedProduct.name}
                            </h3>
                            <HistoryLine history={selectedProduct.history} color={accent.hex} />
                        </div>
                    </div>
                )}

                {/* Análise IA */}
                {selectedProduct && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={18} className={accent.text} />
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Análise IA: {selectedProduct.name}</h3>
                        </div>
                        {isExplaining ? (
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Loader2 size={16} className="animate-spin" />
                                Consultando inteligência artificial...
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{aiExplanation}</p>
                        )}
                    </div>
                )}

                {/* Preço médio por categoria */}
                {categoryStats.length > 1 && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-4">Preço Médio por Categoria</h3>
                        <div className="space-y-3">
                            {categoryStats.map(({ cat, avg, count }) => (
                                <div key={cat} className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 w-24 truncate shrink-0">{cat}</span>
                                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className="h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${(avg / maxAvg) * 100}%`, background: accent.hex }}
                                        />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 w-20 text-right shrink-0">
                                        R$ {avg.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-400 w-10 text-right shrink-0">({count})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lista de Produtos */}
                {filtered.length > 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Tabela de Produtos ({filtered.length})</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                                        <th className="px-4 py-2 text-left">Produto</th>
                                        <th className="px-4 py-2 text-left">Categoria</th>
                                        <th className="px-4 py-2 text-right">Preço</th>
                                        <th className="px-4 py-2 text-right">ICMS</th>
                                        <th className="px-4 py-2 text-right">IPI</th>
                                        <th className="px-4 py-2 text-right">PIS</th>
                                        <th className="px-4 py-2 text-right">COFINS</th>
                                        <th className="px-4 py-2 text-right">Total Imp.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.slice(0, 20).map(p => {
                                        const totalT = (p.taxes.icms + p.taxes.ipi + p.taxes.pis + p.taxes.cofins) * 100;
                                        return (
                                            <tr key={p.id} onClick={() => handleExplain(p)}
                                                className={`border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${selectedProduct?.id === p.id ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{p.name}</td>
                                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.category}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-gray-100">R$ {p.price.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">{(p.taxes.icms * 100).toFixed(1)}%</td>
                                                <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">{(p.taxes.ipi * 100).toFixed(1)}%</td>
                                                <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">{(p.taxes.pis * 100).toFixed(1)}%</td>
                                                <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">{(p.taxes.cofins * 100).toFixed(2)}%</td>
                                                <td className={`px-4 py-3 text-right font-bold ${totalT > 20 ? 'text-red-500' : totalT > 10 ? 'text-amber-500' : accent.text}`}>
                                                    {totalT.toFixed(1)}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
                        <BarChart3 size={48} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Nenhum produto encontrado.</p>
                        <p className="text-gray-400 text-sm mt-1">Importe um CSV ou adicione produtos manualmente.</p>
                    </div>
                )}
            </div>
        </>
    );
}
