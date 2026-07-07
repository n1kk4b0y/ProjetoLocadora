-- =========================================================
-- Script 2: Inserção de dados de exemplo (mínimo 5 por tabela)
-- =========================================================

INSERT INTO Carros (placa, modelo, marca, ano, valor_diaria) VALUES
('ABC1D23', 'Onix',     'Chevrolet', 2022, 120.00),
('DEF4E56', 'HB20',     'Hyundai',   2021, 110.00),
('GHI7F89', 'Corolla',  'Toyota',    2023, 180.00),
('JKL0G12', 'Argo',     'Fiat',      2020, 95.00),
('MNO3H45', 'Civic',    'Honda',     2022, 190.00),
('PQR6I78', 'Polo',     'Volkswagen',2023, 130.00);

INSERT INTO Cliente (nome, cpf, telefone, cidade, data_cadastro) VALUES
('Ana Paula Souza',    '111.111.111-11', '(21) 91111-1111', 'Niterói',       '2025-01-10'),
('Bruno Carvalho',     '222.222.222-22', '(21) 92222-2222', 'Rio de Janeiro','2025-02-15'),
('Carla Mendes',       '333.333.333-33', '(21) 93333-3333', 'Niterói',       '2025-03-05'),
('Diego Fernandes',    '444.444.444-44', '(24) 94444-4444', 'Petrópolis',    '2025-04-20'),
('Elaine Ribeiro',     '555.555.555-55', '(21) 95555-5555', 'Niterói',       '2025-05-12'),
('Felipe Andrade',     '666.666.666-66', '(21) 96666-6666', 'São Gonçalo',   '2025-06-01');

INSERT INTO Aluguel (cliente_id, carro_id, data_locacao, data_entrega_prevista, valor, status) VALUES
(1, 1, '2026-05-01', '2026-05-05', 480.00, 'finalizado'),
(2, 3, '2026-05-10', '2026-05-12', 360.00, 'finalizado'),
(3, 2, '2026-06-01', '2026-06-04', 330.00, 'finalizado'),
(1, 5, '2026-06-15', '2026-06-18', 570.00, 'ativo'),
(4, 4, '2026-06-20', '2026-06-22', 190.00, 'ativo'),
(5, 6, '2026-07-01', '2026-07-03', 260.00, 'ativo');
