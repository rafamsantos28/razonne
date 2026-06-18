// navbar.js
const navbarHTML = `
<header class="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#040108] to-transparent transition-all duration-300" id="main-navbar">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <!-- Esquerda: Logo e Links -->
        <div class="flex items-center gap-10">
            <a href="catalogo.html">
                <img src="razonneplus_wordmark.png" alt="Razonne+" class="h-6 md:h-7 object-contain">
            </a>
            <nav class="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-400">
                <a href="catalogo.html" class="hover:text-cyan-400 transition-colors text-white">Início</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Filmes</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">A Minha Lista</a>
            </nav>
        </div>
        
        <!-- Direita: Pesquisa e Perfil -->
        <div class="flex items-center gap-6">
            <div class="relative flex items-center bg-purple-950/20 border border-purple-950/40 rounded-xl px-3 py-1.5 focus-within:border-cyan-400/60 transition-all">
                <i class="fa-solid fa-magnifying-glass text-xs text-zinc-400 mr-2"></i>
                <input type="text" id="nav-search-input" placeholder="Pesquisar títulos..." class="bg-transparent text-xs text-white focus:outline-none w-32 md:w-48 placeholder-zinc-500">
            </div>
            
            <div class="relative group cursor-pointer">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=RazonneUser" alt="Perfil" class="w-8 h-8 rounded-xl border border-cyan-400/40 shadow-md">
                <div class="absolute right-0 top-10 w-40 bg-[#040108] border border-purple-950/60 rounded-xl p-2 hidden group-hover:block shadow-2xl">
                    <a href="#" class="block w-full text-left px-3 py-2 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-purple-950/20 rounded-lg transition-all">Definições</a>
                    <hr class="border-purple-950/40 my-1">
                    <button id="btn-logout" class="block w-full text-left px-3 py-2 text-[11px] font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-all">Sair</button>
                </div>
            </div>
        </div>
    </div>
</header>
`;

document.body.insertAdjacentHTML('afterbegin', navbarHTML);

// Efeito de fundo ao fazer scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-navbar');
    if (window.scrollY > 50) {
        nav.classList.add('bg-[#040108]/95', 'backdrop-blur-md', 'border-b', 'border-purple-950/20');
        nav.classList.remove('bg-gradient-to-b', 'from-[#040108]');
    } else {
        nav.classList.remove('bg-[#040108]/95', 'backdrop-blur-md', 'border-b', 'border-purple-950/20');
        nav.classList.add('bg-gradient-to-b', 'from-[#040108]');
    }
});
