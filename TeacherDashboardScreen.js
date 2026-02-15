// SwiftPick — Teacher Dashboard (Redesigned)
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Alert, Image } from 'react-native';
import { COLORS } from '../../utils/constants';
import { MOCK_CHILDREN } from '../../utils/mockData';
import { listStyles, SPACING } from '../../utils/listStyles';
import { useAuth } from '../../context/AuthContext';
import { getStatusColor } from '../../utils/helpers';

export default function TeacherDashboardScreen({ navigation }) {
    const { logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [students, setStudents] = useState(MOCK_CHILDREN);

    const stats = useMemo(() => {
        const total = students.length;
        const ready = students.filter(s => s.status === 'ready').length;
        const inTransit = students.filter(s => s.status === 'in_transit' || s.status === 'on_the_way').length;
        const pickedUp = students.filter(s => s.status === 'picked_up').length;
        return { total, ready, inTransit, pickedUp };
    }, [students]);

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s.parent_name && s.parent_name.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesFilter = activeFilter === 'All' ||
                (activeFilter === 'Ready' && s.status === 'ready') ||
                (activeFilter === 'In Transit' && (s.status === 'in_transit' || s.status === 'on_the_way')) ||
                (activeFilter === 'Picked Up' && s.status === 'picked_up');
            return matchesSearch && matchesFilter;
        });
    }, [students, searchQuery, activeFilter]);

    const handleMarkReady = (studentId) => {
        setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, status: 'ready', dismissal_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : s
        ));
        Alert.alert('Success', 'Student marked as ready');
    };

    const filters = ['All', 'Ready', 'In Transit', 'Picked Up'];

    const renderStudent = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.full_name[0]}</Text>
                </View>
                <View style={styles.cardHeaderInfo}>
                    <Text style={styles.studentName}>{item.full_name}</Text>
                    <Text style={styles.gradeText}>{item.grade || 'Grade'}</Text>
                </View>
                {item.status === 'ready' && (
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>Ready</Text>
                    </View>
                )}
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Location: </Text>{item.location || 'Main Entrance'}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Dismissal: </Text>{item.dismissal_time || '--:--'}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Bus: </Text>{item.bus_number ? `Bus ${item.bus_number}` : 'Car'}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Parent: </Text>{item.parent_name || 'Unknown'}</Text>
            </View>

            <View style={styles.actionRow}>
                {item.status !== 'ready' && item.status !== 'picked_up' ? (
                    <TouchableOpacity style={styles.markReadyBtn} onPress={() => handleMarkReady(item.id)}>
                        <Text style={styles.markReadyText}>Mark as Ready</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ flex: 1 }} />
                )}

                <TouchableOpacity style={styles.callBtn}>
                    <Text style={{ fontSize: 18 }}>📞</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Teacher{'\n'}Dashboard</Text>
                    <Text style={styles.headerSubtitle}>Manage dismissal queue{'\n'}and coordinate pickups</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 8 }}>
                    <TouchableOpacity style={styles.lobbyBtn}>
                        <Text style={styles.lobbyBtnText}>📺  Lobby Display Mode</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout} style={styles.logoutLink}>
                        <Text style={{ fontSize: 12, color: COLORS.danger }}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total Students</Text>
                    <View style={styles.statRow}>
                        <Text style={[styles.statNumber, { color: '#2C3E50' }]}>{stats.total}</Text>
                        <Text style={{ fontSize: 20 }}>👥</Text>
                    </View>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statLabel, { color: '#F1C40F' }]}>Ready</Text>
                    <View style={styles.statRow}>
                        <Text style={[styles.statNumber, { color: '#2C3E50' }]}>{stats.ready}</Text>
                        <Text style={{ fontSize: 20 }}>🕒</Text>
                    </View>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statLabel, { color: '#5A9BD5' }]}>In Transit</Text>
                    <View style={styles.statRow}>
                        <Text style={[styles.statNumber, { color: '#5A9BD5' }]}>{stats.inTransit}</Text>
                        <Text style={{ fontSize: 20 }}>⏱️</Text>
                    </View>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statLabel, { color: '#27AE60' }]}>Picked Up</Text>
                    <View style={styles.statRow}>
                        <Text style={[styles.statNumber, { color: '#27AE60' }]}>{stats.pickedUp}</Text>
                        <Text style={{ fontSize: 20 }}>✅</Text>
                    </View>
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="🔍  Search by name or Parent..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Filters */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {filters.map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, activeFilter === f && styles.activeFilter]}
                            onPress={() => setActiveFilter(f)}
                        >
                            <Text style={[styles.filterText, activeFilter === f && styles.activeFilterText]}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* List */}
            <FlatList
                data={filteredStudents}
                keyExtractor={item => String(item.id)}
                renderItem={renderStudent}
                contentContainerStyle={styles.list}
            />

            {/* Chat FAB */}
            <TouchableOpacity style={styles.fab}>
                <Text style={{ fontSize: 24, color: 'white' }}>💬</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },

    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 40 },
    headerTitle: { fontSize: 26, fontWeight: '800', color: '#111', lineHeight: 32 },
    headerSubtitle: { fontSize: 13, color: '#666', marginTop: 6, lineHeight: 18 },
    lobbyBtn: { backgroundColor: '#27AE60', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    lobbyBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    logoutLink: { alignSelf: 'flex-end', padding: 4 },

    statsContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between' },
    statBox: { width: '48%', backgroundColor: '#fff', marginBottom: 20, paddingHorizontal: 4 },
    statLabel: { fontSize: 13, color: '#7F8C8D', marginBottom: 4, fontWeight: '600' },
    statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    statNumber: { fontSize: 28, fontWeight: '700' },

    searchContainer: { paddingHorizontal: 20, marginBottom: 16 },
    searchInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 14, fontSize: 15 },

    filterContainer: { paddingHorizontal: 20, marginBottom: 20 },
    filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5', marginRight: 10 },
    activeFilter: { backgroundColor: '#27AE60' },
    filterText: { color: '#7F8C8D', fontWeight: '600' },
    activeFilterText: { color: '#fff' },

    list: { paddingHorizontal: 20, paddingBottom: 80 },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    cardTop: { flexDirection: 'row', marginBottom: 12 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#27AE60', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
    cardHeaderInfo: { flex: 1, justifyContent: 'center' },
    studentName: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
    gradeText: { fontSize: 13, color: '#95A5A6' },
    statusBadge: { backgroundColor: '#FFF9C4', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
    statusBadgeText: { color: '#F1C40F', fontWeight: '700', fontSize: 12 },

    detailsContainer: { marginBottom: 16 },
    detailText: { fontSize: 13, color: '#34495E', marginBottom: 4 },
    detailLabel: { color: '#95A5A6', fontWeight: '500' },

    actionRow: { flexDirection: 'row', gap: 12 },
    markReadyBtn: { flex: 1, backgroundColor: '#27AE60', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    markReadyText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    callBtn: { width: 48, height: 48, backgroundColor: '#3498DB', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

    fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3498DB', justifyContent: 'center', alignItems: 'center', elevation: 6 },
});
