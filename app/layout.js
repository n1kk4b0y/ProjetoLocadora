import './globals.css';

export const metadata = {
  title: 'Sistema de Aluguel de Carros',
  description: 'Trabalho Prático de Banco de Dados I - IFRJ Niterói',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="header">
          <h1>Sistema de Aluguel de Carros</h1>
          <nav>
            <a href="/">Início</a>
            <a href="/clientes">Clientes</a>
            <a href="/alugueis">Aluguéis</a>
            <a href="/relatorios">Relatórios</a>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
