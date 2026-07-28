import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

const recentTasks = [
  {
    id: '1',
    title: 'Entregar protótipo mobile',
    meta: 'Programação para Dispositivos Móveis • 30/07',
  },
  {
    id: '2',
    title: 'Revisar requisitos do MVP',
    meta: 'Engenharia de Software • 02/08',
  },
  {
    id: '3',
    title: 'Preparar apresentação do projeto',
    meta: 'Projeto Integrador • 05/08',
  },
];

const newTaskRoute = '/nova-tarefa' as Href;

export default function DashboardScreen() {
  function openNewTask() {
    router.push(newTaskRoute);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Bom dia, Ezequiel</Text>
            <Text style={styles.title}>Resumo acadêmico</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>EV</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>3</Text>
            <Text style={styles.summaryLabel}>Pendentes</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>1</Text>
            <Text style={styles.summaryLabel}>Concluídas</Text>
          </View>
        </View>

        <View style={styles.deadlineCard}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Próximo prazo</Text>
          </View>
          <Text style={styles.deadlineTitle}>Entregar protótipo mobile</Text>
          <View style={styles.deadlineMeta}>
            <MaterialIcons color={colors.primaryDark} name="event" size={18} />
            <Text style={styles.deadlineText}>30 de julho • Programação Mobile</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={openNewTask}
          style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}>
          <MaterialIcons color={colors.white} name="add" size={22} />
          <Text style={styles.addButtonText}>Nova tarefa</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Atividades recentes</Text>
          <Text style={styles.sectionCaption}>Últimas atualizações</Text>
        </View>

        <View style={styles.taskList}>
          {recentTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskStatus} />
              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskMeta}>{task.meta}</Text>
              </View>
              <MaterialIcons color={colors.textMuted} name="chevron-right" size={22} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
  },
  summaryNumber: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: '800',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  deadlineCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderLeftColor: colors.primary,
    borderLeftWidth: 5,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 99,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tagText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  deadlineTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  deadlineMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  deadlineText: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 14,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 52,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionCaption: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  taskList: {
    gap: spacing.sm,
  },
  taskCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  taskStatus: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderRadius: 6,
    borderWidth: 2,
    height: 24,
    width: 24,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  taskMeta: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
