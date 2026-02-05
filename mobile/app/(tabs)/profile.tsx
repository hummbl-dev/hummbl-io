// Using P1 (First Principles) - Profile and settings screen

import { View, Text, ScrollView, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors, spacing, layout, typography } from '../../theme';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingRow({ icon, title, subtitle, onPress, rightElement }: SettingRowProps) {
  const content = (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color={colors.primary[500]} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (onPress && (
        <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
      ))}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* User section */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.text.inverse} />
        </View>
        <Text style={styles.userName}>HUMMBL User</Text>
        <Text style={styles.userEmail}>Exploring mental models</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Bookmarks</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Notes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Read</Text>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsCard}>
          <SettingRow
            icon="moon"
            title="Dark Mode"
            subtitle="Coming soon"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={darkMode ? colors.primary[500] : colors.neutral[50]}
                disabled
              />
            }
          />
          <View style={styles.settingDivider} />
          <SettingRow
            icon="notifications"
            title="Notifications"
            subtitle="Get notified about new content"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={notifications ? colors.primary[500] : colors.neutral[50]}
              />
            }
          />
          <View style={styles.settingDivider} />
          <SettingRow
            icon="cloud-offline"
            title="Offline Mode"
            subtitle="Save content for offline access"
            rightElement={
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={offlineMode ? colors.primary[500] : colors.neutral[50]}
              />
            }
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content</Text>
        <View style={styles.settingsCard}>
          <SettingRow
            icon="download"
            title="Download All Content"
            subtitle="Make all models available offline"
            onPress={() => {}}
          />
          <View style={styles.settingDivider} />
          <SettingRow
            icon="trash"
            title="Clear Cache"
            subtitle="Free up storage space"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingsCard}>
          <SettingRow
            icon="information-circle"
            title="About HUMMBL"
            onPress={() => {}}
          />
          <View style={styles.settingDivider} />
          <SettingRow
            icon="document-text"
            title="Terms of Service"
            onPress={() => {}}
          />
          <View style={styles.settingDivider} />
          <SettingRow
            icon="shield-checkmark"
            title="Privacy Policy"
            onPress={() => {}}
          />
          <View style={styles.settingDivider} />
          <SettingRow
            icon="code"
            title="Version"
            rightElement={<Text style={styles.versionText}>1.0.0</Text>}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          HUMMBL - Mental Models for Better Thinking
        </Text>
        <Text style={styles.footerCopyright}>
          {new Date().getFullYear()} HUMMBL
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.primary[500],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.headingLarge,
    color: colors.text.inverse,
  },
  userEmail: {
    ...typography.bodyMedium,
    color: colors.primary[100],
    marginTop: spacing.xxs,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    marginHorizontal: layout.screenPadding,
    marginTop: -spacing.lg,
    borderRadius: layout.cardBorderRadius,
    padding: layout.cardPadding,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.xs,
  },
  statNumber: {
    ...typography.displaySmall,
    color: colors.primary[500],
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: layout.screenPadding,
  },
  sectionTitle: {
    ...typography.labelMedium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  settingsCard: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.cardBorderRadius,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.cardPadding,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.labelLarge,
    color: colors.text.primary,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginLeft: 68,
  },
  versionText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: layout.screenPadding,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  footerCopyright: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
