'use client';
import { useState, useEffect } from 'react';

const formVazio = { nome: '', cpf: '', telefone: '', cidade: '', data_cadastro: '' };

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState({ nome: '', cidade: '' });
  const [form, setForm] = useState(formVazio);
  const [editId, setEditId] = useState(null);
  const [erro, setErro] = useState('');

  async function carregar(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`/api/clientes${qs ? `?${qs}` : ''}`);
      const data = await res.json();

      // Validação de segurança crucial aqui
      if (Array.isArray(data)) {
        setClientes(data);
      } else {
        console.error("A API retornou um erro em vez de uma lista:", data);
        setClientes([]); // Garante que clientes continue sendo um array vazio para não quebrar a tela
      }
    } catch (error) {
      console.error("Erro de rede ao buscar dados:", error);
      setClientes([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleBuscar(e) {
    e.preventDefault();
    const params = {};
    if (busca.nome) params.nome = busca.nome;
    if (busca.cidade) params.cidade = busca.cidade;
    carregar(params);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/clientes/${editId}` : '/api/clientes';
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

  function handleEditar(cliente) {
    setEditId(cliente.id);
    setForm({
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone || '',
      cidade: cliente.cidade || '',
      data_cadastro: cliente.data_cadastro ? cliente.data_cadastro.substring(0, 10) : '',
    });
  }

  async function handleExcluir(id) {
    if (!confirm('Confirma a exclusão deste cliente?')) return;
    const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir.');
      return;
    }
    carregar();
  }

  return (
    <div>
      <h2>Clientes</h2>

      <form className="card" onSubmit={handleBuscar}>
        <h3>Pesquisar cliente</h3>
        <input
          placeholder="Nome"
          value={busca.nome}
          onChange={(e) => setBusca({ ...busca, nome: e.target.value })}
        />
        <input
          placeholder="Cidade"
          value={busca.cidade}
          onChange={(e) => setBusca({ ...busca, cidade: e.target.value })}
        />
        <button type="submit">Pesquisar</button>
        <button
          type="button"
          onClick={() => {
            setBusca({ nome: '', cidade: '' });
            carregar();
          }}
        >
          Limpar
        </button>
      </form>

      <form className="card" onSubmit={handleSalvar}>
        <h3>{editId ? 'Editar cliente' : 'Novo cliente'}</h3>
        {erro && <p className="erro">{erro}</p>}
        <input
          required
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
        <input
          required
          placeholder="CPF"
          value={form.cpf}
          onChange={(e) => setForm({ ...form, cpf: e.target.value })}
        />
        <input
          placeholder="Telefone"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
        />
        <input
          placeholder="Cidade"
          value={form.cidade}
          onChange={(e) => setForm({ ...form, cidade: e.target.value })}
        />
        <label>
          Cadastro:{' '}
          <input
            type="date"
            value={form.data_cadastro}
            onChange={(e) => setForm({ ...form, data_cadastro: e.target.value })}
          />
        </label>
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
            <th>Nome</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Cidade</th>
            <th>Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nome}</td>
              <td>{c.cpf}</td>
              <td>{c.telefone}</td>
              <td>{c.cidade}</td>
              <td>{c.data_cadastro?.substring(0, 10)}</td>
              <td>
                <button onClick={() => handleEditar(c)}>Editar</button>
                <button onClick={() => handleExcluir(c.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
