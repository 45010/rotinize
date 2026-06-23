# Programação de Funcionalidades

Nesta seção, detalhamos a implementação do sistema com base nos requisitos funcionais e não funcionais definidos na documentação. Para cada funcionalidade, apresentamos a relação com os requisitos atendidos, os artefatos de código, as estruturas de dados empregadas e instruções para sua verificação.

|ID| Descrição do Requisito | Artefatos produzidos - Aluno(s) responsável(is) |
| --- | --- | --- |
|RF-001| O sistema deve permitir que o usuário crie uma conta. | Tela de Cadastro - Guilherme e Isabela <br> API de Autenticação - Guilherme e Luan  | 
|RF-002| O sistema deve permitir que o usuário cadastrado faça o login. | Tela de Login - Guilherme e Isabela <br> API de Autenticação - Guilherme e Luan |
|RF-003| O sistema deve permitir que o usuário gerencie os dados de sua conta. | Tela de Configurações - Michelle e Guilherme <br> API de Usuários - Guilherme |
|RF-004| O sistema deve permitir que o usuário crie, visualize, atualize e exclua uma tarefa de instância única. | Tela de Tarefas - Michelle e Isabela <br> API de Tarefas - Isabela |
|RF-005| O sistema deve permitir que o usuário crie, visualize, atualize e exclua um hábito (tarefa com recorrência especificada). | Telas: Hábitos, Criar Hábito, Detalhes do Hábito - Isabela <br> Tela Explorar Hábitos - Harrison <br> API de Hábitos - Isabela |
|RF-006| O sistema deve exibir as tarefas programadas para o dia atual, em formato de checklist. | Tela Hoje - Isabela <br> API de Dashboard - Isabela |
|RF-007| O sistema deve permitir que o usuário marque as tarefas como concluídas. | Tela de Tarefas - Michelle e Isabela <br> Tela Hoje - Isabela <br> API de Tarefas - Isabela   |
|RF-008| O sistema deve fornecer um timer que alterne entre períodos de foco e de intervalo. | Tela Pomodoro - Guilherme <br> API Pomodoro - Guilherme |
|RF-009| O sistema deve permitir que o usuário configure a duração dos períodos de foco e de intervalo do timer. | Tela Pomodoro - Guilherme <br> API Pomodoro - Guilherme |
|RF-010| O sistema deve permitir que o usuário visualize hábitos e tarefas de acordo com categorias. | Tela de Tarefas - Michelle e Isabela <br> Tela Hábitos - Isabela <br> API de Hábitos - Isabela |
|RF-011| O sistema deve enviar notificações com lembretes de tarefas a realizar. | API de notificações - Guilherme |
|RF-012| O sistema deve permitir que o usuário configure quais notificações gostaria de receber, em qual horário e com que frequência. | API de notificações - Guilherme |
|RF-013| O sistema deve exibir métricas de progresso do usuário em hábitos e tarefas de forma gráfica e intuitiva. | Tela de Indicadores de Desempenho - Luan |

Navegação entre telas - Harrison

## Gerenciamento de Usuários 

Esta funcionalidade abrange a criação, login e gerenciamento de contas de usuário.

Requisitos Atendidos:

RF-001: O sistema deve permitir que o usuário crie uma conta.

RF-002: O sistema deve permitir que o usuário cadastrado faça o login.

RF-003: O sistema deve permitir que o usuário gerencie os dados de sua conta.

RNF-003: As senhas de usuários devem ser criptografadas antes do armazenamento.

RNF-005: Os dados do usuário devem ser salvos localmente, de forma que não sejam perdidos ao reiniciar o aplicativo.

## Estruturas de Dados:

Os dados do usuário (nome de usuário, e-mail, senha criptografada) são armazenados localmente no dispositivo usando o AsyncStorage do React Native. Para garantir a segurança, as senhas são criptografadas com um algoritmo de hash (ex: bcrypt).

O estado de autenticação (usuário logado) é gerenciado globalmente na aplicação através de um Context API ou Redux.

 Instruções para Verificação:

Acesse o aplicativo e clique na opção "Criar conta".

Preencha o formulário e finalize o cadastro. Uma mensagem de sucesso deve ser exibida.

Na tela de login, insira as credenciais da conta recém-criada. O login deve ser efetuado com sucesso.

Navegue até a tela de perfil e tente alterar o nome do usuário. As alterações devem ser salvas e refletidas ao reiniciar o aplicativo.


## Gerenciamento de Hábitos e Tarefas
Esta funcionalidade permite que o usuário crie, visualize, atualize, exclua e marque como concluídas suas tarefas diárias e hábitos recorrentes.

Requisitos Atendidos:

RF-004: O sistema deve permitir que o usuário crie, visualize, atualize e exclua uma tarefa de instância única.

RF-005: O sistema deve permitir que o usuário crie, visualize, atualize e exclua um hábito (tarefa com recorrência especificada).

RF-006: O sistema deve exibir as tarefas programadas para o dia atual, em formato de checklist.

RF-007: O sistema deve permitir que o usuário marque as tarefas como concluídas.

RF-010: O sistema deve permitir que o usuário visualize hábitos e tarefas de acordo com categorias.

## Estruturas de Dados:

Tarefas e Hábitos: São armazenados em arrays de objetos JSON, onde cada objeto representa um item com as propriedades id, nome, descricao, data, recorrencia e status.

O armazenamento local utiliza o AsyncStorage para persistência dos dados entre as sessões.

Instruções para Verificação:

A partir da tela inicial, adicione uma nova tarefa com prazo para o dia atual. Verifique se ela aparece no checklist.

Crie um novo hábito com recorrência diária. Marque-o como concluído e observe a mudança de estado.

Tente editar e excluir a tarefa e o hábito criados. As alterações devem ser salvas e refletidas na interface.

## Sistema de Foco com Pomodoro

Este módulo implementa a técnica Pomodoro para auxiliar na concentração, com recursos de gamificação.

Requisitos Atendidos:

RF-008: O sistema deve fornecer um timer que alterne entre períodos de foco e de intervalo.

RF-009: O sistema deve permitir que o usuário configure a duração dos períodos de foco e de intervalo do timer.

RF-013: O sistema deve conter um sistema de níveis, em que o usuário ganha pontos por completar tarefas e manter a consistência em hábitos e sobe de nível quando atinge determinada quantidade de pontos.

 ## Estruturas de Dados:

O estado do timer (tempo restante, estado atual - foco ou pausa) é gerenciado pelo useState do React.

Os pontos de gamificação do usuário são armazenados em um objeto JSON em AsyncStorage e atualizados a cada sessão de foco concluída.

Instruções para Verificação:

Acesse a tela de foco. Inicie o timer de 25 minutos.

Após 25 minutos, o timer deve pausar automaticamente e iniciar o tempo de descanso de 5 minutos.

Verifique se os pontos de gamificação são atualizados após a conclusão de uma sessão de foco.

## Relatórios e Notificações

Esta funcionalidade fornece ao usuário a visualização de seu progresso e o recebimento de lembretes para manter a consistência.

Requisitos Atendidos:

RF-013: O sistema deve exibir métricas de progresso do usuário em hábitos e tarefas de forma gráfica e intuitiva.

## Estruturas de Dados:

Os dados de progresso são extraídos dos registros de tarefas e hábitos (objetos JSON em AsyncStorage).

Instruções para Verificação:

Marque algumas tarefas e hábitos como concluídos ao longo de alguns dias.

Acesse a tela de relatórios e verifique se o progresso semanal e mensal é exibido corretamente nos gráficos.

Agende uma notificação para um horário futuro e verifique se ela é recebida no dispositivo.
