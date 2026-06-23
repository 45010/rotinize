import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Icon } from 'react-native-paper';

const FeatureItem = ({ iconName, iconColor, text, backgroundColor }) => {
    return (
      <View style={[styles.featureItem, { backgroundColor }]}>
          <Icon source={iconName} size={22} color={iconColor} />
          <Text style={styles.featureText}>{text}</Text>
      </View>
    )
};

const styles = StyleSheet.create({
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    columnGap: 12,
    padding: 10,
    borderRadius: 8
  },
  featureText: {
    fontSize: 16,
    color: '#333',
  }
});

export default FeatureItem;