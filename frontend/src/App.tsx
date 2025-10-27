import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="bg-[#324D6B] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full pt-16 pb-32 bg-[#324D6B]">
        <Home />
      </main>
      <Footer />
    </div>
  );
}
