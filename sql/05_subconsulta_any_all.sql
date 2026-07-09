
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
