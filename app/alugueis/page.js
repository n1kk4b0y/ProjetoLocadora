'use client';
import { useState, useEffect } from 'react';

const formVazio = {
  cliente_id: '',
  carro_id: '',
  data_locacao: '',
  data_entrega_prevista: '',
  valor: '',
  status: 'ativo',
};

export default function AlugueisPage() {
  const [alugueis, setAlugueis] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);
  const [busca, setBusca] = useState({ inicio: '', fim: '' });
  const [form, setForm] = useState(formVazio);
  const [editId, setEditId] = useState(null);
  const [erro, setErro] = useState('');

  async function carregar(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/alugueis${qs ? `?${qs}` : ''}`);
    setAlugueis(await res.json());
  }

  useEffect(() => {
    carregar();
    fetch('/api/clientes').then((r) => r.json()).then(setClientes);
    fetch('/api/carros').then((r) => r.json()).then(setCarros);
  }, []);

  function handleBuscar(e) {
    e.preventDefault();
    const params = {};
    if (busca.inicio) params.inicio = busca.inicio;
    if (busca.fim) params.fim = busca.fim;
    carregar(params);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/alugueis/${editId}` : '/api/alugueis';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setErro(data.error || 'Erro ao salvar.');
      return;
    }
    setForm(formVazio);
    setEditId(null);
    carregar();
  }

  function handleEditar(a) {
    setEditId(a.id);
    setForm({
      cliente_id: a.cliente_id,
      carro_id: a.carro_id,
      data_locacao: a.data_locacao ? a.data_locacao.substring(0, 10) : '',
      data_entrega_prevista: a.data_entrega_prevista
        ? a.data_entrega_prevista.substring(0, 10)
        : '',
      valor: a.valor,
      status: a.status,
    });
  }

  async function handleExcluir(id) {
    if (!confirm('Confirma a exclusão deste aluguel?')) return;
    const res = await fetch(`/api/alugueis/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir.');
      return;
    }
    carregar();
  }

  return (
    <div>
      <h2>Aluguéis</h2>

      <form className="card" onSubmit={handleBuscar}>
        <h3>Pesquisar por período de locação</h3>
        <label>
          De:{' '}
          <input
            type="date"
            value={busca.inicio}
            onChange={(e) => setBusca({ ...busca, inicio: e.target.value })}
          />
        </label>
        <label>
          Até:{' '}
          <input
            type="date"
            value={busca.fim}
            onChange={(e) => setBusca({ ...busca, fim: e.target.value })}
          />
        </label>
        <button type="submit">Pesquisar</button>
        <button
          type="button"
          onClick={() => {
            setBusca({ inicio: '', fim: '' });
            carregar();
          }}
        >
          Limpar
        </button>
      </form>

      <form className="card" onSubmit={handleSalvar}>
        <h3>{editId ? 'Editar aluguel' : 'Novo aluguel'}</h3>
        {erro && <p className="erro">{erro}</p>}
        <select
          required
          value={form.cliente_id}
          onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
        >
          <option value="">Selecione o cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <select
          required
          value={form.carro_id}
          onChange={(e) => setForm({ ...form, carro_id: e.target.value })}
        >
          <option value="">Selecione o carro</option>
          {carros.map((c) => (
            <option key={c.id} value={c.id}>
              {c.modelo} - {c.placa}
            </option>
          ))}
        </select>
        <label>
          Locação:{' '}
          <input
            required
            type="date"
            value={form.data_locacao}
            onChange={(e) => setForm({ ...form, data_locacao: e.target.value })}
          />
        </label>
        <label>
          Entrega prevista:{' '}
          <input
            required
            type="date"
            value={form.data_entrega_prevista}
            onChange={(e) => setForm({ ...form, data_entrega_prevista: e.target.value })}
          />
        </label>
        <input
          required
          type="number"
          step="0.01"
          placeholder="Valor"
          value={form.valor}
          onChange={(e) => setForm({ ...form, valor: e.target.value })}
        />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="ativo">Ativo</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <button type="submit">{editId ? 'Atualizar' : 'Cadastrar'}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm(formVazio);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Carro (placa)</th>
            <th>Locação</th>
            <th>Entrega</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alugueis.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.nome_cliente}</td>
              <td>{a.placa}</td>
              <td>{a.data_locacao?.substring(0, 10)}</td>
              <td>{a.data_entrega_prevista?.substring(0, 10)}</td>
              <td>{a.valor}</td>
              <td>{a.status}</td>
              <td>
                <button onClick={() => handleEditar(a)}>Editar</button>
                <button onClick={() => handleExcluir(a.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
