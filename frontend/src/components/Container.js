import React from 'react';
import {StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Container = ({children}) => {
  return <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
    {children}
    </SafeAreaView>
};

const styles = StyleSheet.create({
 container:{
    flex:1,
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    paddingBottom: 10
  },
});

export default Container;