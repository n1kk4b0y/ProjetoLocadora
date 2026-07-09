
SELECT
    cl.nome                AS cliente,
    cl.cidade,
    COUNT(a.id)             AS quantidade_alugueis,
    SUM(a.valor)            AS total_gasto
FROM Cliente cl
INNER JOIN Aluguel a ON a.cliente_id = cl.id
WHERE cl.cidade = 'Niterói'
GROUP BY cl.nome, cl.cidade
HAVING SUM(a.valor) > 0
ORDER BY total_gasto DESC;
