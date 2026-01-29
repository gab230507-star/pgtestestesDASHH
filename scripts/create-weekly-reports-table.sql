-- Tabela de Relatórios Semanais (Leitura Semanal da Operação)
CREATE TABLE IF NOT EXISTS weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Informações básicas
  report_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Em validação',
  
  -- Conteúdo do relatório
  weekly_summary TEXT, -- Resumo da Semana
  actions_taken TEXT, -- O que foi feito
  data_analysis TEXT, -- Leitura dos Dados
  decisions_made TEXT, -- Decisões Tomadas
  next_week_guidance TEXT, -- Orientação para a Próxima Semana
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para buscas por cliente e data
CREATE INDEX IF NOT EXISTS idx_weekly_reports_client_id ON weekly_reports(client_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_report_date ON weekly_reports(report_date DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_weekly_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_weekly_reports_updated_at ON weekly_reports;
CREATE TRIGGER trigger_update_weekly_reports_updated_at
  BEFORE UPDATE ON weekly_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_weekly_reports_updated_at();
