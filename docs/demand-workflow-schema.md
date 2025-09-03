# Demand/Protocol + Queue + SLA + Workflow Schema

Este documento descreve o schema Prisma para o domínio de Demandas/Protocolos + Filas + SLA + Workflow implementado no sistema Themis.

## Visão Geral

O schema implementa um sistema completo de gestão de demandas com:

- **Demandas/Protocolos**: Sistema de tickets com numeração sequencial por organização
- **Filas**: Organização de demandas por categoria ou equipe
- **SLA**: Acordos de nível de serviço com controle de prazos
- **Workflow**: Histórico de status, atribuições e comentários
- **Escalação**: Regras automáticas para demandas que ultrapassam prazos

## Modelos Principais

### 1. Demand (Demanda)

Modelo central que representa uma demanda ou protocolo no sistema.

**Campos principais:**

- `id`: UUID v4 gerado pela aplicação
- `protocolNumber`: Número sequencial único por organização
- `title`: Título da demanda
- `description`: Descrição detalhada
- `status`: Status atual (NEW, ASSIGNED, IN_PROGRESS, etc.)
- `priority`: Prioridade (LOW, MEDIUM, HIGH, URGENT)
- `slaStartAt`: Início do prazo SLA
- `slaDueAt`: Prazo limite SLA
- `slaState`: Estado do SLA (ON_TRACK, AT_RISK, BREACHED)

**Relacionamentos:**

- `contactId`: Referência ao contato (scalar FK)
- `organizationId`: Referência à organização (scalar FK)
- `queueId`: Fila responsável
- `assignedToId`: Usuário responsável (scalar FK)

**Índices:**

- `@@unique([organizationId, protocolNumber])`
- `@@index([organizationId, status])`
- `@@index([organizationId, assignedToId])`
- `@@index([organizationId, slaDueAt])`

### 2. Queue (Fila)

Organiza demandas por categoria, equipe ou tipo de serviço.

**Campos:**

- `name`: Nome da fila
- `description`: Descrição da fila
- `defaultSlaId`: SLA padrão para a fila
- `organizationId`: Organização (scalar FK)

### 3. SLAPlan (Plano de SLA)

Define os prazos e regras de nível de serviço.

**Campos:**

- `name`: Nome do plano SLA
- `responseTimeMinutes`: Tempo para primeira resposta
- `resolutionTimeMinutes`: Tempo para resolução
- `businessHours`: Horário comercial (JSON)
- `organizationId`: Organização (scalar FK)

### 4. Assignment (Atribuição)

Histórico de atribuições de demandas a usuários.

**Campos:**

- `demandId`: Demanda atribuída
- `assignedToId`: Usuário responsável (scalar FK)
- `assignedById`: Usuário que fez a atribuição (scalar FK)
- `assignedAt`: Data/hora da atribuição
- `unassignedAt`: Data/hora da desatribuição
- `reason`: Motivo da atribuição

### 5. StatusHistory (Histórico de Status)

Auditoria de mudanças de status das demandas.

**Campos:**

- `demandId`: Demanda
- `fromStatus`: Status anterior
- `toStatus`: Novo status
- `changedById`: Usuário que alterou (scalar FK)
- `changedAt`: Data/hora da alteração
- `note`: Observação sobre a mudança

### 6. Comment (Comentário)

Comentários e observações nas demandas.

**Campos:**

- `demandId`: Demanda
- `authorId`: Autor (scalar FK)
- `body`: Conteúdo do comentário
- `isInternal`: Se é comentário interno
- `deletedAt`: Soft delete

### 7. Attachment (Anexo)

Arquivos anexados às demandas.

**Campos:**

- `demandId`: Demanda
- `filename`: Nome do arquivo
- `url`: URL do arquivo
- `uploadedById`: Usuário que fez upload (scalar FK)
- `size`: Tamanho em bytes
- `deletedAt`: Soft delete

### 8. Tag & DemandTag

Sistema de etiquetas para categorização.

**Tag:**

- `name`: Nome da etiqueta
- `color`: Cor (hex)
- `organizationId`: Organização (scalar FK)

**DemandTag:**

- Tabela de junção entre Demand e Tag
- `@@unique([demandId, tagId])`

### 9. EscalationRule (Regra de Escalação)

Regras automáticas para demandas que ultrapassam prazos.

**Campos:**

- `queueId`: Fila de origem
- `thresholdMinutes`: Minutos para acionar escalação
- `action`: Tipo de ação
- `targetUserId`: Usuário alvo (scalar FK)
- `targetQueueId`: Fila alvo

## Enums

### DemandStatus

- `NEW`: Nova demanda
- `ASSIGNED`: Atribuída a um usuário
- `IN_PROGRESS`: Em andamento
- `PENDING`: Aguardando
- `RESOLVED`: Resolvida
- `CLOSED`: Fechada
- `CANCELED`: Cancelada
- `ESCALATED`: Escalada

### Priority

- `LOW`: Baixa
- `MEDIUM`: Média
- `HIGH`: Alta
- `URGENT`: Urgente

### SLAState

- `ON_TRACK`: No prazo
- `AT_RISK`: Em risco
- `BREACHED`: Violado

## Características Técnicas

### UUIDs

- Todos os IDs são UUID v4 gerados pela aplicação
- **NÃO** usar `@default(uuid())` no schema
- Sempre gerar UUIDs em código antes das operações

### Multi-tenancy

- Todas as entidades principais incluem `organizationId`
- Sempre filtrar por `organizationId` nas consultas
- Implementar middleware para injetar contexto da organização

### Soft Delete

- `deletedAt` em Demand, Comment e Attachment
- Sempre verificar `deletedAt IS NULL` nas consultas
- Implementar funções de soft delete na aplicação

### Auditoria

- `createdById`, `updatedById` em entidades principais
- `createdAt`, `updatedAt` com timestamps automáticos
- Histórico completo de mudanças de status

## Padrões de Uso

### 1. Criação de Demanda

```typescript
// Gerar UUID v4
const demandId = randomUUID();

// Gerar número de protocolo sequencial
const protocolNumber = await generateProtocolNumber(organizationId);

// Criar demanda
const demand = await prisma.demand.create({
  data: {
    id: demandId,
    protocolNumber,
    title: "Título da demanda",
    // ... outros campos
  },
});
```

### 2. Atribuição de Demanda

```typescript
await prisma.$transaction(async (tx) => {
  // Criar registro de atribuição
  await tx.assignment.create({...})

  // Atualizar demanda
  await tx.demand.update({
    where: { id: demandId },
    data: { assignedToId: userId, status: 'ASSIGNED' }
  })
})
```

### 3. Mudança de Status

```typescript
await prisma.$transaction(async (tx) => {
  // Registrar histórico
  await tx.statusHistory.create({...})

  // Atualizar status
  await tx.demand.update({
    where: { id: demandId },
    data: { status: newStatus }
  })
})
```

## Implementações Necessárias

### 1. Geração de Protocolo

- Implementar tabela `ProtocolCounter` para sequência
- Usar `SELECT ... FOR UPDATE` para concorrência
- Gerar números sequenciais por organização

### 2. Processamento de SLA

- Worker em background para verificar prazos
- Atualizar `slaState` e `slaBreachedAt`
- Acionar regras de escalação

### 3. Sistema de Escalação

- Processo automático para SLAs violados
- Reatribuir demandas conforme regras
- Notificar stakeholders

### 4. Soft Delete

- Funções para marcar como deletado
- Filtros automáticos nas consultas
- Jobs de limpeza para dados antigos

## Considerações de Performance

### Índices

- Índices compostos para consultas comuns
- Índices em campos de SLA para monitoramento
- Índices em status para filtros rápidos

### Consultas

- Sempre incluir `organizationId` nos filtros
- Usar `include` para dados relacionados
- Implementar paginação para listas grandes

### Transações

- Usar transações para operações atômicas
- Evitar transações longas
- Implementar retry logic para falhas

## Segurança

### Multi-tenancy

- Validação de `organizationId` em todas as operações
- Middleware para injetar contexto da organização
- Row-level security se necessário

### Auditoria

- Log de todas as operações críticas
- Histórico imutável de mudanças
- Rastreamento de usuários responsáveis

## Exemplos de Consultas

### Demandas por Fila e Status

```typescript
const demands = await prisma.demand.findMany({
  where: {
    queueId,
    organizationId,
    status: { in: ["NEW", "ASSIGNED"] },
  },
  orderBy: { slaDueAt: "asc" },
});
```

### SLAs Violados

```typescript
const breached = await prisma.demand.findMany({
  where: {
    organizationId,
    slaDueAt: { lt: new Date() },
    slaBreachedAt: null,
    status: { notIn: ["RESOLVED", "CLOSED"] },
  },
});
```

### Histórico de Status

```typescript
const history = await prisma.statusHistory.findMany({
  where: { demandId },
  orderBy: { changedAt: "desc" },
  include: { demand: true },
});
```

## Arquivos de Exemplo

- `examples/demand-workflow-examples.ts`: Exemplos completos de uso
- Scripts de seed com dados de exemplo
- Padrões de implementação recomendados

## Próximos Passos

1. Executar migração do banco de dados
2. Implementar funções de geração de protocolo
3. Configurar workers para SLA e escalação
4. Implementar middleware de multi-tenancy
5. Criar testes para os novos modelos
6. Documentar APIs e endpoints

