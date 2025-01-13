import { create } from "zustand"

interface queryTerm {
    query: string;
    type: string;
}
interface SearchStore {
    searchValue: string;
    setSearchValue: (searchValue: string) => void;
    queryTerm: queryTerm;
    setQueryTerm: (queryTerm: queryTerm) => void;
}
export const useSearchStore = create<SearchStore>()((set) => ({
    searchValue: "",
    setSearchValue: (searchValue) => set({ searchValue }),
    queryTerm: { query: "", type: "" },
    setQueryTerm: (queryTerm) => set({ queryTerm }),
}))