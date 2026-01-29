import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PropertiesFilterBar from "@/components/PropertiesFilterBar";

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PropertiesFilterBar />
            {children}
        </>
    )
}
