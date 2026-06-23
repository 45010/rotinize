import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const IndicatorItem = ({ name, indicatorRate, completed, scheduled, color, backgroundColor }) => {
    return (
      <Card>
        <View style={styles.indicatorContainer}>
            <View style={styles.indicatorInfo}>
                <Text style={styles.indicatorName}>{name}</Text>
                <Text style={[styles.indicatorPercentage, { color} ]}>{indicatorRate.toFixed(1)}%</Text>
            </View>
            <Text style={styles.indicatorDetails}>
            {completed} de {scheduled} objetivos concluídos
            </Text>
            <View style={styles.progressBarBackground}>
                <View style={[
                    styles.progressBarFill, 
                    { width: `${indicatorRate}%` }, 
                    { backgroundColor }]} />
            </View>
        </View>
      </Card>
    )
};

const styles = StyleSheet.create({
  indicatorContainer: {
    padding: 15,
  },
  indicatorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  indicatorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicatorPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicatorDetails: {
    fontSize: 12,
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default IndicatorItem;