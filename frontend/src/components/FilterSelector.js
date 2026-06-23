import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, useTheme, IconButton } from "react-native-paper";
import CategoryChip from "./CategoryChip";

/**
 * Componente unificado para seleção de filtros.
 * @param {Array} categories - Array de objetos { label: string, value: any }
 * @param {any} selectedCategory - O valor da categoria selecionada (ou null)
 * @param {Function} onSelect - Função chamada ao selecionar (retorna o value ou null)
 * @param {boolean} isArchived - Estado atual do filtro de arquivados/concluídos
 * @param {Function} onToggleArchived - Função para alternar o estado de arquivados
 */
export default function FilterSelector({
  categories,
  selectedCategory,
  onSelect,
  isArchived,
  onToggleArchived,
}) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Lado Esquerdo: Scroll de Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Opção "Todas" */}
        <Chip
          mode={selectedCategory === null ? "flat" : "outlined"}
          selected={selectedCategory === null}
          onPress={() => onSelect(null)}
          style={styles.chip}
          textStyle={styles.chipText}
          showSelectedOverlay={true}
        >
          Todas
        </Chip>

        {/* Lista de Categorias */}
        {categories.map((item) => {
          const isSelected = selectedCategory === parseInt(item.value);
          return (
            <Chip
              key={item.value}
              mode={isSelected ? "flat" : "outlined"}
              selected={isSelected}
              onPress={() => onSelect(parseInt(item.value))}
              style={[
                styles.chip,
                isSelected && { backgroundColor: theme.colors.secondaryContainer },
              ]}
              textStyle={[
                styles.chipText,
                isSelected && { color: theme.colors.onSecondaryContainer },
              ]}
              showSelectedOverlay={true}
            >
              {item.label}
            </Chip>
          );
        })}
      </ScrollView>

      {/* Separador Visual e Botão de Arquivo (Se a função for fornecida) */}
      {onToggleArchived && (
        <View style={styles.archiveSection}>
          <View style={[styles.verticalDivider, { backgroundColor: theme.colors.outlineVariant }]} />
          
          <IconButton
            icon={isArchived ? "archive" : "archive-outline"}
            selected={isArchived}
            onPress={onToggleArchived}
            iconColor={isArchived ? theme.colors.primary : theme.colors.onSurfaceVariant}
            containerColor={isArchived ? theme.colors.secondaryContainer : undefined}
            size={20}
            style={styles.archiveButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingRight: 16,
    gap: 8,
  },
  chip: {
    height: 26,
  },
  chipText: {
    fontSize: 13, 
    marginVertical: 0,
  },
  archiveSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4, 
    paddingRight: 12,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    marginRight: 4,
  },
  archiveButton: {
    margin: 0, 
  }
});