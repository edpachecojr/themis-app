export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-primary-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-neutral-800">Themis</span>
          </div>
          <nav>
            <a
              href="/login"
              className="text-neutral-600 hover:text-primary-600"
            >
              Entrar
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
