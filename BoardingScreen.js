// SwiftPick — Boarding Screen (Driver)
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { listStyles, SPACING, RADIUS } from '../../utils/listStyles';
import { busService } from '../../services/busService';

export default function BoardingScreen({ route, navigation }) {
    const { trip } = route.params || {};
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [recentLogs, setRecentLogs] = useState(trip?.boarding_logs || []);

    async function handleAction(action) {
        if (!studentId.trim()) {
            Alert.alert('Error', 'Please enter a student ID');
            return;
        }

        setLoading(true);
        try {
            let result;
            if (action === 'board') {
                result = await busService.boardStudent(trip.id, parseInt(studentId));
            } else {
                result = await busService.dropoffStudent(trip.id, parseInt(studentId));
            }
            Alert.alert('Success', action === 'board' ? 'Student boarded!' : 'Student dropped off!');
            setRecentLogs((prev) => [
                { id: Date.now(), student_name: `Student #${studentId}`, action, ...result.data },
                ...prev,
            ]);
            setStudentId('');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to log action');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[styles.container, listStyles.screenPadding]}>
            <Text style={styles.heading}>Student Boarding</Text>
            <Text style={listStyles.subtitle}>Bus {trip?.bus_number} • {trip?.route_name}</Text>

            {/* Input */}
            <View style={styles.inputSection}>
                <Text style={listStyles.sectionTitle}>Student ID</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter student ID number"
                    placeholderTextColor={COLORS.textMuted}
                    value={studentId}
                    onChangeText={setStudentId}
                    keyboardType="number-pad"
                />

                <View style={styles.btnRow}>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.boardBtn]}
                        onPress={() => handleAction('board')}
                        disabled={loading}
                    >
                        <Text style={styles.actionBtnText}>🟢 Board</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.dropBtn]}
                        onPress={() => handleAction('dropoff')}
                        disabled={loading}
                    >
                        <Text style={styles.actionBtnText}>🔴 Drop Off</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Recent Logs */}
            <Text style={listStyles.sectionTitle}>Recent Activity</Text>
            <FlatList
                data={recentLogs}
                keyExtractor={(item, i) => String(item.id || i)}
                renderItem={({ item }) => (
                    <View style={[listStyles.card, listStyles.row]}>
                        <Text style={listStyles.iconSmall}>
                            {item.action === 'boarded' ? '🟢' : '🔴'}
                        </Text>
                        <View style={listStyles.content}>
                            <Text style={listStyles.title}>{item.student_name || `Student #${item.student_id}`}</Text>
                            <Text style={listStyles.subtitle}>
                                {item.action === 'boarded' ? 'Boarded' : 'Dropped Off'}
                            </Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={listStyles.emptyContainer}>
                        <Text style={listStyles.emptySubtitle}>No boarding activity yet</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    heading: { fontSize: 24, fontWeight: '800', color: COLORS.text },
    input: {
        backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
        borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 18, color: COLORS.text, textAlign: 'center',
    },
    inputSection: { marginBottom: SPACING.xxl },
    btnRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.md },
    actionBtn: { flex: 1, padding: SPACING.lg, borderRadius: RADIUS.md, alignItems: 'center' },
    boardBtn: { backgroundColor: COLORS.success + '22', borderWidth: 1, borderColor: COLORS.success },
    dropBtn: { backgroundColor: COLORS.danger + '22', borderWidth: 1, borderColor: COLORS.danger },
    actionBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.text },
});
