import React, { useState, useEffect, useCallback } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Divider,
  Text,
  TextInput,
  useTheme,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { userService } from '../services/userService';

export default function SettingsScreen({ onBack }) {
  const theme = useTheme();

  const [originalData, setOriginalData] = useState({ nome: '', email: '' });
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [errors, setErrors] = useState({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success'); // 'success' ou 'error'

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [])
  );

  const loadUserProfile = async () => {
    console.log('SETTINGS: Loading user profile...');
    setLoadingProfile(true);
    
    try {
      const result = await userService.getProfile();
      
      if (result.success) {
        console.log('SETTINGS: Profile loaded successfully:', result.data);
        const userData = result.data;
        setOriginalData({ nome: userData.nome, email: userData.email });
        setNome(userData.nome || '');
        setEmail(userData.email || '');
      } else {
        console.log('SETTINGS: Failed to load profile:', result.error);
        showSnackbar('Erro ao carregar dados do perfil', 'error');
        
        if (result.error.includes('Token') || result.error.includes('Sessão')) {
          Alert.alert(
            'Sessão Expirada',
            'Sua sessão expirou. Faça login novamente.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (onBack) onBack();
                }
              }
            ]
          );
        }
      }
    } catch (error) {
      console.error('SETTINGS: Error loading profile:', error);
      showSnackbar('Erro inesperado ao carregar perfil', 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const showSnackbar = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const validateProfileData = () => {
    const newErrors = {};
    
    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Email inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordData = () => {
    const newErrors = {};
    
    if (!senhaAtual.trim()) {
      newErrors.senhaAtual = 'Senha atual é obrigatória';
    }
    
    if (!novaSenha.trim()) {
      newErrors.novaSenha = 'Nova senha é obrigatória';
    } else if (novaSenha.length < 6) {
      newErrors.novaSenha = 'Nova senha deve ter pelo menos 6 caracteres';
    }
    
    if (!confirmarSenha.trim()) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (novaSenha !== confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasProfileChanges = () => {
    return nome !== originalData.nome || email !== originalData.email;
  };

  const handleSaveProfile = async () => {
    console.log('SETTINGS: Saving profile...');
    
    if (!validateProfileData()) {
      console.log('SETTINGS: Profile validation failed');
      return;
    }

    if (!hasProfileChanges()) {
      showSnackbar('Nenhuma alteração foi feita', 'error');
      return;
    }

    setSavingProfile(true);

    try {
      const result = await userService.updateProfile({
        nome: nome.trim(),
        email: email.trim()
      });

      if (result.success) {
        console.log('SETTINGS: Profile updated successfully');
        setOriginalData({ nome: nome.trim(), email: email.trim() });
        showSnackbar('Dados pessoais atualizados com sucesso!');
        
        setErrors({});
      } else {
        console.log('SETTINGS: Failed to update profile:', result.error);
        
        if (result.error.includes('já está cadastrado') || result.error.includes('email')) {
          setErrors({ email: 'Este email já está em uso' });
        } else {
          showSnackbar(result.error, 'error');
        }
      }
    } catch (error) {
      console.error('SETTINGS: Error updating profile:', error);
      showSnackbar('Erro inesperado ao salvar dados', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    console.log('SETTINGS: Changing password...');
    
    if (!validatePasswordData()) {
      console.log('SETTINGS: Password validation failed');
      return;
    }

    setChangingPassword(true);

    try {
      const result = await userService.changePassword({
        senhaAtual: senhaAtual.trim(),
        novaSenha: novaSenha.trim()
      });

      if (result.success) {
        console.log('SETTINGS: Password changed successfully');
        
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
        setErrors({});
        
        showSnackbar('Senha alterada com sucesso!');
      } else {
        console.log('SETTINGS: Failed to change password:', result.error);
        
        if (result.error.includes('senha atual') || result.error.includes('incorreta')) {
          setErrors({ senhaAtual: 'Senha atual incorreta' });
        } else {
          showSnackbar(result.error, 'error');
        }
      }
    } catch (error) {
      console.error('SETTINGS: Error changing password:', error);
      showSnackbar('Erro inesperado ao alterar senha', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loadingProfile) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Configurações" />
        </Appbar.Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16, color: theme.colors.onSurface }}>
            Carregando dados do perfil...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Avatar.Text
            size={80}
            label={nome ? nome.charAt(0).toUpperCase() : 'U'}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <Text variant="headlineSmall" style={{ marginTop: 12, color: theme.colors.onSurface }}>
            {nome || 'Usuário'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {email}
          </Text>
        </View>

        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Dados Pessoais" />
          <Card.Content>
            <TextInput
              label="Nome completo"
              value={nome}
              onChangeText={(text) => {
                setNome(text);
                if (errors.nome) {
                  setErrors({ ...errors, nome: '' });
                }
              }}
              mode="outlined"
              style={{ marginBottom: 8 }}
              error={!!errors.nome}
              disabled={savingProfile}
            />
            {errors.nome ? (
              <Text style={{ color: theme.colors.error, fontSize: 12, marginBottom: 8 }}>
                {errors.nome}
              </Text>
            ) : null}

            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: 16 }}
              error={!!errors.email}
              disabled={savingProfile}
            />
            {errors.email ? (
              <Text style={{ color: theme.colors.error, fontSize: 12, marginBottom: 8 }}>
                {errors.email}
              </Text>
            ) : null}

            <Button
              mode="contained"
              onPress={handleSaveProfile}
              loading={savingProfile}
              disabled={savingProfile || !hasProfileChanges()}
              style={{ marginTop: 8 }}
            >
              {savingProfile ? 'Salvando...' : 'Salvar Dados'}
            </Button>
          </Card.Content>
        </Card>

        <Divider style={{ marginVertical: 16 }} />

        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Alterar Senha" />
          <Card.Content>
            <TextInput
              label="Senha atual"
              value={senhaAtual}
              onChangeText={(text) => {
                setSenhaAtual(text);
                if (errors.senhaAtual) {
                  setErrors({ ...errors, senhaAtual: '' });
                }
              }}
              mode="outlined"
              secureTextEntry={!showSenhaAtual}
              right={
                <TextInput.Icon
                  icon={showSenhaAtual ? 'eye-off' : 'eye'}
                  onPress={() => setShowSenhaAtual(!showSenhaAtual)}
                />
              }
              style={{ marginBottom: 8 }}
              error={!!errors.senhaAtual}
              disabled={changingPassword}
            />
            {errors.senhaAtual ? (
              <Text style={{ color: theme.colors.error, fontSize: 12, marginBottom: 8 }}>
                {errors.senhaAtual}
              </Text>
            ) : null}

            <TextInput
              label="Nova senha"
              value={novaSenha}
              onChangeText={(text) => {
                setNovaSenha(text);
                if (errors.novaSenha) {
                  setErrors({ ...errors, novaSenha: '' });
                }
              }}
              mode="outlined"
              secureTextEntry={!showNovaSenha}
              right={
                <TextInput.Icon
                  icon={showNovaSenha ? 'eye-off' : 'eye'}
                  onPress={() => setShowNovaSenha(!showNovaSenha)}
                />
              }
              style={{ marginBottom: 8 }}
              error={!!errors.novaSenha}
              disabled={changingPassword}
            />
            {errors.novaSenha ? (
              <Text style={{ color: theme.colors.error, fontSize: 12, marginBottom: 8 }}>
                {errors.novaSenha}
              </Text>
            ) : null}

            <TextInput
              label="Confirmar nova senha"
              value={confirmarSenha}
              onChangeText={(text) => {
                setConfirmarSenha(text);
                if (errors.confirmarSenha) {
                  setErrors({ ...errors, confirmarSenha: '' });
                }
              }}
              mode="outlined"
              secureTextEntry={!showConfirmarSenha}
              right={
                <TextInput.Icon
                  icon={showConfirmarSenha ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
                />
              }
              style={{ marginBottom: 8 }}
              error={!!errors.confirmarSenha}
              disabled={changingPassword}
            />
            {errors.confirmarSenha ? (
              <Text style={{ color: theme.colors.error, fontSize: 12, marginBottom: 8 }}>
                {errors.confirmarSenha}
              </Text>
            ) : null}

            <Button
              mode="contained"
              onPress={handleChangePassword}
              loading={changingPassword}
              disabled={changingPassword}
              style={{ marginTop: 16 }}
              buttonColor={theme.colors.secondary}
            >
              {changingPassword ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={{
          backgroundColor: snackbarType === 'success' 
            ? theme.colors.primaryContainer 
            : theme.colors.errorContainer
        }}
      >
        <Text style={{
          color: snackbarType === 'success' 
            ? theme.colors.onPrimaryContainer 
            : theme.colors.onErrorContainer
        }}>
          {snackbarMessage}
        </Text>
      </Snackbar>
    </KeyboardAvoidingView>
  );
}
