import React from 'react';
import { Chip } from 'react-native-paper';

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

const getCategoryColor = (categoryName) => {
  const categoryColors = {
    'Autocuidado': { background: '#D6C5F0', text: '#5E2DB2' },
    'Saúde': { background: '#A8D4F4', text: '#2E77B3' },
    'Exercício físico': { background: '#5EABE5', text: '#FFFFFF' },
    'Estudos': { background: '#FCC97D', text: '#C26D00' },
    'Lazer': { background: '#9B6EE5', text: '#FFFFFF' },
    'Trabalho': { background: '#2E77B3', text: '#FFFFFF' },
    'Alimentação': { background: '#FF9901', text: '#FFFFFF' },
    'Finanças': { background: '#FF7301', text: '#FFFFFF' },
    'Casa': { background: '#5E2DB2', text: '#FFFFFF' },
    'Social': { background: '#00C247', text: '#FFFFFF' },
    'Outros': { background: '#D8D8D8', text: '#666666' },
  };

  return categoryColors[categoryName] || categoryColors['Outros'];
};

const CategoryChip = ({ 
  categoryId, 
  mode = 'flat', 
  style 
}) => {
  const categoryName = CATEGORY_MAP[categoryId] || 'Outros';
  const colors = getCategoryColor(categoryName);

  return (
    <Chip
      mode={mode}
      compact
      style={[
        { 
          backgroundColor: colors.background, 
          alignSelf: 'flex-start',
          borderWidth: mode === 'outlined' ? 1 : 0,
          borderColor: colors.text
        }, 
        style
      ]}
      textStyle={{
        color: colors.text,
        fontWeight: '600',
        fontSize: 11,
      }}
    >
      {categoryName}
    </Chip>
  );
};

export default CategoryChip;