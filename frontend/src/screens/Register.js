import React from 'react';
import { Alert, Text } from 'react-native';
import { TextInput } from 'react-native-paper';

import Container from '../components/Container';
import Form from '../components/Form';
import { authService } from '../services/authService';

const Register = ({ navigation }) => {
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [confirmSenha, setConfirmSenha] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [errors, setErrors] = React.useState({
    nome: '',
    email: '',
    senha: '',
    confirmSenha: ''
  });

  const validateForm = () => {
    let newErrors = {
      nome: '',
      email: '',
      senha: '',
      confirmSenha: ''
    };
    let isValid = true;

    if (!nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório';
      isValid = false;
    }

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

    if (!confirmSenha.trim()) {
      newErrors.confirmSenha = 'Confirmação de senha é obrigatória';
      isValid = false;
    } else if (senha !== confirmSenha) {
      newErrors.confirmSenha = 'As senhas não coincidem';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    console.log('=== REGISTER: Button clicked ===');

    if (!validateForm()) {
      console.log('REGISTER: Validation failed');
      return;
    }

    console.log('REGISTER: Validation passed, calling API');
    setLoading(true);

    try {
      const result = await authService.register(nome, email, senha);
      console.log('REGISTER: Result received:', result);

      if (result.success) {
        console.log('REGISTER: Success! Navigating to Login...');
        navigation.navigate('Login');
        setTimeout(() => {
          Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        }, 100);
      } else {
        console.log('REGISTER: Failed with error:', result.error);

        const errorMsg = result.error || '';

        if (errorMsg.toLowerCase().includes('já está cadastrado') || errorMsg.toLowerCase().includes('já cadastrado')) {
          setErrors({
            ...errors,
            email: 'Este email já está cadastrado'
          });
        } else {
          Alert.alert('Erro ao cadastrar', result.error);
        }
      }
    } catch (error) {
      console.error('REGISTER: Exception:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
      console.log('REGISTER: Loading set to false');
    }
  };

  return (
    <Container>
        <Form
          secondaryActionText="Já tem um cadastro?"
          secondaryActionLink="Fazer login"
          secondaryAction={() => navigation.navigate("Login")}
          onLogoPress={() => navigation.navigate("Landing")}
          onSubmit={handleRegister}
          loading={loading}
          >
          <TextInput
            label="Nome completo"
            mode="outlined"
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              if (errors.nome) setErrors({...errors, nome: ''});
            }}
            disabled={loading}
            error={!!errors.nome}
          />
          {errors.nome ? <Text style={{color: 'red', fontSize: 12, marginTop: -8, marginBottom: 8}}>{errors.nome}</Text> : null}

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({...errors, email: ''});
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
              if (errors.senha) setErrors({...errors, senha: ''});
            }}
            disabled={loading}
            error={!!errors.senha}
          />
          {errors.senha ? <Text style={{color: 'red', fontSize: 12, marginTop: -8, marginBottom: 8}}>{errors.senha}</Text> : null}

          <TextInput
            label="Confirme sua senha"
            mode="outlined"
            secureTextEntry={true}
            value={confirmSenha}
            onChangeText={(text) => {
              setConfirmSenha(text);
              if (errors.confirmSenha) setErrors({...errors, confirmSenha: ''});
            }}
            disabled={loading}
            error={!!errors.confirmSenha}
          />
          {errors.confirmSenha ? <Text style={{color: 'red', fontSize: 12, marginTop: -8, marginBottom: 8}}>{errors.confirmSenha}</Text> : null}
        </Form>
    </Container>
  )
};

export default Register;
          