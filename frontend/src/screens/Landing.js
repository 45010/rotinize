import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Button, useTheme } from "react-native-paper";

import Container from "../components/Container";
import FeatureItem from "../components/FeatureItem";

const Landing = ({ navigation }) => {
  const theme = useTheme();

  return (
    <Container>
      <View style={styles.landingContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/logo-rotinize-completa.png")}
        />
        <View style={styles.headline}>
          <Text style={styles.title}>
            Organize sua rotina e conquiste seus objetivos
          </Text>
          <View style={styles.features}>
            <FeatureItem
              iconName="repeat"
              iconColor={theme.colors.tertiary}
              text="Crie hábitos duradouros"
              backgroundColor="#F0E9FB"
            />
            <FeatureItem
              iconName="check"
              iconColor={theme.colors.primary}
              text="Gerencie tarefas sem estresse"
              backgroundColor="#DCEEFB"
            />
            <FeatureItem
              iconName="trending-up"
              iconColor={theme.colors.secondary}
              text="Visualize seu progresso"
              backgroundColor="#FFF4E5"
            />
          </View>
        </View>

        <View style={styles.btnContainer}>
          <Button
            mode="contained"
            uppercase={false}
            onPress={() => navigation.navigate("Register")}
          >
            Fazer cadastro
          </Button>
          <Button
            mode="outlined"
            uppercase={false}
            onPress={() => navigation.navigate("Login")}
          >
            Fazer login
          </Button>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  landingContainer: {
    paddingTop: 30,
    flex: 1,
    justifyContent: "space-between",
  },
  logo: {
    alignSelf: "center",
  },
  btnContainer: {
    rowGap: 15,
  },
  headline: {
    padding: 3,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "semi-bold",
    marginBottom: 25,
    fontWeight: "500",
    color: "#444",
  },
});

export default Landing;
