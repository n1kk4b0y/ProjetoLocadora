
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
