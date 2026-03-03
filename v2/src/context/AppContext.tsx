import React, { createContext, useContext, useRef, useState } from 'react';
import initialProductsData from '../initialProducts.json';


// Tipos
export type TaxMap = { icms: number; ipi: number; pis: number; cofins: number };

export interface Product {
    id: number;
    name: string;
    category: string;
    storeType: 'supermercado' | 'posto';
    price: number;
    taxes: TaxMap;
    history: number[];
}

export interface ShoppingItem {
    product: Product;
    quantity: number;
}

export interface GoogleUser {
    name: string;
    email: string;
    picture: string;
}

interface AppContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (v: boolean) => void;
    googleUser: GoogleUser | null;
    setGoogleUser: (u: GoogleUser | null) => void;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    shoppingList: ShoppingItem[];
    setShoppingList: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AppContext = createContext<AppContextType | null>(null);


export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
    return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
    const [products, setProducts] = useState<Product[]>(initialProductsData as Product[]);
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter((l) => l.trim() !== '');
            const newProducts: Product[] = [];
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',');
                if (cols.length < 10) continue;
                const name = cols[1]?.trim() || 'Produto Desconhecido';
                const price = parseFloat(cols[2]) || 0;
                const parseTax = (val: string) => {
                    if (!val) return 0;
                    return (parseFloat(val.replace('%', '').trim()) / 100) || 0;
                };
                const icms = parseTax(cols[3]);
                const pis = parseTax(cols[5]);
                const cofins = parseTax(cols[7]);
                const ipi = parseTax(cols[9]);
                const n = name.toLowerCase();
                let category = 'Outros';
                if (n.includes('arroz') || n.includes('feijão') || n.includes('açúcar') || n.includes('farinha') || n.includes('macarrão') || n.includes('café') || n.includes('pão') || n.includes('leite') || n.includes('óleo') || n.includes('sal') || n.includes('maionese') || n.includes('biscoito')) category = 'Alimentos';
                else if (n.includes('cerveja') || n.includes('coca') || n.includes('refrigerante') || n.includes('suco')) category = 'Bebidas';
                else if (n.includes('frango') || n.includes('carne') || n.includes('alcatra') || n.includes('bisteca')) category = 'Carnes';
                else if (n.includes('tomate') || n.includes('banana') || n.includes('ovo') || n.includes('alface') || n.includes('batata')) category = 'Hortifruti';
                else if (n.includes('shampoo') || n.includes('sabonete') || n.includes('papel higiênico') || n.includes('desodorante')) category = 'Higiene';
                else if (n.includes('sabão') || n.includes('detergente') || n.includes('amaciante')) category = 'Limpeza';
                else if (n.includes('gasolina') || n.includes('etanol') || n.includes('diesel') || n.includes('combustível')) category = 'Combustíveis';
                const storeType: 'supermercado' | 'posto' = category === 'Combustíveis' ? 'posto' : 'supermercado';
                newProducts.push({
                    id: Date.now() + i,
                    name, category, storeType, price,
                    taxes: { icms, ipi, pis, cofins },
                    history: [price * 0.90, price * 0.95, price * 0.98, price],
                });
            }
            setProducts(newProducts);
            alert(`${newProducts.length} produtos carregados!`);
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <AppContext.Provider value={{
            isLoggedIn, setIsLoggedIn,
            googleUser, setGoogleUser,
            products, setProducts,
            shoppingList, setShoppingList,
            fileInputRef, handleFileUpload,
        }}>
            {children}
        </AppContext.Provider>
    );
};
