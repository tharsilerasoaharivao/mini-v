import Accueil from "./Accueil";
import Navbar from "./Navbar";


export default function Home() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      <Accueil/>
   
    </div>
  );
}