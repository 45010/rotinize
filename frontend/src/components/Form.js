import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

const Form = ({ children, secondaryActionText, secondaryActionLink, secondaryAction, onLogoPress, onSubmit, loading = false }) => {
    const theme = useTheme();

    return (
        <View style={styles.formContainer}>
            <View style={styles.form}>
              <TouchableOpacity onPress={onLogoPress}>
                <Image style={styles.logo} source={require('../../assets/logo-rotinize-completa.png')} />
              </TouchableOpacity>
              <Text style={styles.headline}>
                Preencha as informações abaixo
              </Text>
              {children}
            </View>

            <View style={styles.actionsContainer}>
              <Button
                mode="contained"
                uppercase={false}
                onPress={onSubmit}
                style={styles.button}
                loading={loading}
                disabled={loading}
                >
                  Concluir
              </Button>

              <TouchableOpacity style={styles.secondaryActionContainer} onPress={secondaryAction}>
                <Text>
                  {secondaryActionText}
                </Text>
                <Text style={{ color: theme.colors.primary }}>
                  {secondaryActionLink}
                </Text>
              </TouchableOpacity>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
 formContainer:{
    flex:1,
    justifyContent:'space-between',
    rowGap: 30
  },
  logo:{
    alignSelf: 'center'
  },
  headline:{
    fontSize: 20,
    textAlign:'center'
  },
  form:{
    rowGap: 10
  },
  actionsContainer:{
    rowGap: 8
  },
  secondaryActionContainer:{
    flexDirection: 'row',
    gap:5,
    justifyContent:'center',
  }
});

export default Form;