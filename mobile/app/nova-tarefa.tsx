import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href } from 'expo-router';
import { useRef, useState } from 'react';
import {
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

import { useTasks } from '@/src/contexts/TasksContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import {
  type TaskFormErrors,
  type TaskFormField,
  validateTaskForm,
} from '@/src/utils/taskValidation';

type FormErrors = TaskFormErrors & { save?: string };

const tasksRoute = '/(tabs)/tarefas' as Href;

export default function NewTaskScreen() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const titleInputRef = useRef<TextInput>(null);
  const subjectInputRef = useRef<TextInput>(null);
  const deadlineInputRef = useRef<TextInput>(null);
  const typeInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  function clearFieldError(field: TaskFormField) {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function focusFirstInvalidField(field: TaskFormField | null) {
    if (!field) {
      return;
    }

    const inputRefs = {
      title: titleInputRef,
      subject: subjectInputRef,
      deadline: deadlineInputRef,
      type: typeInputRef,
      description: descriptionInputRef,
    };

    requestAnimationFrame(() => inputRefs[field].current?.focus());
  }

  async function handleSave() {
    if (isSavingRef.current) {
      return;
    }

    const validation = validateTaskForm({
      title,
      subject,
      deadline,
      type,
      description,
    });

    setErrors(validation.errors);

    if (!validation.valid) {
      focusFirstInvalidField(validation.firstInvalidField);
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);

    try {
      const wasSaved = await addTask(validation.normalizedValues);

      if (!wasSaved) {
        setErrors({ save: 'Não foi possível salvar a tarefa. Tente novamente.' });
        return;
      }

      setTitle('');
      setSubject('');
      setDeadline('');
      setType('');
      setDescription('');
      setErrors({});
      router.replace(tasksRoute);
    } catch {
      setErrors({ save: 'Não foi possível salvar a tarefa. Tente novamente.' });
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
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
                maxLength={100}
                onChangeText={(value) => {
                  setTitle(value);
                  clearFieldError('title');
                }}
                placeholder="Ex.: Lista de Programação Mobile"
                placeholderTextColor={colors.textMuted}
                ref={titleInputRef}
                style={[styles.input, errors.title && styles.inputError]}
                value={title}
              />
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Disciplina</Text>
              <TextInput
                accessibilityLabel="Disciplina"
                maxLength={60}
                onChangeText={(value) => {
                  setSubject(value);
                  clearFieldError('subject');
                }}
                placeholder="Ex.: Programação para Dispositivos Móveis"
                placeholderTextColor={colors.textMuted}
                ref={subjectInputRef}
                style={[styles.input, errors.subject && styles.inputError]}
                value={subject}
              />
              {errors.subject ? <Text style={styles.errorText}>{errors.subject}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Prazo</Text>
              <TextInput
                accessibilityLabel="Prazo no formato ano, mês e dia"
                autoCapitalize="none"
                keyboardType="numbers-and-punctuation"
                onChangeText={(value) => {
                  setDeadline(value);
                  clearFieldError('deadline');
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                ref={deadlineInputRef}
                style={[styles.input, errors.deadline && styles.inputError]}
                value={deadline}
              />
              {errors.deadline ? <Text style={styles.errorText}>{errors.deadline}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tipo</Text>
              <TextInput
                accessibilityLabel="Tipo da tarefa"
                onChangeText={(value) => {
                  setType(value);
                  clearFieldError('type');
                }}
                placeholder="Ex.: Trabalho, prova ou seminário"
                placeholderTextColor={colors.textMuted}
                ref={typeInputRef}
                style={[styles.input, errors.type && styles.inputError]}
                value={type}
              />
              {errors.type ? <Text style={styles.errorText}>{errors.type}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                accessibilityLabel="Descrição da tarefa"
                maxLength={500}
                multiline
                onChangeText={(value) => {
                  setDescription(value);
                  clearFieldError('description');
                }}
                placeholder="Adicione orientações ou observações importantes."
                placeholderTextColor={colors.textMuted}
                ref={descriptionInputRef}
                style={[
                  styles.input,
                  styles.textArea,
                  errors.description && styles.inputError,
                ]}
                textAlignVertical="top"
                value={description}
              />
              {errors.description ? (
                <Text style={styles.errorText}>{errors.description}</Text>
              ) : null}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ busy: isSaving, disabled: isSaving }}
              disabled={isSaving}
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.buttonPressed,
                isSaving && styles.disabledButton,
              ]}>
              <MaterialIcons color={colors.white} name="save" size={21} />
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Salvando...' : 'Salvar tarefa'}
              </Text>
            </Pressable>
            {errors.save ? <Text style={styles.errorText}>{errors.save}</Text> : null}
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
  disabledButton: {
    opacity: 0.65,
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
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
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
