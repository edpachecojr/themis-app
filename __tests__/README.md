# Testes Unitários - Themis App

Este diretório contém testes unitários abrangentes para todos os repositórios, serviços e actions da aplicação Themis.

## Estrutura dos Testes

### Repositórios (`lib/db/`)

- **`contact-repository.test.ts`** - Testes para o ContactRepository
- **`organization-repository.test.ts`** - Testes para o OrganizationRepository

### Serviços (`services/`)

- **`contact-service.test.ts`** - Testes para o ContactService
- **`organization-service.test.ts`** - Testes para o OrganizationService

### Actions (`actions/`)

- **`contact/`**
  - `add.test.ts` - Testes para adicionar contatos
  - `get-all.test.ts` - Testes para buscar todos os contatos
  - `get.test.ts` - Testes para buscar contato por ID
  - `update.test.ts` - Testes para atualizar contatos
  - `delete.test.ts` - Testes para deletar contatos
- **`organization/`**
  - `add.test.ts` - Testes para adicionar organizações
  - `get-all.test.ts` - Testes para buscar todas as organizações
  - `get.test.ts` - Testes para buscar organização por ID
  - `update.test.ts` - Testes para atualizar organizações
  - `delete.test.ts` - Testes para deletar organizações
- **`dashboard/`**
  - `get-stats.test.ts` - Testes para buscar estatísticas do dashboard

## Cobertura dos Testes

### Cenários de Sucesso Testados

#### Repositórios

- ✅ Criação de registros
- ✅ Busca por ID
- ✅ Busca de todos os registros
- ✅ Busca paginada
- ✅ Busca paginada com filtro de busca
- ✅ Atualização de registros
- ✅ Exclusão lógica (soft delete)
- ✅ Verificação de propriedade/posse
- ✅ Conversão de tipos

#### Serviços

- ✅ Operações CRUD completas
- ✅ Isolamento por organização/usuário
- ✅ Validação de autenticação
- ✅ Tratamento de dados antes do repositório
- ✅ Geração de UUIDs
- ✅ Timestamps automáticos

#### Actions

- ✅ Validação de schemas de entrada
- ✅ Chamadas para serviços
- ✅ Revalidação de cache (revalidatePath)
- ✅ Tratamento de respostas
- ✅ Tratamento de erros
- ✅ Diferentes tipos de dados de entrada

## Como Executar os Testes

### Executar Todos os Testes

```bash
pnpm test
```

### Executar Testes com Interface Visual

```bash
pnpm test:ui
```

### Executar Testes Uma Vez

```bash
pnpm test:run
```

### Executar Testes com Cobertura

```bash
pnpm test:coverage
```

### Executar Testes Específicos

```bash
# Testar apenas repositórios
pnpm test lib/db

# Testar apenas serviços
pnpm test services

# Testar apenas actions
pnpm test actions

# Testar arquivo específico
pnpm test contact-repository.test.ts
```

## Configuração dos Testes

### Setup (`setup.ts`)

- Mocks globais para Next.js, Prisma, autenticação
- Configuração de ambiente de teste
- Mocks para funções externas

### Mocks Utilizados

- **Prisma**: Mock completo do cliente Prisma
- **Autenticação**: Mock das funções de isolamento
- **UUID**: Mock para geração de IDs únicos
- **Next.js**: Mock para revalidatePath
- **Next Safe Action**: Mock para actionClient

## Padrões de Teste

### Estrutura dos Testes

```typescript
describe('Nome da Classe/Action', () => {
  let instance: ClassName;

  beforeEach(() => {
    instance = new ClassName();
    vi.clearAllMocks();
  });

  describe('método', () => {
    it('should do something successfully', async () => {
      // Arrange
      const input = { ... };
      const expectedOutput = { ... };

      // Act
      const result = await instance.method(input);

      // Assert
      expect(result).toEqual(expectedOutput);
    });
  });
});
```

### Assertions Comuns

- Verificação de chamadas de métodos mockados
- Validação de parâmetros passados
- Verificação de retornos esperados
- Validação de side effects (revalidatePath, etc.)

### Casos de Teste

- ✅ Cenários de sucesso
- ✅ Dados válidos com diferentes formatos
- ✅ Tratamento de erros
- ✅ Validação de schemas
- ✅ Edge cases (dados vazios, caracteres especiais, etc.)

## Manutenção dos Testes

### Adicionando Novos Testes

1. Crie o arquivo de teste na estrutura apropriada
2. Siga o padrão de nomenclatura existente
3. Use os mocks já configurados
4. Adicione casos de teste para todos os cenários de sucesso
5. Execute os testes para garantir que passem

### Atualizando Testes Existentes

1. Execute os testes para identificar falhas
2. Atualize os mocks conforme necessário
3. Ajuste as assertions para refletir mudanças na implementação
4. Execute novamente para validar as correções

### Boas Práticas

- Mantenha os testes focados e específicos
- Use nomes descritivos para os testes
- Evite dependências entre testes
- Limpe os mocks antes de cada teste
- Teste tanto cenários de sucesso quanto de falha
- Valide todos os aspectos da funcionalidade

## Dependências de Teste

- **Vitest**: Framework de teste
- **@testing-library/jest-dom**: Matchers adicionais para DOM
- **jsdom**: Ambiente de teste para DOM
- **@vitest/ui**: Interface visual para testes
- **@vitest/coverage-v8**: Cobertura de código

## Troubleshooting

### Problemas Comuns

1. **Mocks não funcionando**: Verifique se os imports estão corretos
2. **Testes falhando**: Execute `pnpm test:run` para ver erros detalhados
3. **Cobertura baixa**: Adicione testes para métodos não cobertos
4. **Timeout**: Verifique se há operações assíncronas não aguardadas

### Logs de Debug

```bash
# Executar com logs detalhados
pnpm test --reporter=verbose

# Executar com logs de console
pnpm test --reporter=verbose --logConsole
```
