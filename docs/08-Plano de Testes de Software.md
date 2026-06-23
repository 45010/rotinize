# Plano de Testes de Software

 
| **Caso de Teste** 	|CT01 – Cadastrar Nova Conta de Usuário	|
|:---:	|:---:	|
|	Requisito Associado 	| RF-001 - O sistema deve permitir que o usuário crie uma conta. |
| Objetivo do Teste 	| Verificar se um novo usuário consegue se cadastrar na aplicação, fornecendo os dados necessários.|
| Passos 	| Acessar a tela de cadastro. - Preencher todos os campos obrigatórios (e-mail, nome, senha). - Confirmar a senha. - Tentar realizar o cadastro.|
|Critério de Êxito | O cadastro é realizado com sucesso e o usuário é direcionado para a tela inicial ou de login. ||  	|  	|

| Caso de Teste 	| CT02 – Login na Aplicação	|
|:---:	|:---:	|
|Requisito Associado | RF-002 - O sistema deve permitir que o usuário cadastrado faça o login. |
| Objetivo do Teste 	| Verificar se um usuário já cadastrado consegue acessar sua conta com sucesso.|
| Passos 	| Acessar a tela de login. - Inserir um e-mail e senha de uma conta existente. - Clicar no botão de login.|
|Critério de Êxito | O login é efetuado com sucesso e o usuário é direcionado para a página principal da aplicação, visualizando suas tarefas e hábitos.|


| **Caso de Teste** 	| CT03 – Gerenciar Dados da Conta	|
|:---:	|:---:	|
|	Requisito Associado 	| RF-003 - O sistema deve permitir que o usuário gerencie os dados de sua conta.|
| Objetivo do Teste 	| Verificar se o usuário consegue atualizar informações como nome, e-mail e senha.|
| Passos 	| Fazer login na aplicação. - Acessar a seção de perfil ou configurações da conta. - Alterar um ou mais dados (ex: nome de usuário). - Salvar as alterações.|
|Critério de Êxito | Os dados são atualizados com sucesso e as alterações são refletidas na interface do usuário.||  	|  	|

| **Caso de Teste** 	|CT04 – Criação e Gerenciamento de Tarefa Única	|
|:---:	|:---:	|
|	Requisito Associado 	| RF-004 - O sistema deve permitir que o usuário crie, visualize, atualize e exclua uma tarefa de instância única.|
| Objetivo do Teste 	| Validar o ciclo completo de vida de uma tarefa única.|
| Passos 	|Acessar a página de criação de tarefas. - Criar uma nova tarefa com nome e prazo. - Verificar se a tarefa aparece na lista. - Editar a tarefa, alterando seu nome ou prazo. - Excluir a tarefa.|
|Critério de Êxito | A tarefa é criada, visualizada, atualizada e excluída corretamente, e as alterações são exibidas na interface.||  	|  	|

| **Caso de Teste** 	|CT05 – Criação e Gerenciamento de Hábito Recorrente|
|:---:	|:---:	|
|	Requisito Associado 	| RF-005 - O sistema deve permitir que o usuário crie, visualize, atualize e exclua um hábito (tarefa com recorrência especificada).|
| Objetivo do Teste 	| Validar o ciclo completo de vida de um hábito recorrente.|
| Passos 	| Acessar a tela de criação de hábitos. - Criar um novo hábito (ex: "Beber 2L de água") com recorrência diária. - Verificar se o hábito aparece na lista. - Marcar o hábito como concluído para o dia atual. - Excluir o hábito.|
|Critério de Êxito | O hábito é criado, visualizado, atualizado e excluído corretamente, e o status de conclusão é registrado.||  	|  	|

| **Caso de Teste** 	|CT06 – Exibição de Tarefas do Dia em Checklist|
|:---:	|:---:	|
|	Requisito Associado 	| RF-006 - O sistema deve exibir as tarefas programadas para o dia atual, em formato de checklist.|
| Objetivo do Teste 	| Verificar se as tarefas programadas para o dia são exibidas de forma clara e em um formato de lista.|
| Passos 	| Acessar a tela principal. - Criar uma tarefa para o dia atual. - Verificar se a tarefa recém-criada aparece na lista diária.|
|Critério de Êxito |  A tarefa é exibida na tela principal em formato de checklist, junto com as outras tarefas do dia.||  	|  	|

| **Caso de Teste** 	|CT07 – Sistema de Foco com Técnica Pomodoro|
|:---:	|:---:	|
|	Requisito Associado 	| RF-008 - O sistema deve fornecer um timer que alterne entre períodos de foco e de intervalo.|
| Objetivo do Teste 	| Verificar o funcionamento do timer Pomodoro, incluindo a alternância entre foco e pausa.|
| Passos 	| Acessar a ferramenta de foco Pomodoro. - Iniciar um ciclo de foco. - Aguardar o término do período de foco. - Verificar se o timer de pausa é iniciado automaticamente. - Tentar parar ou reiniciar o timer manualmente.|
|Critério de Êxito | O timer funciona conforme o esperado, alternando entre foco e pausa e permitindo o controle manual. ||  	|  	|

| **Caso de Teste** 	|CT08 – Visualização de Progresso Gráfico|
|:---:	|:---:	|
|	Requisito Associado 	| RF-014 - O sistema deve exibir métricas de progresso do usuário em hábitos e tarefas de forma gráfica e intuitiva.|
| Objetivo do Teste 	| Validar se os relatórios visuais de progresso são gerados e exibidos corretamente.|
| Passos 	| Concluir algumas tarefas e hábitos. - Acessar a seção de relatórios ou progresso. - Verificar se os gráficos e métricas de desempenho são exibidos de maneira clara e intuitiva.|
|Critério de Êxito |  Os gráficos de progresso refletem corretamente a atividade do usuário e são fáceis de entender.||  	|  	|

| **Caso de Teste** 	|CT09 – Notificações Inteligentes|
|:---:	|:---:	|
|	Requisito Associado 	| RF-011 - O sistema deve enviar notificações com lembretes de tarefas a realizar.|
| Objetivo do Teste 	| Verificar se as notificações são enviadas para o usuário nos horários programados.|
| Passos 	| Configurar uma tarefa para ser realizada em um horário específico. - Acessar a tela de configuração de notificações (se disponível). - Aguardar o horário da tarefa.|
|Critério de Êxito | Uma notificação é recebida no dispositivo do usuário no horário da tarefa, lembrando-o da atividade.||  	|  	|