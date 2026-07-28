import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

export default function LoginScreen() {
  const [email, setEmail] = useState('aluno@ifpi.edu.br');
  const [password, setPassword] = useState('123456');

  function handleLogin() {
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.brandMark} accessibilityElementsHidden>
            <Text style={styles.brandInitials}>IF</Text>
          </View>

          <Text style={styles.title}>IFPI Organiza</Text>
          <Text style={styles.subtitle}>
            Organize tarefas, provas e prazos acadêmicos em um só lugar.
          </Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>E-mail acadêmico</Text>
              <TextInput
                accessibilityLabel="E-mail acadêmico"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="aluno@ifpi.edu.br"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={email}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                accessibilityLabel="Senha"
                autoCapitalize="none"
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                style={styles.input}
                value={password}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleLogin}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </Pressable>
          </View>

          <Text style={styles.helperText}>Acesso simulado para apresentação do protótipo.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  brandInitials: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginTop: spacing.lg,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm,
    maxWidth: 340,
  },
  form: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
