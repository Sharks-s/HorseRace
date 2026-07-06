import { useEffect, useState } from 'react';
import { tournamentApi } from '../../../api/tournamentApi';
import './TournamentManagementPage.css';

const TournamentManagementPage = () => {
    const [tournaments, setTournaments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRaceModalOpen, setIsRaceModalOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [races, setRaces] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const [raceData, setRaceData] = useState({
        name: '',
        startTime: '',
        distanceFactor: ''
    });

    useEffect(() => {
        const loadTournaments = async () => {
            try {
                const res = await tournamentApi.getAllTournaments();
                if (res.success) setTournaments(res.data);
            } catch (error) {
                console.error("Failed to load tournaments", error);
            }
        };

        void loadTournaments();
    }, []);

    const loadTournaments = async () => {
        try {
            const res = await tournamentApi.getAllTournaments();
            if (res.success) setTournaments(res.data);
        } catch (error) {
            console.error("Failed to load tournaments", error);
        }
    };

    const handleCreateTournament = async (e) => {
        e.preventDefault();
        try {
            await tournamentApi.createTournament(formData);
            setIsModalOpen(false);
            loadTournaments();
            setFormData({ name: '', startDate: '', endDate: '', description: '' });
        } catch (error) {
            console.error("Failed to create tournament", error);
            alert(error.response?.data?.message || "Failed to create tournament");
        }
    };

    const handleDeleteTournament = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this tournament?")) {
            try {
                await tournamentApi.deleteTournament(id);
                loadTournaments();
            } catch (error) {
                console.error("Failed to delete tournament", error);
                alert("Failed to delete tournament");
            }
        }
    };

    const openRaceManagement = async (tournament) => {
        setSelectedTournament(tournament);
        setIsRaceModalOpen(true);
        loadRaces(tournament.id);
    };

    const loadRaces = async (tournamentId) => {
        try {
            const res = await tournamentApi.getRacesByTournament(tournamentId);
            if (res.success) setRaces(res.data);
        } catch (error) {
            console.error("Failed to load races", error);
        }
    };

    const handleCreateRace = async (e) => {
        e.preventDefault();
        try {
            await tournamentApi.createRace(selectedTournament.id, raceData);
            loadRaces(selectedTournament.id);
            setRaceData({ name: '', startTime: '', distanceFactor: '' });
        } catch (error) {
            console.error("Failed to create race", error);
            alert(error.response?.data?.message || "Failed to create race. Make sure the race start time is within the tournament period.");
        }
    };

    const handleDeleteRace = async (raceId) => {
        if (window.confirm("Are you sure you want to delete this race?")) {
            try {
                await tournamentApi.deleteRace(selectedTournament.id, raceId);
                loadRaces(selectedTournament.id);
            } catch (error) {
                console.error("Failed to delete race", error);
                alert("Failed to delete race.");
            }
        }
    };

    return (
        <div className="tournament-management-container">
            <div className="tournament-header">
                <h1>Tournament Management</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Create Tournament</button>
            </div>

            <div className="tournament-grid">
                {tournaments.map(t => (
                    <div key={t.id} className="tournament-card" onClick={() => openRaceManagement(t)}>
                        <div className={`status-badge status-${t.status}`}>{t.status}</div>
                        <h3>{t.name}</h3>
                        <p>{t.startDate} ➔ {t.endDate}</p>
                        <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{t.description}</p>
                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                            <button className="btn-danger" onClick={(e) => handleDeleteTournament(t.id, e)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Tạo Tournament */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create Tournament</h2>
                        <form onSubmit={handleCreateTournament}>
                            <div className="form-group">
                                <label>Tournament Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Quản lý Race */}
            {isRaceModalOpen && selectedTournament && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '800px' }}>
                        <h2>Races: {selectedTournament.name}</h2>
                        
                        <div style={{ background: '#222', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                            <h3>Add New Race</h3>
                            <form onSubmit={handleCreateRace} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Race Name</label>
                                    <input required type="text" value={raceData.name} onChange={e => setRaceData({...raceData, name: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Start Time</label>
                                    <input required type="datetime-local" value={raceData.startTime} onChange={e => setRaceData({...raceData, startTime: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Distance Factor</label>
                                    <input required type="number" step="0.1" value={raceData.distanceFactor} onChange={e => setRaceData({...raceData, distanceFactor: e.target.value})} />
                                </div>
                                <button type="submit" className="btn-primary">Add</button>
                            </form>
                        </div>

                        <div className="race-list">
                            {races.length === 0 ? <p>No races available.</p> : races.map(r => (
                                <div key={r.id} className="race-item">
                                    <div>
                                        <strong>{r.name}</strong> - <span>{new Date(r.startTime).toLocaleString()}</span>
                                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>Distance Factor: {r.distanceFactor} | Status: {r.status}</div>
                                    </div>
                                    <button className="btn-danger" onClick={() => handleDeleteRace(r.id)}>Delete</button>
                                </div>
                            ))}
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setIsRaceModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TournamentManagementPage;
