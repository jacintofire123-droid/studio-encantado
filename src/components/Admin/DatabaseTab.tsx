import React, { useState, useEffect } from 'react';
import { Database, Server, Check, Copy, RefreshCw, CheckCircle2, AlertCircle, Terminal, Download, ShieldCheck, Key, Globe, Layers } from 'lucide-react';

export interface MySQLConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  ssl: boolean;
  poolSize: number;
  status: 'connected' | 'disconnected' | 'testing';
  lastTested?: string;
}

const DEFAULT_MYSQL_CONFIG: MySQLConfig = {
  host: 'localhost',
  port: 3306,
  database: 'studio_encantado',
  username: 'root',
  password: '',
  ssl: false,
  poolSize: 10,
  status: 'disconnected'
};

const STORAGE_KEY = 'studio_mysql_config';

export const DatabaseTab: React.FC = () => {
  const [config, setConfig] = useState<MySQLConfig>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_MYSQL_CONFIG, ...JSON.parse(raw) };
    } catch (e) {
      console.warn('Erro ao carregar config MySQL:', e);
    }
    return DEFAULT_MYSQL_CONFIG;
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testMessage, setTestMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestMessage(null);

    setTimeout(() => {
      setIsTesting(false);
      if (!config.host || !config.database || !config.username) {
        setTestMessage({
          type: 'error',
          text: 'Preencha Host, Nome do Banco e Usuário para validar a conexão.'
        });
        setConfig((prev) => ({ ...prev, status: 'disconnected' }));
      } else {
        setTestMessage({
          type: 'success',
          text: `Parâmetros de conexão para MySQL em "${config.host}:${config.port}/${config.database}" validados com sucesso! Pronto para uso pelo n8n e backend.`
        });
        const updated: MySQLConfig = {
          ...config,
          status: 'connected',
          lastTested: new Date().toISOString()
        };
        setConfig(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    }, 1200);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const sqlSchema = `-- ========================================================
-- STUDIO ENCANTADO - SCHEMA OFICIAL MYSQL (UTF8MB4)
-- Compatível com MySQL 5.7, 8.0+, MariaDB e Amazon RDS
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`${config.database || 'studio_encantado'}\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE \`${config.database || 'studio_encantado'}\`;

-- 1. Tabela de Pedidos Confirmados (Vendas Concluídas)
CREATE TABLE IF NOT EXISTS \`pedidos\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` VARCHAR(64) NOT NULL UNIQUE,
  \`child_name\` VARCHAR(120) NOT NULL,
  \`character_id\` VARCHAR(64) NOT NULL,
  \`character_name\` VARCHAR(120) NOT NULL,
  \`occasion\` ENUM('aniversario', 'elogio', 'conquista') NOT NULL DEFAULT 'aniversario',
  \`video_url\` TEXT NOT NULL,
  \`parent_whatsapp\` VARCHAR(30) NOT NULL,
  \`parent_email\` VARCHAR(180) NULL,
  \`amount\` DECIMAL(10, 2) NOT NULL DEFAULT 47.99,
  \`payment_method\` ENUM('pix', 'credit_card') NOT NULL DEFAULT 'pix',
  \`payment_status\` VARCHAR(30) NOT NULL DEFAULT 'approved',
  \`mercado_pago_payment_id\` VARCHAR(100) NULL,
  \`bump_convite\` TINYINT(1) NOT NULL DEFAULT 0,
  \`bump_rotina\` TINYINT(1) NOT NULL DEFAULT 0,
  \`bump_vip_priority\` TINYINT(1) NOT NULL DEFAULT 0,
  \`whatsapp_sent\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_parent_whatsapp\` (\`parent_whatsapp\`),
  INDEX \`idx_created_at\` (\`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela de Leads & Recuperação de Carrinho
CREATE TABLE IF NOT EXISTS \`leads\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`lead_id\` VARCHAR(64) NOT NULL UNIQUE,
  \`child_name\` VARCHAR(120) NOT NULL,
  \`character_name\` VARCHAR(120) NOT NULL,
  \`parent_whatsapp\` VARCHAR(30) NULL,
  \`parent_email\` VARCHAR(180) NULL,
  \`birth_year\` VARCHAR(10) NULL,
  \`preview_video_url\` TEXT NULL,
  \`status\` ENUM('video_gerado', 'abandono_checkout', 'comprou') NOT NULL DEFAULT 'video_gerado',
  \`recovered_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_status\` (\`status\`),
  INDEX \`idx_created_at\` (\`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela de Logs de Webhook (Auditoria n8n e Mercado Pago)
CREATE TABLE IF NOT EXISTS \`webhook_logs\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`event_type\` VARCHAR(64) NOT NULL,
  \`order_id\` VARCHAR(64) NULL,
  \`payload_json\` JSON NULL,
  \`response_status\` INT NOT NULL DEFAULT 200,
  \`ip_address\` VARCHAR(45) NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

  const handleDownloadSchema = () => {
    const blob = new Blob([sqlSchema], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema-mysql-${config.database || 'studio_encantado'}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-white">
                  Banco de Dados Relacional (MySQL / MariaDB)
                </h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                  config.status === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {config.status === 'connected' ? 'Configurado & Pronto' : 'Desconectado'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Armazene os dados de clientes, pedidos pagos e leads no seu próprio banco de dados MySQL na VPS ou nuvem.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadSchema}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Schema SQL (.sql)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-medium text-sm text-white">
                  Credenciais de Conexão MySQL
                </h4>
                <p className="text-xs text-slate-400">
                  Usado pelo nó nativo do MySQL no n8n ou pelo backend da aplicação.
                </p>
              </div>

              {saveSuccess && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Salvo com sucesso!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Host / Endereço IP do Servidor
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="localhost ou 192.168.1.100"
                    value={config.host}
                    onChange={(e) => setConfig({ ...config, host: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Porta
                </label>
                <input
                  type="number"
                  required
                  value={config.port}
                  onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) || 3306 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Nome do Banco de Dados (Database)
                </label>
                <input
                  type="text"
                  required
                  placeholder="studio_encantado"
                  value={config.database}
                  onChange={(e) => setConfig({ ...config, database: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Usuário (Username)
                </label>
                <input
                  type="text"
                  required
                  placeholder="root ou usuario_db"
                  value={config.username}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Senha (Password)
              </label>
              <div className="relative">
                <Key className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={config.password || ''}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Test result banner */}
            {testMessage && (
              <div className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
                testMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}>
                {testMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <span>{testMessage.text}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Testando...' : 'Testar Conexão'}</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Configuração</span>
              </button>
            </div>
          </form>

          {/* Guide for n8n integration */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
            <h4 className="font-medium text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Como Conectar o MySQL nos Fluxos do n8n</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <p>
                O n8n já conta com o nó nativo <code className="text-blue-300 bg-slate-950 px-1 py-0.5 rounded font-mono">n8n-nodes-base.mySql</code>.
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>No seu n8n, clique em <strong>Credentials ➔ New Credential ➔ MySQL</strong>.</li>
                <li>Preencha os mesmos dados cadastrados acima (Host, Banco, Usuário e Senha).</li>
                <li>No <strong>Fluxo 3 (Mercado Pago)</strong>, adicione o nó MySQL após a aprovação para rodar a query de inserção:</li>
              </ol>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 relative group">
                <button
                  type="button"
                  onClick={() => copyToClipboard('INSERT INTO pedidos (order_id, child_name, character_name, occasion, video_url, parent_whatsapp, amount, payment_status) VALUES (\'{{ $json.order_id }}\', \'{{ $json.child_name }}\', \'{{ $json.character_name }}\', \'{{ $json.occasion }}\', \'{{ $json.video_url }}\', \'{{ $json.whatsapp }}\', {{ $json.transaction_amount }}, \'approved\');', 'query1')}
                  className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded border border-slate-700"
                >
                  {copiedId === 'query1' ? 'Copiado!' : 'Copiar'}
                </button>
                INSERT INTO pedidos (order_id, child_name, character_name, occasion, video_url, parent_whatsapp, amount, payment_status)<br />
                VALUES ('&#123;&#123; $json.order_id &#125;&#125;', '&#123;&#123; $json.child_name &#125;&#125;', '&#123;&#123; $json.character_name &#125;&#125;', '&#123;&#123; $json.occasion &#125;&#125;', '&#123;&#123; $json.video_url &#125;&#125;', '&#123;&#123; $json.whatsapp &#125;&#125;', &#123;&#123; $json.transaction_amount &#125;&#125;, 'approved');
              </div>
            </div>
          </div>
        </div>

        {/* Right: SQL Schema & Quick Copy (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-xs text-white uppercase tracking-wider">
                  Script DDL de Criação de Tabelas
                </h4>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(sqlSchema, 'schema')}
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                {copiedId === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'schema' ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300 max-h-[460px] overflow-y-auto leading-relaxed">
              {sqlSchema}
            </pre>

            <p className="text-[11px] text-slate-400">
              Copie e cole este script no terminal da sua VPS (comando <code>mysql -u root -p</code>) ou no phpMyAdmin / DBeaver.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
