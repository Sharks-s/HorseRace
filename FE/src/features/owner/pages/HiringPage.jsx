import React, { useState, useEffect } from "react";
import { registrationApi } from "../../../api/registrationApi";
import { tournamentApi } from "../../../api/tournamentApi";
import { api } from "../../../api/axios";

const HiringPage = () => {
  const [jockeys, setJockeys] = useState([]);
  const [races, setRaces] = useState([]);
  const [myHorses, setMyHorses] = useState([]);

  const [formData, setFormData] = useState({
    raceId: "",
    horseId: "",
    jockeyId: ""
  });

  useEffect(() => {
    fetchJockeys();
    fetchRaces();
    fetchMyHorses();
  }, []);

  const fetchMyHorses = async () => {
    try {
      const res = await api.get("/owner/horses");
      if (res.data && res.data.success) {
        // Only allow APPROVED or REGISTERED horses to be hired / invited
        setMyHorses(res.data.data.filter(h => h.status === 'APPROVED' || h.status === 'REGISTERED'));
      }
    } catch (err) {
      console.error("Error fetching stable", err);
    }
  };

  const fetchJockeys = async () => {
    try {
      const res = await api.get("/users", { params: { role: 'JOCKEY' } });
      if (res.data && res.data.success) {
        setJockeys(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching jockeys", err);
    }
  };

  const fetchRaces = async () => {
    try {
      const tResponse = await tournamentApi.getAllTournaments();
      if (tResponse.success) {
        let allRaces = [];
        for (const t of tResponse.data) {
           const rResponse = await tournamentApi.getRacesByTournament(t.id);
           if (rResponse.success) {
               allRaces = [...allRaces, ...rResponse.data.filter(r => r.status === 'SCHEDULED')];
           }
        }
        setRaces(allRaces);
      }
    } catch (error) {
      console.error("Failed to fetch races", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.raceId || !formData.horseId || !formData.jockeyId) {
        alert("Please fill all fields");
        return;
    }
    
    try {
        const payload = {
            horseId: formData.horseId,
            jockeyId: formData.jockeyId
        };
        const res = await registrationApi.sendInvitation(formData.raceId, payload);
        if (res.success) {
            alert("Invitation sent successfully!");
            setFormData({ raceId: "", horseId: "", jockeyId: "" });
        }
    } catch (err) {
        alert(err.response?.data?.message || "Failed to send invitation");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background text-on-background antialiased py-6">
      <main className="flex-1 p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow border border-outline-variant/30 p-6">
            <h2 className="text-xl font-semibold mb-6">Send Race Invitation</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-on-surface">Select Race</label>
                  <select 
                    className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                    value={formData.raceId}
                    onChange={(e) => setFormData({...formData, raceId: e.target.value})}
                  >
                    <option value="">-- Choose a Race --</option>
                    {races.map(r => (
                        <option key={r.id} value={r.id}>{r.name} - {new Date(r.startTime).toLocaleString()}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-on-surface">Select Your Horse</label>
                  <select 
                    className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                    value={formData.horseId}
                    onChange={(e) => setFormData({...formData, horseId: e.target.value})}
                  >
                    <option value="">-- Choose a Horse --</option>
                    {myHorses.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-on-surface">Select Jockey to Hire</label>
                  <select 
                    className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                    value={formData.jockeyId}
                    onChange={(e) => setFormData({...formData, jockeyId: e.target.value})}
                  >
                    <option value="">-- Choose a Jockey --</option>
                    {jockeys.map(j => (
                        <option key={j.id} value={j.id}>{j.fullName}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                    Send Invitation
                </button>
            </form>
        </div>
      </main>
    </div>
  );
};

export default HiringPage;
