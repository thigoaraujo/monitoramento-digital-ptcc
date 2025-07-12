const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Conexão com o Banco de Dados ---
// Abre o banco em modo de leitura (read-only) para segurança no ambiente de produção
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("Erro ao abrir o banco de dados em modo de leitura:", err.message);
        // Se falhar (ex: no primeiro deploy), tenta abrir em modo de escrita para criar o DB
        // Este fallback é útil, mas o ideal é que o DB já exista no repositório.
        initializeDatabase();
    } else {
        console.log("Conectado ao banco de dados SQLite em modo de leitura.");
    }
});

// Função para inicializar o banco (usada apenas se a conexão read-only falhar)
function initializeDatabase() {
    const writeDb = new sqlite3.Database('./database.db', (err) => {
        if (err) return console.error("Erro crítico ao inicializar o banco:", err.message);
        console.log("Conectado em modo de escrita para inicialização.");
        // A lógica de criação de tabelas e inserção de dados foi removida daqui
        // pois o banco já deve existir no repositório.
    });
}

// --- Rota da API ---
app.get('/api/dados-completos', (req, res) => {
    const sql = `
        SELECT 
            e.id as escolaId, e.nome as escolaNome, e.nome_curto as escolaNomeCurto, e.latitude, e.longitude,
            p.id as programaId, p.nome as programaNome, p.descricao as programaDescricao,
            ep.status
        FROM escolas e
        LEFT JOIN escola_programa ep ON e.id = ep.escola_id
        LEFT JOIN programas p ON p.id = ep.programa_id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Erro na consulta à API:", err);
            res.status(500).json({ "error": "Erro ao consultar o banco de dados." });
            return;
        }
        res.json(rows);
    });
});

// Rota de fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
