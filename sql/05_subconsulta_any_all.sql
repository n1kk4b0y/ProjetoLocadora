-- =========================================================
-- Script 5: Subconsulta utilizando operador de comparação ALL
--
-- Regra de negócio: listar os carros cuja diária é maior que
-- a diária de TODOS os carros da marca Fiat (ou seja, mais caros
-- que qualquer carro dessa marca).
-- =========================================================

SELECT
    placa,
    modelo,
    marca,
    valor_diaria
FROM Carros
WHERE valor_diaria > ALL (
    SELECT valor_diaria
    FROM Carros
    WHERE marca = 'Fiat'
)
ORDER BY valor_diaria DESC;
