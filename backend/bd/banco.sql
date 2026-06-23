CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    pontos INT DEFAULT 0,
    ranking INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Atividade (
    id_atividade INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);


CREATE TABLE Tarefa (
    id_atividade INT PRIMARY KEY,
    data_agendada DATETIME,
    status ENUM('pendente', 'concluida') DEFAULT 'pendente',
    data_conclusao DATETIME,
    FOREIGN KEY (id_atividade) REFERENCES Atividade(id_atividade)
);


CREATE TABLE Habito (
    id_atividade INT PRIMARY KEY,
    data_inicio DATE NOT NULL,
    tipo_metrica VARCHAR(50),
    tipo_recorrencia VARCHAR(50) NOT NULL,
    numero_repeticoes INT,
    dias_semana VARCHAR(50),
    quantidade INT,
    FOREIGN KEY (id_atividade) REFERENCES Atividade(id_atividade)
);

CREATE TABLE Registro_Habito (
    id_registro INT PRIMARY KEY AUTO_INCREMENT,
    id_habito INT NOT NULL,
    data DATE NOT NULL,
    status_conclusao ENUM('feito', 'nao_feito') NOT NULL,
    quantidade_concluida INT,
    tempo_concluido INT,
    FOREIGN KEY (id_habito) REFERENCES Habito(id_atividade)
);

CREATE TABLE Timer_Pomodoro (
    id_timer INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    duracao_foco INT NOT NULL,
    duracao_pausa_curta INT NOT NULL,
    duracao_pausa_longa INT NOT NULL,
    frequencia_pausa_longa INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Sessao_Pomodoro (
    id_sessao INT PRIMARY KEY AUTO_INCREMENT,
    id_timer INT NOT NULL,
    id_atividade INT,
    data DATETIME NOT NULL,
    periodo_atual ENUM('foco', 'pausa') NOT NULL,
    gestao_completa BOOLEAN,
    tempo_concluido INT,
    FOREIGN KEY (id_timer) REFERENCES Timer_Pomodoro(id_timer),
    FOREIGN KEY (id_atividade) REFERENCES Atividade(id_atividade)
);

CREATE TABLE Lembrete (
    id_lembrete INT PRIMARY KEY AUTO_INCREMENT,
    id_atividade INT NOT NULL,
    horario TIME NOT NULL,
    mensagem VARCHAR(255),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_atividade) REFERENCES Atividade(id_atividade)
);

CREATE TABLE Tipo_Lembrete (
    id_tipo_lembrete INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    numero_intervalo INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);