# Sistema Office - Modelo Genérico para Unidades Organizacionais

Este documento descreve o sistema Office implementado no Themis, um modelo genérico para representar unidades organizacionais que pode ser aplicado a diferentes domínios como gabinetes parlamentares, clínicas, empresas, etc.

## Visão Geral

O sistema Office foi projetado para ser **simples, flexível e multi-domínio**, permitindo que uma única implementação atenda a diferentes necessidades organizacionais sem complexidade excessiva.

### Arquitetura da Solução

```
Organization (Organização Principal)
├── Office (Unidades Organizacionais)
│   └── OfficeUser (Usuários com Permissões)
└── Demand (Demandas atribuídas a unidades)
```

## Modelos Principais

### 1. Office - Unidade Organizacional

**Propósito**: Representa qualquer tipo de unidade organizacional dentro de uma organização.

#### Campos Principais

- **Identificação**:

  - `id`: Identificador único
  - `name`: Nome da unidade
  - `code`: Código único por organização
  - `description`: Descrição opcional

- **Classificação**:

  - `type`: Tipo da unidade (enum OfficeType)
  - `status`: Status da unidade (enum OfficeStatus)

- **Localização**:

  - `address`: Endereço completo
  - `city`: Cidade
  - `state`: Estado
  - `zipCode`: CEP
  - `neighborhood`: Bairro
  - `complement`: Complemento

- **Contato**:

  - `phone`: Telefone
  - `email`: Email
  - `whatsapp`: WhatsApp

- **Configurações**:
  - `capacity`: Capacidade específica (leitos, consultórios, etc.)
  - `maxUsers`: Limite máximo de usuários
  - `openingHours`: Horário de funcionamento
  - `isOpenOnWeekends`: Funciona nos fins de semana
  - `metadata`: Campo JSON para dados específicos por tipo

#### Relacionamentos

- `organization`: Pertence a uma Organization
- `officeUsers`: Usuários com acesso à unidade
- `demands`: Demandas atribuídas à unidade

### 2. OfficeUser - Relacionamento Usuário-Unidade

**Propósito**: Controla o acesso de usuários a unidades específicas com permissões granulares.

#### Campos Principais

- **Identificação**:

  - `userId`: ID do usuário
  - `officeId`: ID da unidade

- **Permissões**:

  - `role`: Função na unidade (enum OfficeRole)
  - `permissions`: Array de permissões específicas
  - `isActive`: Se o acesso está ativo

- **Controle Temporal**:
  - `accessStartDate`: Data de início do acesso
  - `accessEndDate`: Data de término do acesso (opcional)

## Tipos de Office (OfficeType)

### Para Gabinetes Parlamentares

- **`MAIN_OFFICE`**: Gabinete principal do parlamentar
- **`REGIONAL_OFFICE`**: Escritório regional
- **`SERVICE_CENTER`**: Centro de atendimento ao cidadão
- **`SPECIALIZED_UNIT`**: Unidade especializada (jurídica, comunicação, etc.)

### Para Clínicas e Hospitais

- **`CONSULTATION_ROOM`**: Consultório médico
- **`EMERGENCY_ROOM`**: Sala de emergência
- **`WARD`**: Enfermaria
- **`SURGERY_ROOM`**: Sala de cirurgia
- **`LABORATORY`**: Laboratório
- **`IMAGING_CENTER`**: Centro de imagem (raio-X, ultrassom, etc.)

### Tipos Genéricos (Removidos do Schema)

_Nota: Estes tipos foram removidos do schema para simplificar, mas podem ser implementados usando o campo `metadata` ou adicionados conforme necessário._

- **`BRANCH`**: Filial
- **`DEPARTMENT`**: Departamento
- **`DIVISION`**: Divisão
- **`UNIT`**: Unidade genérica
- **`OTHER`**: Outros tipos não especificados

## Status e Roles

### OfficeStatus

- **`ACTIVE`**: Unidade ativa e funcionando
- **`INACTIVE`**: Unidade inativa temporariamente
- **`SUSPENDED`**: Unidade suspensa
- **`MAINTENANCE`**: Em manutenção

### OfficeRole

- **`ADMIN`**: Administrador da unidade
- **`MANAGER`**: Gerente
- **`SUPERVISOR`**: Supervisor
- **`STAFF`**: Funcionário padrão
- **`SPECIALIST`**: Especialista
- **`RECEPTIONIST`**: Recepcionista
- **`INTERN`**: Estagiário
- **`VOLUNTEER`**: Voluntário
- **`OTHER`**: Outros tipos de função

## Exemplos de Uso

### Gabinete Parlamentar

```sql
-- Gabinete principal do deputado
INSERT INTO office (
  name, code, type, organizationId,
  address, city, state, zipCode,
  phone, email, maxUsers
) VALUES (
  'Gabinete do Deputado João Silva',
  'GAB-001',
  'MAIN_OFFICE',
  'org-123',
  'Rua das Flores, 123',
  'Brasília',
  'DF',
  '70000-000',
  '(61) 99999-9999',
  'gabinete@joaosilva.com.br',
  15
);

-- Escritório regional
INSERT INTO office (
  name, code, type, organizationId,
  address, city, state, zipCode,
  phone, maxUsers
) VALUES (
  'Escritório Regional Sul',
  'REG-001',
  'REGIONAL_OFFICE',
  'org-123',
  'Av. Paulista, 1000',
  'São Paulo',
  'SP',
  '01310-100',
  '(11) 99999-8888',
  8
);

-- Centro de atendimento
INSERT INTO office (
  name, code, type, organizationId,
  address, city, state, zipCode,
  phone, openingHours, isOpenOnWeekends
) VALUES (
  'Centro de Atendimento ao Cidadão',
  'CAC-001',
  'SERVICE_CENTER',
  'org-123',
  'Praça da República, 50',
  'São Paulo',
  'SP',
  '01045-000',
  '(11) 99999-7777',
  '08:00-18:00',
  false
);
```

### Clínica Médica

```sql
-- Consultório de cardiologia
INSERT INTO office (
  name, code, type, organizationId,
  address, city, state, zipCode,
  phone, capacity, metadata
) VALUES (
  'Consultório de Cardiologia',
  'CARD-001',
  'CONSULTATION_ROOM',
  'org-456',
  'Rua das Palmeiras, 200',
  'São Paulo',
  'SP',
  '01234-567',
  '(11) 99999-6666',
  2,
  '{"specialty": "Cardiologia", "equipment": ["Eletrocardiograma", "Ecocardiograma", "Holter"]}'
);

-- Sala de emergência
INSERT INTO office (
  name, code, type, organizationId,
  address, city, state, zipCode,
  phone, capacity, openingHours, isOpenOnWeekends
) VALUES (
  'Emergência 24h',
  'EMERG-001',
  'EMERGENCY_ROOM',
  'org-456',
  'Rua das Palmeiras, 200',
  'São Paulo',
  'SP',
  '01234-567',
  '(11) 99999-5555',
  10,
  '24:00',
  true
);

-- Laboratório
INSERT INTO office (
  name, code, type, organizationId,
  address, city, state, zipCode,
  phone, metadata
) VALUES (
  'Laboratório de Análises Clínicas',
  'LAB-001',
  'LABORATORY',
  'org-456',
  'Rua das Palmeiras, 200',
  'São Paulo',
  'SP',
  '01234-567',
  '(11) 99999-4444',
  '{"specialties": ["Hematologia", "Bioquímica", "Microbiologia"], "certifications": ["ISO 15189"]}'
);
```

### Atribuição de Usuários

```sql
-- Médico cardiologista no consultório
INSERT INTO office_user (
  userId, officeId, role, permissions, isActive
) VALUES (
  'user-789',
  'office-card-001',
  'SPECIALIST',
  '["view_patients", "create_consultations", "update_medical_records"]',
  true
);

-- Enfermeira na emergência
INSERT INTO office_user (
  userId, officeId, role, permissions, isActive
) VALUES (
  'user-790',
  'office-emerg-001',
  'STAFF',
  '["view_patients", "update_vital_signs", "administer_medication"]',
  true
);

-- Recepcionista no centro de atendimento
INSERT INTO office_user (
  userId, officeId, role, permissions, isActive
) VALUES (
  'user-791',
  'office-cac-001',
  'RECEPTIONIST',
  '["view_demands", "create_demands", "schedule_appointments"]',
  true
);
```

## Controle de Acesso

### Princípios

1. **Isolamento por Organização**: Usuários só veem dados da organização onde estão logados
2. **Controle por Unidade**: Usuários só veem dados das unidades onde têm acesso
3. **Permissões Granulares**: Cada usuário pode ter permissões específicas por unidade
4. **Auditoria Completa**: Todas as ações são registradas com usuário e timestamp

### Fluxo de Acesso

1. **Login**: Usuário faz login no sistema
2. **Seleção de Organização**: Escolhe a organização (se tiver múltiplas)
3. **Verificação de Unidades**: Sistema verifica em quais unidades o usuário tem acesso
4. **Filtragem de Dados**: Apenas dados das unidades permitidas são exibidos
5. **Controle de Ações**: Permissões específicas controlam o que o usuário pode fazer

### Exemplo de Consulta

```sql
-- Buscar demandas que o usuário pode ver
SELECT d.*, o.name as office_name
FROM demand d
JOIN office o ON d.officeId = o.id
JOIN office_user ou ON o.id = ou.officeId
WHERE ou.userId = 'user-123'
  AND ou.isActive = true
  AND o.organizationId = 'org-456'
  AND (ou.accessEndDate IS NULL OR ou.accessEndDate > NOW());
```

## Integração com Demandas

### Atribuição de Demandas

As demandas podem ser atribuídas a unidades específicas através do campo `officeId`:

```sql
-- Atribuir demanda a uma unidade
UPDATE demand
SET officeId = 'office-card-001'
WHERE id = 'demand-123';
```

### Roteamento Automático

O sistema pode implementar regras de roteamento automático baseadas em:

- **Tipo de demanda**: Consulta médica → Consultório
- **Localização**: Demanda de São Paulo → Escritório Regional SP
- **Especialidade**: Problema cardiológico → Consultório de Cardiologia
- **Urgência**: Emergência → Sala de Emergência

## Vantagens da Implementação

### 1. Simplicidade

- Apenas 2 novos modelos vs 8 da implementação anterior
- Schema limpo e fácil de entender
- Manutenção simplificada

### 2. Flexibilidade

- Um modelo genérico se adapta a diferentes domínios
- Campo `metadata` permite extensões específicas
- Fácil adição de novos tipos de unidade

### 3. Escalabilidade

- Suporte a organizações de qualquer tamanho
- Crescimento sem alterações no schema
- Performance otimizada com índices adequados

### 4. Multi-domínio

- Funciona para gabinetes parlamentares
- Funciona para clínicas e hospitais
- Funciona para empresas e organizações
- Fácil adaptação para novos domínios

### 5. Segurança

- Isolamento por organização
- Controle granular de acesso
- Auditoria completa de ações
- Conformidade com LGPD

## Considerações de Implementação

### 1. Performance

- Índices otimizados para consultas frequentes
- Relacionamentos eficientes
- Suporte a grandes volumes de dados

### 2. Segurança

- Validação de permissões em todas as operações
- Logs de auditoria para todas as ações
- Isolamento rigoroso de dados

### 3. Usabilidade

- Interface intuitiva para gestão de unidades
- Controle fácil de permissões
- Relatórios de acesso e uso

### 4. Manutenibilidade

- Código limpo e bem documentado
- Testes automatizados
- Documentação atualizada

## Próximos Passos

1. **Implementação dos Repositórios**: Criar classes de acesso a dados
2. **Desenvolvimento dos Serviços**: Implementar lógica de negócio
3. **Interface de Usuário**: Criar componentes para gestão
4. **Sistema de Permissões**: Implementar middleware de controle
5. **Testes e Validação**: Validar funcionalidades
6. **Documentação de API**: Documentar endpoints
7. **Treinamento**: Capacitar usuários finais

## Conclusão

O sistema Office oferece uma solução elegante e flexível para gestão de unidades organizacionais, atendendo a diferentes domínios com uma implementação simples e eficiente. A arquitetura permite crescimento futuro sem complexidade excessiva, mantendo a segurança e performance necessárias para aplicações em produção.

A escolha por um modelo genérico com tipos específicos para cada domínio garante que o sistema seja tanto flexível quanto específico, atendendo às necessidades reais dos usuários sem sobrecarga desnecessária.
