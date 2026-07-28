import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

export default function NewTaskScreen() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  function handleSave() {
    Alert.alert(
      'Tarefa simulada',
      'O formulário está pronto. A persistência será implementada em uma próxima etapa.'
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}>
            <MaterialIcons color={colors.primaryDark} name="arrow-back" size={24} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Cadastro</Text>
            <Text style={styles.title}>Nova tarefa</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>
            Registre uma atividade acadêmica para acompanhar o prazo no IFPI Organiza.
          </Text>

          <View style={styles.formCard}>
            <View style={styles.field}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                accessibilityLabel="Título da tarefa"
                onChangeText={setTitle}
                placeholder="Ex.: Lista de Programação Mobile"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={title}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Disciplina</Text>
              <TextInput
                accessibilityLabel="Disciplina"
                onChangeText={setSubject}
                placeholder="Ex.: Programação para Dispositivos Móveis"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={subject}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Prazo</Text>
              <TextInput
                accessibilityLabel="Prazo"
                keyboardType="numbers-and-punctuation"
                onChangeText={setDeadline}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={deadline}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tipo</Text>
              <TextInput
                accessibilityLabel="Tipo da tarefa"
                onChangeText={setType}
                placeholder="Ex.: Trabalho, prova ou seminário"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={type}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                accessibilityLabel="Descrição da tarefa"
                multiline
                onChangeText={setDescription}
                placeholder="Adicione orientações ou observações importantes."
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.textArea]}
                textAlignVertical="top"
                value={description}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleSave}
              style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}>
              <MaterialIcons color={colors.white} name="save" size={21} />
              <Text style={styles.saveButtonText}>Salvar tarefa</Text>
            </Pressable>
          </View>
        </ScrollView>
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  intro: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  formCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
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
    fontSize: 15,
    minHeight: 50,
    paddingHorizontal: spacing.md,
  },
  textArea: {
    minHeight: 112,
    paddingTop: spacing.md,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 52,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
