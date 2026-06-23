
# Metodologia

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Documentação de Especificação</a></span>

Para garantir uma abordagem estruturada e eficiente no desenvolvimento do projeto, adotamos o framework ágil **Scrum**. Essa metodologia organiza o trabalho em ciclos curtos, chamados sprints, permitindo entregas frequentes e adaptação contínua às necessidades do projeto. O Scrum promove a colaboração entre os membros da equipe, garantindo alinhamento em relação às metas e prioridades. 

Os tópicos a seguir descrevem os **ambientes de trabalho** utilizados, o **controle de versão** adotado e o formato de **gerenciamento de projeto**, incluindo a divisão de papéis, o processo do Scrum e as ferramentas utilizadas. 

## Relação de Ambientes de Trabalho

A aplicação móvel será desenvolvida utilizando o framework [React Native](https://reactnative.dev/). A aplicação será simulada e testada por meio do conjunto de ferramentas open-source [Expo](https://expo.dev/), que facilita o desenvolvimento em React Native e permite a execução prévia do projeto em dispositivos móveis. Para isso, serão utilizadas ferramentas como o sandbox [Expo Go](https://expo.dev/go).

Os artefatos do projeto serão produzidos em diferentes ambientes, representados na tabela a seguir:

| Ambiente | Plataforma | Link de Acesso |
| -------- | ---------- | -------------- |
| Repositório do Código-Fonte | GitHub | https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2025-2-e3-proj-mov-t3-rotinize |
| Documentação do Projeto | GitHub | https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2025-2-e3-proj-mov-t3-rotinize/tree/main/docs |
| Gerenciamento do Projeto | GitHub Project | https://github.com/orgs/ICEI-PUC-Minas-PMV-ADS/projects/2157 |
| Projeto de Interface | Figma | https://www.figma.com/files/team/1472257228900137019/project/444739545/Rotinize?fuid=1472257226431432460 |
| Arquitetura da Solução | Lucid | https://lucid.app/folder/invitations/accept?invitationId=inv_85c7e6cc-d643-4d0a-ac72-dfe68e397833 |
| Hospedagem | A definir | - |

## Controle de Versão

A ferramenta de controle de versão adotada no projeto foi o
[Git](https://git-scm.com/), com hospedagem do repositório no [Github](https://github.com).

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já testada do software
- `dev`: versão de desenvolvimento do software
- `feat/[nome-da-funcionalidade]` : versão de desenvolvimento de uma funcionalidade especifica

A branch `dev` será continuamente atualizada com novas funcionalidades e correções de bugs até que se tenha uma versão estável, que será então mesclada com a `main`. Cada funcionalidade será desenvolvida em uma branch separada, criada a partir da `dev`, com sua respectiva identificação. Cada branch `feat` será mesclada novamente à `dev` quando sua funcionalidade estiver completamente desenvolvida e testada.

Essa forma de trabalho permite que cada membro da equipe trabalhe de modo independente e simultâneo, sem conflitos de código no momento do desenvolvimento. Por permitir o desenvolvimento paralelo de funcionalidades, o fluxo de trabalho descrito também otimiza o tempo.  

O projeto adota algumas características do padrão de commits descrito no [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/). Essa convenção descreve um padrão simples para commits semânticos, que facilita a compreensão do histórico de versões. Os principais tipos de commits a serem utilizados serão:

- `feat`: inclusão de um novo recurso
- `fix`: solução de um bug
- `docs`: mudanças na documentação (não inclui alterações em código)
- `refactor`: refatorações de código que não alterem sua funcionalidade
- `cleanup`: limpeza do código-fonte para maior legibilidade e manutenibilidade
- `remove`: exclusão de arquivos, diretórios ou funcionalidades obsoletas ou não utilizadas

Quanto à gerência de issues, o projeto adota a seguinte convenção para
etiquetas:

- `documentation`: melhorias ou acréscimos à documentação
- `bug`: uma funcionalidade encontra-se com problemas
- `enhancement`: uma funcionalidade precisa ser melhorada
- `feature`: uma nova funcionalidade precisa ser introduzida
- `test`: teste de uma funcionalidade

## Gerenciamento de Projeto

A metodologia ágil escolhida para o desenvolvimento deste projeto foi o SCRUM, pois como citam Amaral, Fleury e Isoni (2019, p. 68), seus benefícios incluem:

> “visão clara dos resultados a entregar; ritmo e disciplina necessários à execução; definição de papéis e responsabilidades dos integrantes do projeto (Scrum Owner, Scrum Master e Team); empoderamento dos membros da equipe de projetos para atingir o desafio; conhecimento distribuído e compartilhado de forma colaborativa; ambiência favorável para crítica às ideias e não às pessoas.”

### Divisão de Papéis

A equipe está organizada da seguinte maneira:
- **Scrum Master**: Isabela
- **Product Owner**: Guilherme
- **Equipe de Desenvolvimento**: Guilherme, Harrison, Isabela, Michelle e Luan
- **Equipe de Design**: Harrison, Michelle

### Processo

Os **elementos do Scrum** serão adotados conforme o cronograma de etapas definido para o semestre acadêmico pela instituição. 

- **Sprint**: cada etapa do semestre equivale a uma sprint.
- **Sprint Planning**: nessa reunião, é definido o trabalho a ser realizado na sprint, de acordo com o cronograma da etapa. As tarefas são organizadas em forma de issues, que são distribuídas entre os membros da equipe. 
- **Daily Scrum**: por ser um contexto acadêmico, não iremos adotar o padrão de reuniões diárias do Scrum, e sim duas reuniões semanais com uma duração maior, sendo uma apenas entre os alunos e outra compartilhada com o tutor do projeto. Nessa reunião, a equipe aborda o progresso e dificuldades com as tarefas. Qualquer comunicação extra necessária é realizada por meio do WhatsApp.
- **Product Backlog**: inclui todas as atividades a entregar no semestre.
- **Sprint Backlog**: inclui as atividades a entregar no semestre e eventuais correções de etapas anteriores.
- **Product Increment**: o entregável produzido a cada sprint, que é enviado em formato `.zip` no portal acadêmico da instituição.

Para organização das tarefas, está sendo utilizado o **GitHub Projects**. O processo é estruturado da seguinte maneira:
- **To-Do**: tarefas ainda não iniciadas.
- **In Progress**: tarefas em andamento.
- **Done**: tarefas concluídas.

As tarefas foram estruturadas em **diferentes views** do GitHub Projects para facilitar a organização e visualização do progresso:
- **Backlog**: quadro Kanban que inclui todas as atividades de todo o semestre.
- **Etapas**: cada uma das cinco etapas possui sua própria view em formato de quadro Kanban, que contém o backlog da sprint e o progresso de suas tarefas. Cada view é filtrada de acordo com as milestones definidas para cada etapa.

### Ferramentas

As ferramentas empregadas no projeto são:

- **GitHub**: plataforma utilizada para armazenar o repositório de código-fonte e de documentação.
- **GitHub Project**: utilizado como ferramenta para organizar e acompanhar as tarefas do projeto, por meio de um quadro Kanban.
- **Microsoft Teams**: utilizado como ferramenta de comunicação oficial para realização das reuniões em grupo semanais.
- **WhatsApp**: utilizado como ferramenta para comunicar de forma rápida e imediata as informações necessárias entre as reuniões de equipe.
- **Figma**: utilizado para o design da interface, prototipagem de telas e construção do template padrão da aplicação.
- **Lucid**: utilizado para construção dos diagramas da arquitetura da solução.
- **Visual Studio Code**: utilizado como ferramenta de edição de código.
- **Expo**: utilizado para facilitar o desenvolvimento nativo, bem como testar prévias da aplicação em dispositivos móveis.
- **Azure**: Plataforma utilizada para hospedagem da aplicação

As ferramentas descritas foram escolhidas por permitirem boa integração entre si e com as tecnologias utilizadas para desenvolvimento da aplicação, além de estarem disponíveis para uso gratuito ou por meio da licença de estudante oferecida pela PUC Minas.