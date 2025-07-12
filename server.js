// 1. Importação dos pacotes necessários
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // Importa o driver do SQLite

const app = express();
const port = 3000;

// 2. Middlewares
app.use(express.json()); // Para entender requisições com JSON
app.use(express.static(path.join(__dirname, 'public'))); // Para servir os arquivos do front-end

// 3. Conexão e Configuração do Banco de Dados
// O arquivo 'database.db' será criado na pasta do projeto se não existir
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        // Se houver um erro ao conectar (ex: permissão de pasta)
        console.error("Erro ao abrir o banco de dados:", err.message);
    } else {
        // Se a conexão for bem-sucedida
        console.log("Conectado ao banco de dados SQLite.");
        
        // Garante que os comandos SQL rodem um após o outro
        db.serialize(() => {
            // Cria a tabela de escolas (se ela não existir)
            db.run(`CREATE TABLE IF NOT EXISTS escolas (
                id INTEGER PRIMARY KEY,
                nome TEXT NOT NULL UNIQUE,
                nome_curto TEXT,
                latitude REAL,
                longitude REAL
            )`);

            // Cria a tabela de programas (se ela não existir)
            db.run(`CREATE TABLE IF NOT EXISTS programas (
                id INTEGER PRIMARY KEY,
                nome TEXT NOT NULL UNIQUE,
                descricao TEXT
            )`);

            // Cria a tabela que relaciona escolas e programas
            db.run(`CREATE TABLE IF NOT EXISTS escola_programa (
                escola_id INTEGER,
                programa_id INTEGER,
                status TEXT NOT NULL,
                FOREIGN KEY (escola_id) REFERENCES escolas (id),
                FOREIGN KEY (programa_id) REFERENCES programas (id),
                PRIMARY KEY (escola_id, programa_id)
            )`);

            console.log("Estrutura do banco de dados verificada/criada.");

            // 4. Inserção dos Dados Iniciais (População do Banco)
            const escolas = [
                [1, 'CEMI Cruzeiro', 'CEMI', -15.789, -47.940],
                [2, 'CEM da Asa Norte (CEAN)', 'CEAN', -15.772, -47.884],
                [3, 'CEM Elefante Branco (CEMEB)', 'CEMEB', -15.800, -47.883],
                [4, 'CEM Paulo Freire', 'P. Freire', -15.753, -47.886],
                [5, 'CEM Setor Leste', 'CENSEL', -15.803, -47.868],
                [6, 'CEM Setor Oeste', 'CEMSO', -15.792, -47.915]
            ];
            const sqlEscolas = `INSERT OR IGNORE INTO escolas (id, nome, nome_curto, latitude, longitude) VALUES (?, ?, ?, ?, ?)`;
            escolas.forEach(e => db.run(sqlEscolas, e));

            const programas = [
                [1, 'Programa de Inovação Educação Conectada (PIEC)', 'Foca no uso de tecnologias digitais e acesso à internet.'],
                [2, 'Plano de Ações Articuladas (PAR)', 'Ferramenta de diagnóstico e planejamento de políticas educacionais.'],
                [3, 'Exame Nacional do Ensino Médio (Enem)', 'Avalia o desempenho escolar e serve como acesso ao ensino superior.'],
                [4, 'Programa de Apoio à Implementação da BNCC', 'Apoia as redes na implementação de currículos alinhados à BNCC.'],
                [5, 'Programa Nacional do Livro e do Material Didático', 'Disponibiliza obras didáticas, pedagógicas e literárias.'],
                [6, 'Novo Ensino Médio', 'Reestruturação do ensino médio com foco na flexibilidade curricular.'],
                [7, 'Centro de Iniciação Desportiva (CID)', 'Oferece acesso à prática de atividades esportivas.'],
                [8, 'Ensino Médio em Tempo Integral (EMTI)', 'Programa para ampliar a carga horária e promover a educação integral.'],
                [9, 'Programa Pé-de-Meia', 'Incentivo financeiro para a permanência de estudantes no ensino médio.']
            ];
            const sqlProgramas = `INSERT OR IGNORE INTO programas (id, nome, descricao) VALUES (?, ?, ?)`;
            programas.forEach(p => db.run(sqlProgramas, p));

            const relacoes = [
                [1, 1, 'Não Iniciado'], [1, 2, 'Suspenso'], [1, 4, 'Ativo'], [1, 9, 'Ativo'],
                [2, 1, 'Não Iniciado'], [2, 2, 'Suspenso'], [2, 4, 'Ativo'], [2, 9, 'Ativo'],
                [3, 1, 'Não Iniciado'], [3, 2, 'Suspenso'], [3, 8, 'Ativo'], [3, 9, 'Ativo'],
                [4, 1, 'Não Iniciado'], [4, 2, 'Suspenso'], [4, 7, 'Ativo'], [4, 9, 'Ativo'],
                [5, 1, 'Não Iniciado'], [5, 2, 'Suspenso'], [5, 7, 'Ativo'], [5, 9, 'Ativo'],
                [6, 1, 'Não Iniciado'], [6, 2, 'Suspenso'], [6, 9, 'Ativo']
            ];
            const sqlRelacoes = `INSERT OR IGNORE INTO escola_programa (escola_id, programa_id, status) VALUES (?, ?, ?)`;
            relacoes.forEach(r => db.run(sqlRelacoes, r));
        });
    }
});

// 5. Rota da API
// Este endpoint busca os dados das 3 tabelas e os combina em uma única resposta
app.get('/api/dados-completos', (req, res) => {
    const sql = `
        SELECT 
            e.id as escolaId, e.nome as escolaNome, e.nome_curto as escolaNomeCurto, e.latitude, e.longitude,
            p.id as programaId, p.nome as programaNome, p.descricao as programaDescricao,
            ep.status
        FROM escolas e
        JOIN escola_programa ep ON e.id = ep.escola_id
        JOIN programas p ON p.id = ep.programa_id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// 6. Rota de Fallback (para a SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 7. Iniciar o Servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
