

CREATE DATABASE locadora_db;


DROP TABLE IF EXISTS Aluguel;
DROP TABLE IF EXISTS Carros;
DROP TABLE IF EXISTS Cliente;

-- Tabela: Carros
CREATE TABLE Carros (
    id            SERIAL PRIMARY KEY,
    placa         VARCHAR(10)   NOT NULL UNIQUE,
    modelo        VARCHAR(100)  NOT NULL,
    marca         VARCHAR(50)   NOT NULL,
    ano           INT           NOT NULL,
    valor_diaria  NUMERIC(10,2) NOT NULL
);

-- Tabela: Cliente
CREATE TABLE Cliente (
    id             SERIAL PRIMARY KEY,
    nome           VARCHAR(150) NOT NULL,
    cpf            VARCHAR(14)  NOT NULL UNIQUE,
    telefone       VARCHAR(20),
    cidade         VARCHAR(100),
    data_cadastro  DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Tabela: Aluguel (tabela associativa entre Cliente e Carros)
CREATE TABLE Aluguel (
    id                     SERIAL PRIMARY KEY,
    cliente_id             INT NOT NULL,
    carro_id               INT NOT NULL,
    data_locacao           DATE NOT NULL,
    data_entrega_prevista  DATE NOT NULL,
    valor                  NUMERIC(10,2) NOT NULL,
    status                 VARCHAR(20) NOT NULL DEFAULT 'ativo',


    CONSTRAINT fk_aluguel_cliente FOREIGN KEY (cliente_id)
        REFERENCES Cliente(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_aluguel_carro FOREIGN KEY (carro_id)
        REFERENCES Carros(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
