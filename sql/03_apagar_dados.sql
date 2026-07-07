-- =========================================================
-- Script 3: Apagar os dados de todas as tabelas
-- Ordem importa por causa das chaves estrangeiras (RESTRICT):
-- primeiro a tabela "filha" (Aluguel), depois as "mãe" (Cliente, Carros)
-- =========================================================

DELETE FROM Aluguel;
DELETE FROM Carros;
DELETE FROM Cliente;

-- Reinicia os contadores de id (opcional)
ALTER SEQUENCE aluguel_id_seq RESTART WITH 1;
ALTER SEQUENCE carros_id_seq RESTART WITH 1;
ALTER SEQUENCE cliente_id_seq RESTART WITH 1;
