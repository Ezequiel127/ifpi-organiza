import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

const deadlines = [
  {
    id: '1',
    day: '30',
    month: 'JUL',
    title: 'Entregar protótipo mobile',
    subject: 'Programação para Dispositivos Móveis',
    type: 'Trabalho',
  },
  {
    id: '2',
    day: '02',
    month: 'AGO',
    title: 'Revisar requisitos do MVP',
    subject: 'Engenharia de Software',
    type: 'Atividade',
  },
  {
    id: '3',
    day: '05',
    month: 'AGO',
    title: 'Apresentar proposta do aplicativo',
    subject: 'Projeto Integrador',
    type: 'Seminário',
  },
  {
    id: '4',
    day: '08',
    month: 'AGO',
    title: 'Avaliação da unidade',
    subject: 'Engenharia de Software',
    type: 'Prova',
  },
];

export default function DeadlinesScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Agenda acadêmica</Text>
          <Text style={styles.title}>Próximos prazos</Text>
          <Text style={styles.subtitle}>
            Acompanhe entregas, provas e apresentações das suas disciplinas.
          </Text>
        </View>

        <View style={styles.monthCard}>
          <View>
            <Text style={styles.monthLabel}>Período atual</Text>
            <Text style={styles.monthTitle}>Julho e agosto de 2026</Text>
          </View>
          <View style={styles.calendarIcon}>
            <MaterialIcons color={colors.primaryDark} name="calendar-month" size={28} />
          </View>
        </View>

        <View style={styles.deadlineList}>
          {deadlines.map((deadline) => (
            <View key={deadline.id} style={styles.deadlineCard}>
              <View style={styles.dateBlock}>
                <Text style={styles.dateDay}>{deadline.day}</Text>
                <Text style={styles.dateMonth}>{deadline.month}</Text>
              </View>
              <View style={styles.deadlineContent}>
                <Text style={styles.deadlineTitle}>{deadline.title}</Text>
                <Text style={styles.deadlineSubject}>{deadline.subject}</Text>
                <View style={styles.typeTag}>
                  <Text style={styles.typeText}>{deadline.type}</Text>
                </View>
              </View>
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
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  monthCard: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  monthLabel: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  monthTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  calendarIcon: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  deadlineList: {
    gap: spacing.md,
  },
  deadlineCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  dateBlock: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 66,
    justifyContent: 'center',
    width: 58,
  },
  dateDay: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  dateMonth: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 1,
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  deadlineSubject: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningSoft,
    borderRadius: 99,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  typeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '800',
  },
});
