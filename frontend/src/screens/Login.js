import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

import Container from '../components/Container';
import Form from '../components/Form';
import { authService } from '../services/authService';

const Login = ({navigation}) => {
  const theme = useTheme();
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [errors, setErrors] = React.useState({
    email: '',
    senha: ''
  });
  const [showRegisterSuggestion, setShowRegisterSuggestion] = React.useState(false);

  const validateForm = () => {
    let newErrors = {
      email: '',
      senha: ''
    };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Email inválido';
        isValid = false;
      }
    }

    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
      isValid = false;
    } else if (senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    setShowRegisterSuggestion(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await authService.login(email, senha);

      if (result.success) {
        navigation.navigate("Main");
      } else {
        const errorMsg = result.error || '';

        if (errorMsg.includes('não encontrado') || errorMsg.toLowerCase().includes('usuário não encontrado')) {
          setErrors({
            email: 'Este email não está cadastrado',
            senha: ''
          });
          setShowRegisterSuggestion(true);
        } else if (errorMsg.includes('incorreta') || errorMsg.toLowerCase().includes('senha incorreta')) {
          setErrors({
            email: '',
            senha: 'Senha incorreta'
          });
          setShowRegisterSuggestion(false);
        } else {
          Alert.alert('Erro ao fazer login', result.error);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
        <Form
          secondaryActionText="Ainda não tem uma conta?"
          secondaryActionLink="Cadastre-se"
          secondaryAction={() => navigation.navigate("Register")}
          onLogoPress={() => navigation.navigate("Landing")}
          onSubmit={handleLogin}
          loading={loading}>
          {showRegisterSuggestion ? (
            <Text style={{fontSize: 13, marginBottom: 8}}>
              Considere se registrar{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{color: theme.colors.primary, textDecorationLine: 'underline', fontWeight: '500'}}>
                  aqui
                </Text>
              </TouchableOpacity>
            </Text>
          ) : null}

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors({...errors, email: ''});
                setShowRegisterSuggestion(false);
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={loading}
            error={!!errors.email}
          />
          {errors.email ? <Text style={{color: 'red', fontSize: 12, marginTop: -8, marginBottom: 8}}>{errors.email}</Text> : null}

          <TextInput
            label="Senha"
            mode="outlined"
            secureTextEntry={true}
            value={senha}
            onChangeText={(text) => {
              setSenha(text);
              if (errors.senha) {
                setErrors({...errors, senha: ''});
              }
            }}
            disabled={loading}
            error={!!errors.senha}
          />
          {errors.senha ? <Text style={{color: 'red', fontSize: 12, marginTop: -8, marginBottom: 8}}>{errors.senha}</Text> : null}
        </Form>
    </Container>
  )
};

export default Login;