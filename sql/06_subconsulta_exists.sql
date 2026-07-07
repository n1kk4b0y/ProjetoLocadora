-- =========================================================
-- Script 6: Subconsulta utilizando EXISTS
--
-- Regra de negócio: listar os carros que já foram alugados
-- pelo menos uma vez.
-- =========================================================

SELECT
    c.id,
    c.placa,
    c.modelo,
    c.marca
FROM Carros c
WHERE EXISTS (
    SELECT 1
    FROM Aluguel a
    WHERE a.carro_id = c.id
)
ORDER BY c.modelo;
