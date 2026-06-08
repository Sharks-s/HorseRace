import React, { useState, useEffect } from 'react';
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
        loadTournaments();
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
            alert(error.response?.data?.message || "Lỗi tạo giải đấu");
        }
    };

    const handleDeleteTournament = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Bạn có chắc muốn xoá giải đấu này?")) {
            try {
                await tournamentApi.deleteTournament(id);
                loadTournaments();
            } catch (error) {
                alert("Lỗi xoá giải đấu");
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
            alert(error.response?.data?.message || "Lỗi tạo vòng đua. Đảm bảo thời gian nằm trong thời hạn giải đấu.");
        }
    };

    const handleDeleteRace = async (raceId) => {
        if (window.confirm("Xoá vòng đua này?")) {
            try {
                await tournamentApi.deleteRace(selectedTournament.id, raceId);
                loadRaces(selectedTournament.id);
            } catch (error) {
                alert("Lỗi xoá vòng đua");
            }
        }
    };

    return (
        <div className="tournament-management-container">
            <div className="tournament-header">
                <h1>Quản lý Giải Đấu (Tournaments)</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Tạo Giải Đấu Mới</button>
            </div>

            <div className="tournament-grid">
                {tournaments.map(t => (
                    <div key={t.id} className="tournament-card" onClick={() => openRaceManagement(t)}>
                        <div className={`status-badge status-${t.status}`}>{t.status}</div>
                        <h3>{t.name}</h3>
                        <p>{t.startDate} ➔ {t.endDate}</p>
                        <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{t.description}</p>
                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                            <button className="btn-danger" onClick={(e) => handleDeleteTournament(t.id, e)}>Xoá</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Tạo Tournament */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Tạo Giải Đấu Mới</h2>
                        <form onSubmit={handleCreateTournament}>
                            <div className="form-group">
                                <label>Tên giải đấu</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Ngày bắt đầu</label>
                                <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Ngày kết thúc</label>
                                <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Quản lý Race */}
            {isRaceModalOpen && selectedTournament && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '800px' }}>
                        <h2>Các Vòng Đua: {selectedTournament.name}</h2>
                        
                        <div style={{ background: '#222', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                            <h3>Thêm vòng đua mới</h3>
                            <form onSubmit={handleCreateRace} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Tên vòng</label>
                                    <input required type="text" value={raceData.name} onChange={e => setRaceData({...raceData, name: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Thời gian bắt đầu</label>
                                    <input required type="datetime-local" value={raceData.startTime} onChange={e => setRaceData({...raceData, startTime: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Hệ số quãng đường</label>
                                    <input required type="number" step="0.1" value={raceData.distanceFactor} onChange={e => setRaceData({...raceData, distanceFactor: e.target.value})} />
                                </div>
                                <button type="submit" className="btn-primary">Thêm</button>
                            </form>
                        </div>

                        <div className="race-list">
                            {races.length === 0 ? <p>Chưa có vòng đua nào.</p> : races.map(r => (
                                <div key={r.id} className="race-item">
                                    <div>
                                        <strong>{r.name}</strong> - <span>{new Date(r.startTime).toLocaleString()}</span>
                                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>Hệ số: {r.distanceFactor} | Trạng thái: {r.status}</div>
                                    </div>
                                    <button className="btn-danger" onClick={() => handleDeleteRace(r.id)}>Xoá</button>
                                </div>
                            ))}
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setIsRaceModalOpen(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TournamentManagementPage;
