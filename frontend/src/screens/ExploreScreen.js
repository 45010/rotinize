import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Searchbar, Text, Card, Chip, useTheme, IconButton } from 'react-native-paper';
import AppHeader from '../components/AppHeader';

const CATEGORY_MAP = {
  0: "Alimentação",
  1: "Exercício físico",
  2: "Estudos",
  3: "Trabalho",
  4: "Finanças",
  5: "Casa",
  6: "Saúde",
  7: "Autocuidado",
  8: "Social",
  9: "Lazer",
  10: "Outros",
};

const SUGGESTION_HABITS = [
  { id: '1', title: 'Meditar', description: 'Pratique mindfulness diariamente', category: 7 },
  { id: '2', title: 'Beber água', description: 'Mantenha-se hidratado', category: 6 },
  { id: '3', title: 'Cozinhar', description: 'Prepare refeições saudáveis', category: 0 },
  { id: '4', title: 'Academia', description: 'Treine com regularidade', category: 1 },
  { id: '5', title: 'Ler livros', description: 'Adquira novos conhecimentos', category: 2 },
  { id: '6', title: 'Planejar dia', description: 'Organize suas tarefas', category: 3 },
  { id: '7', title: 'Ligar para a família', description: 'Converse com familiares', category: 8 },
  { id: '8', title: 'Dormir 8h', description: 'Tenha uma boa noite de sono', category: 6 },
  { id: '9', title: 'Controlar gastos', description: 'Registre suas despesas', category: 4 },
  { id: '10', title: 'Tocar instrumento', description: 'Pratique música', category: 9 },
  { id: '11', title: 'Caminhada', description: 'Caminhe por alguns minutos', category: 1 },
  { id: '12', title: 'Arrumar cama', description: 'Organize sua cama ao acordar', category: 5 },
  { id: '13', title: 'Gratidão', description: 'Liste 3 coisas pelas quais é grato', category: 7 },
  { id: '14', title: 'Comer frutas', description: 'Consuma algumas porções de frutas', category: 0 },
  { id: '15', title: 'Estudar', description: 'Dedique tempo ao aprendizado', category: 2 },
  { id: '16', title: 'Poupar', description: 'Guarde parte do salário', category: 4 },
  { id: '17', title: 'Alongamento', description: 'Cuide da flexibilidade', category: 1 },
  { id: '18', title: 'Desenhar', description: 'Desenvolva criatividade', category: 9 },
  { id: '19', title: 'Tomar remédio', description: 'Tome medicação no horário', category: 6 },
  { id: '20', title: 'Revisar emails', description: 'Mantenha inbox organizado', category: 3 },
  { id: '21', title: 'Encontrar amigos', description: 'Socialize regularmente', category: 8 },
  { id: '22', title: 'Desconectar', description: 'Fique longe das telas', category: 7 },
  { id: '23', title: 'Lavar louça', description: 'Mantenha cozinha limpa', category: 5 },
  { id: '24', title: 'Aprender idioma', description: 'Pratique um novo idioma', category: 2 },
  { id: '25', title: 'Correr', description: 'Pratique corrida', category: 1 },
  { id: '26', title: 'Café da manhã', description: 'Tome um café nutritivo', category: 0 },
  { id: '27', title: 'Skincare', description: 'Cuide da sua pele', category: 7 },
  { id: '28', title: 'Investir', description: 'Aplique seu dinheiro', category: 4 },
  { id: '29', title: 'Jogar', description: 'Divirta-se com jogos', category: 9 },
  { id: '30', title: 'Yoga', description: 'Pratique posturas e respiração', category: 1 },
  { id: '31', title: 'Podcast', description: 'Ouça conteúdo educativo', category: 2 },
  { id: '32', title: 'Organizar mesa', description: 'Limpe seu espaço de trabalho', category: 3 },
  { id: '33', title: 'Check-up', description: 'Consulte médico regularmente', category: 6 },
  { id: '34', title: 'Pomodoro', description: 'Trabalhe com foco', category: 3 },
  { id: '35', title: 'Mensagem para um amigo', description: 'Envie mensagens para um amigo', category: 8 },
  { id: '36', title: 'Vitaminas', description: 'Prepare smoothies naturais', category: 0 },
  { id: '37', title: 'Banho relaxante', description: 'Reserve tempo para você', category: 7 },
  { id: '38', title: 'Ciclismo', description: 'Pedale regularmente', category: 1 },
  { id: '39', title: 'Curso online', description: 'Assista aulas online', category: 2 },
  { id: '40', title: 'Assistir filme', description: 'Relaxe com um filme', category: 9 },
  { id: '41', title: 'Revisar contas', description: 'Analise extratos bancários', category: 4 },
  { id: '42', title: 'Lavar roupa', description: 'Cuide das suas roupas', category: 5 },
  { id: '43', title: 'Protetor solar', description: 'Proteja sua pele', category: 6 },
  { id: '44', title: 'Reunião diária', description: 'Alinhe com a equipe', category: 3 },
  { id: '45', title: 'Voluntariado', description: 'Ajude sua comunidade', category: 8 },
  { id: '46', title: 'Journaling', description: 'Escreva seus pensamentos', category: 7 },
  { id: '47', title: 'Reduzir açúcar', description: 'Diminua doces e refrigerantes', category: 0 },
  { id: '48', title: 'Natação', description: 'Nade semanalmente', category: 1 },
  { id: '49', title: 'Fazer resumos', description: 'Revise o que aprendeu', category: 2 },
  { id: '50', title: 'Fotografia', description: 'Capture momentos especiais', category: 9 },
  { id: '51', title: 'Regar plantas', description: 'Cuide das suas plantas', category: 5 },
  { id: '52', title: 'Estudar finanças', description: 'Aprenda educação financeira', category: 4 },
  { id: '53', title: 'Postura', description: 'Mantenha postura correta', category: 6 },
  { id: '54', title: 'Aprender skill', description: 'Desenvolva nova habilidade', category: 3 },
  { id: '55', title: 'Networking', description: 'Expanda sua rede', category: 8 },
  { id: '56', title: 'Respiração', description: 'Pratique exercícios respiratórios', category: 7 },
  { id: '57', title: 'Jardinagem', description: 'Cultive plantas e flores', category: 9 },
  { id: '58', title: 'Beber chá', description: 'Tome chá verde ou de ervas', category: 6 },
  { id: '59', title: 'Evitar fast food', description: 'Reduza comida processada', category: 0 },
  { id: '60', title: 'Alongar ao acordar', description: 'Comece o dia com alongamento', category: 1 },
  { id: '61', title: 'Ler notícias', description: 'Mantenha-se informado', category: 2 },
  { id: '62', title: 'Networking online', description: 'Conecte-se no LinkedIn', category: 3 },
  { id: '63', title: 'Economizar energia', description: 'Apague luzes desnecessárias', category: 5 },
  { id: '64', title: 'Checkup dental', description: 'Visite o dentista regularmente', category: 6 },
  { id: '65', title: 'Tomar banho frio', description: 'Desperte com água gelada', category: 7 },
  { id: '66', title: 'Ligar para pais', description: 'Converse com seus pais', category: 8 },
  { id: '67', title: 'Assistir série', description: 'Relaxe com uma série', category: 9 },
  { id: '68', title: 'Revisar orçamento', description: 'Acompanhe suas finanças', category: 4 },
  { id: '69', title: 'Comer salada', description: 'Inclua vegetais nas refeições', category: 0 },
  { id: '70', title: 'Dança', description: 'Movimente-se ao som de música', category: 1 },
  { id: '71', title: 'Fazer curso', description: 'Invista em aprendizado', category: 2 },
  { id: '72', title: 'Atualizar currículo', description: 'Mantenha CV atualizado', category: 3 },
  { id: '73', title: 'Guardar dinheiro', description: 'Separe valor para emergências', category: 4 },
  { id: '74', title: 'Organizar armário', description: 'Arrume suas roupas', category: 5 },
  { id: '75', title: 'Medir pressão', description: 'Monitore sua pressão arterial', category: 6 },
  { id: '76', title: 'Afirmações positivas', description: 'Pratique autoafirmação', category: 7 },
  { id: '77', title: 'Jantar com amigos', description: 'Organize encontros', category: 8 },
  { id: '78', title: 'Pescar', description: 'Relaxe pescando', category: 9 },
  { id: '79', title: 'Preparar marmita', description: 'Leve comida de casa', category: 0 },
  { id: '80', title: 'Pilates', description: 'Fortaleça o core', category: 1 },
  { id: '81', title: 'Assistir documentário', description: 'Aprenda com documentários', category: 2 },
  { id: '82', title: 'Fazer to-do list', description: 'Liste tarefas do dia', category: 3 },
  { id: '83', title: 'Pagar contas', description: 'Quite contas em dia', category: 4 },
  { id: '84', title: 'Limpar geladeira', description: 'Organize a geladeira', category: 5 },
  { id: '85', title: 'Tomar vitaminas', description: 'Suplementação diária', category: 6 },
  { id: '86', title: 'Massagem', description: 'Relaxe os músculos', category: 7 },
  { id: '87', title: 'Videochamada', description: 'Conecte-se virtualmente', category: 8 },
  { id: '88', title: 'Pintar', description: 'Expresse-se através da arte', category: 9 },
  { id: '89', title: 'Evitar açúcar', description: 'Reduza consumo de açúcar', category: 0 },
  { id: '90', title: 'Treino HIIT', description: 'Exercício de alta intensidade', category: 1 },
  { id: '91', title: 'Praticar inglês', description: 'Melhore seu inglês', category: 2 },
  { id: '92', title: 'Fazer pausas', description: 'Descanse durante trabalho', category: 3 },
  { id: '93', title: 'Investir em ações', description: 'Diversifique investimentos', category: 4 },
  { id: '94', title: 'Aspirar casa', description: 'Limpe o chão', category: 5 },
  { id: '95', title: 'Dormir cedo', description: 'Vá para cama no horário', category: 6 },
  { id: '96', title: 'Unhas e cabelo', description: 'Cuide da aparência', category: 7 },
  { id: '97', title: 'Evento social', description: 'Participe de eventos', category: 8 },
  { id: '98', title: 'Jogos de tabuleiro', description: 'Divirta-se em grupo', category: 9 },
  { id: '99', title: 'Suco natural', description: 'Prepare sucos frescos', category: 0 },
  { id: '100', title: 'Pratique luta', description: 'Treine golpes e defesa', category: 1 },
];

import { useNavigation } from '@react-navigation/native';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuggestionHabits = searchQuery.trim() === '' 
    ? SUGGESTION_HABITS 
    : SUGGESTION_HABITS.filter(habit => {
        const categoryName = CATEGORY_MAP[habit.category] || '';
        return habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               habit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
               categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      });

  const getCategoryColor = (categoryId) => {
    const categoryName = CATEGORY_MAP[categoryId] || 'Outros';
    
    const categoryColors = {
      'Autocuidado': {
        background: '#D6C5F0', 
        text: '#5E2DB2'
      },
      'Saúde': {
        background: '#A8D4F4', 
        text: '#2E77B3'
      },
      'Exercício físico': {
        background: '#5EABE5', 
        text: '#FFFFFF'
      },
      'Estudos': {
        background: '#FCC97D', 
        text: '#C26D00'
      },
      'Lazer': {
        background: '#9B6EE5', 
        text: '#FFFFFF'
      },
      'Trabalho': {
        background: '#2E77B3', 
        text: '#FFFFFF'
      },
      'Alimentação': {
        background: '#FF9901', 
        text: '#FFFFFF'
      },
      'Finanças': {
        background: '#FF7301', 
        text: '#FFFFFF'
      },
      'Casa': {
        background: '#5E2DB2', 
        text: '#FFFFFF'
      },
      'Social': {
        background: '#00C247', 
        text: '#FFFFFF'
      },
      'Outros': {
        background: '#D8D8D8', 
        text: '#666666'
      },
    };
    
    return categoryColors[categoryName] || {
      background: '#D8D8D8',
      text: '#666666'
    };
  };

  const handleSuggestionHabit = (habit) => {
    navigation.navigate('CreateHabit', {
      prefilledData: {
        name: habit.title,
        description: habit.description,
        category: habit.category,
        isPartial: true,
      }
    });
  };
     
  const renderSuggestionHabit = ({ item }) => {
    const colors = getCategoryColor(item.category);
    
    return (
      <View style={{ width: '48%', marginBottom: 12 }}>
        <Card
          mode="elevated"
          style={{ 
            borderRadius: 16,
            aspectRatio: 1,
          }}
        >
          <Card.Content style={{ height: '100%', justifyContent: 'space-between', paddingTop: 16 }}>
            <View>
              <Text variant="titleMedium" style={{ fontWeight: '600', marginBottom: 6 }}>
                {item.title}
              </Text>
              <Text variant="bodySmall" style={{ opacity: 0.7 }} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip 
                mode="flat"
                compact 
                style={{ 
                  alignSelf: 'flex-start',
                  backgroundColor: colors.background
                }}
                textStyle={{ 
                  color: colors.text,
                  fontWeight: '600',
                  fontSize: 11
                }}
              >
                {CATEGORY_MAP[item.category]}
              </Chip>
              <IconButton
                icon="plus"
                size={20}
                iconColor={theme.colors.primary}
                style={{ 
                  margin: 0,
                  backgroundColor: theme.colors.primaryContainer,
                }}
                onPress={() => handleSuggestionHabit(item)}
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader />

      <View style={{ flex: 1, padding: 16 }}>
        <Text 
          variant="headlineSmall" 
          style={{ 
            fontWeight: '600', 
            textAlign: 'center',
            marginVertical: 16 
          }}
        >
          Explore novos hábitos
        </Text>

        <Searchbar
          placeholder="Pesquise novos hábitos"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ 
            marginBottom: 16,
            borderRadius: 12,
            elevation: 0,
            backgroundColor: '#F8F6F7'
          }}
          iconColor={theme.colors.onSurfaceVariant}
          inputStyle={{ fontSize: 14 }}
        />

        {filteredSuggestionHabits.length > 0 ? (
          <FlatList
            data={filteredSuggestionHabits}
            keyExtractor={(item) => item.id}
            renderItem={renderSuggestionHabit}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text variant="bodyLarge" style={{ opacity: 0.6 }}>
              Nenhuma sugestão encontrada
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}