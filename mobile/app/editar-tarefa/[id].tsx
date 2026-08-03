import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href, useLocalSearchParams } from 'expo-router';
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
import type { Task } from '@/src/types/task';
import {
  type TaskFormErrors,
  type TaskFormField,
  validateTaskForm,
} from '@/src/utils/taskValidation';

type FormErrors = TaskFormErrors & { save?: string };

const tasksRoute = '/(tabs)/tarefas' as Href;

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { tasks } = useTasks();
  const taskId = Array.isArray(id) ? id[0] : id;
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return <TaskNotFound />;
  }

  return <EditTaskForm key={task.id} task={task} />;
}

function TaskNotFound() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.notFoundContainer}>
        <MaterialIcons color={colors.textMuted} name="search-off" size={48} />
        <Text style={styles.notFoundTitle}>Tarefa não encontrada</Text>
        <Text style={styles.notFoundText}>
          Não foi possível localizar a tarefa solicitada.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace(tasksRoute)}
          style={({ pressed }) => [
            styles.saveButton,
            styles.notFoundButton,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.saveButtonText}>Voltar para tarefas</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function EditTaskForm({ task }: { task: Task }) {
  const { updateTask } = useTasks();
  const [title, setTitle] = useState(task.title);
  const [subject, setSubject] = useState(task.subject);
  const [deadline, setDeadline] = useState(task.deadline);
  const [type, setType] = useState(task.type);
  const [description, setDescription] = useState(task.description);
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
      const wasUpdated = await updateTask(task.id, validation.normalizedValues);

      if (!wasUpdated) {
        setErrors({
          save: 'Não foi possível salvar as alterações. Tente novamente.',
        });
        return;
      }

      setErrors({});
      router.replace(tasksRoute);
    } catch {
      setErrors({
        save: 'Não foi possível salvar as alterações. Tente novamente.',
      });
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }

  function handleCancel() {
    if (!isSaving) {
      router.back();
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Cancelar edição e voltar"
            accessibilityRole="button"
            accessibilityState={{ disabled: isSaving }}
            disabled={isSaving}
            hitSlop={8}
            onPress={handleCancel}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
              isSaving && styles.disabledButton,
            ]}>
            <MaterialIcons color={colors.primaryDark} name="arrow-back" size={24} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Edição</Text>
            <Text style={styles.title}>Editar tarefa</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>
            Atualize as informações acadêmicas da tarefa selecionada.
          </Text>

          <View style={styles.formCard}>
            <View style={styles.field}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                accessibilityLabel="Título da tarefa"
                editable={!isSaving}
                maxLength={Math.max(100, title.length)}
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
                editable={!isSaving}
                maxLength={Math.max(60, subject.length)}
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
              {errors.subject ? (
                <Text style={styles.errorText}>{errors.subject}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Prazo</Text>
              <TextInput
                accessibilityLabel="Prazo no formato ano, mês e dia"
                autoCapitalize="none"
                editable={!isSaving}
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
              {errors.deadline ? (
                <Text style={styles.errorText}>{errors.deadline}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tipo</Text>
              <TextInput
                accessibilityLabel="Tipo da tarefa"
                editable={!isSaving}
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
                editable={!isSaving}
                maxLength={Math.max(500, description.length)}
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
                {isSaving ? 'Salvando...' : 'Salvar alterações'}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isSaving }}
              disabled={isSaving}
              onPress={handleCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
                isSaving && styles.disabledButton,
              ]}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            {errors.save ? (
              <Text accessibilityLiveRegion="polite" style={styles.errorText}>
                {errors.save}
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.screen,
    flex: 1,
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
  cancelButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButtonText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
  },
  notFoundContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  notFoundText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  notFoundButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
});
