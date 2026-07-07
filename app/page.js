export default function Home() {
  return (
    <div className="card">
      <h2>Bem-vindo</h2>
      <p>
        Aplicação web para gerenciar o aluguel de carros, desenvolvida para o
        Trabalho Prático de Banco de Dados I.
      </p>
      <ul>
        <li><b>Clientes</b>: cadastro, edição, exclusão e pesquisa por nome/cidade.</li>
        <li><b>Aluguéis</b>: cadastro, edição, exclusão e pesquisa por período.</li>
        <li>
          <b>Relatórios</b>: consultas envolvendo mais de uma tabela (INNER JOIN,
          agregações com filtro e subconsulta com NOT IN).
        </li>
      </ul>
      <p>
        Modelo relacional: <b>Carros</b> (1) — (N) <b>Aluguel</b> (N) — (1) <b>Cliente</b>.
      </p>
    </div>
  );
}
