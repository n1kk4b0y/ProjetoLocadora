'use client';
import { useState } from 'react';

export default function RelatoriosPage() {
  const [nomeCliente, setNomeCliente] = useState('');
  const [alugueisCliente, setAlugueisCliente] = useState([]);

  const [cidade, setCidade] = useState('');
  const [somatorio, setSomatorio] = useState([]);

  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [carrosLivres, setCarrosLivres] = useState([]);
  const [erroLivres, setErroLivres] = useState('');

  async function buscarAlugueisCliente(e) {
    e.preventDefault();
    const qs = nomeCliente ? `?nome=${encodeURIComponent(nomeCliente)}` : '';
    const res = await fetch(`/api/relatorios/aluguel-por-cliente${qs}`);
    setAlugueisCliente(await res.json());
  }

  async function buscarSomatorio(e) {
    e.preventDefault();
    const qs = cidade ? `?cidade=${encodeURIComponent(cidade)}` : '';
    const res = await fetch(`/api/relatorios/somatorio-por-cliente${qs}`);
    setSomatorio(await res.json());
  }

  async function buscarCarrosLivres(e) {
    e.preventDefault();
    setErroLivres('');
    const res = await fetch(`/api/relatorios/carros-nao-alugados?inicio=${inicio}&fim=${fim}`);
    const data = await res.json();
    if (!res.ok) {
      setErroLivres(data.error);
      return;
    }
    setCarrosLivres(data);
  }

  return (
    <div>
      <h2>Relatórios</h2>

      <section className="card">
        <h3>1. Aluguéis por cliente (INNER JOIN entre Cliente, Aluguel e Carros)</h3>
        <form onSubmit={buscarAlugueisCliente}>
          <input
            placeholder="Nome do cliente"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
        <table className="tabela">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Locação</th>
              <th>Entrega prevista</th>
              <th>Valor</th>
              <th>Placa</th>
            </tr>
          </thead>
          <tbody>
            {alugueisCliente.map((r, i) => (
              <tr key={i}>
                <td>{r.cliente}</td>
                <td>{r.data_locacao?.substring(0, 10)}</td>
                <td>{r.data_entrega_prevista?.substring(0, 10)}</td>
                <td>{r.valor}</td>
                <td>{r.placa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>2. Somatório de aluguéis por cliente (JOIN + agregação)</h3>
        <form onSubmit={buscarSomatorio}>
          <input
            placeholder="Filtrar por cidade (opcional)"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
        <table className="tabela">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Cidade</th>
              <th>Qtd. aluguéis</th>
              <th>Total gasto</th>
            </tr>
          </thead>
          <tbody>
            {somatorio.map((r, i) => (
              <tr key={i}>
                <td>{r.cliente}</td>
                <td>{r.cidade}</td>
                <td>{r.quantidade}</td>
                <td>{r.total_alugueis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>3. Carros disponíveis em um período (subconsulta com NOT IN)</h3>
        <form onSubmit={buscarCarrosLivres}>
          <label>
            De:{' '}
            <input required type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          </label>
          <label>
            Até:{' '}
            <input required type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
          </label>
          <button type="submit">Buscar</button>
        </form>
        {erroLivres && <p className="erro">{erroLivres}</p>}
        <table className="tabela">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Diária</th>
            </tr>
          </thead>
          <tbody>
            {carrosLivres.map((c) => (
              <tr key={c.id}>
                <td>{c.placa}</td>
                <td>{c.modelo}</td>
                <td>{c.marca}</td>
                <td>{c.valor_diaria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
