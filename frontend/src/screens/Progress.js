import React from "react";
import { ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, Card, IconButton } from "react-native-paper";

import Container from "../components/Container";
import AppHeader from "../components/AppHeader";

const Progress = () => {
  const navigation = useNavigation();
  return (
    <>
      <ScrollView style={{ paddingTop: 20, backgroundColor:"#FFF"}}  showsVerticalScrollIndicator={false}>
        <Container>
          <View style={{ rowGap: 15 }}>
            <Card>
              <Card.Content>
                <Text
                  style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}
                >
                  Consistência nos hábitos
                </Text>
                <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
                  Acompanhe a consistência mensal nos hábitos definidos por você
                </Text>
              </Card.Content>
              <Card.Actions
                style={{ justifyContent: "flex-start", paddingBottom: 25 }}
              >
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate("HabitConsistency")}
                >
                  Ver
                </Button>
              </Card.Actions>
            </Card>

            <Card>
              <Card.Content>
                <Text
                  style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}
                >
                  Tempo de foco
                </Text>
                <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
                   Monitore sua meta de foco e o tempo efetivo por sessão.
                </Text>
              </Card.Content>
              <Card.Actions
                style={{ justifyContent: "flex-start", paddingBottom: 25 }}
              >
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate("IndicadorTempoFoco")}
                >
                  Ver
                </Button>
              </Card.Actions>
            </Card>

            <Card>
              <Card.Content>
                <Text
                  style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}
                >
                  Indicador
                </Text>
                <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
                  Descrição
                </Text>
              </Card.Content>
              <Card.Actions
                style={{ justifyContent: "flex-start", paddingBottom: 25 }}
              >
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate("")}
                >
                  Ver
                </Button>
              </Card.Actions>
            </Card>

            <Card>
              <Card.Content>
                <Text
                  style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}
                >
                  Indicador
                </Text>
                <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
                  Descrição
                </Text>
              </Card.Content>
              <Card.Actions
                style={{ justifyContent: "flex-start", paddingBottom: 25 }}
              >
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate("")}
                >
                  Ver
                </Button>
              </Card.Actions>
            </Card>

            <Card>
              <Card.Content>
                <Text
                  style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}
                >
                  Indicador
                </Text>
                <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
                  Descrição
                </Text>
              </Card.Content>
              <Card.Actions
                style={{ justifyContent: "flex-start", paddingBottom: 25 }}
              >
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate("")}
                >
                  Ver
                </Button>
              </Card.Actions>
            </Card>
          </View>
        </Container>
      </ScrollView>
    </>
  );
};

export default Progress;
