import React, { useState, useEffect } from "react";
import { registrationApi } from "../../../api/registrationApi";

const InvitationPage = () => {
  const [invitations, setInvitations] = useState([]);
  
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.id) {
          fetchInvitations(user.id);
        }
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
      }
    }
  }, []);

  const fetchInvitations = async (jockeyId) => {
    try {
      const res = await registrationApi.getJockeyInvitations(jockeyId);
      if (res.success) {
          setInvitations(res.data);
      }
    } catch (err) {
      console.error("Error fetching invitations", err);
    }
  };

  const handleRespond = async (id, accept) => {
      try {
          const res = await registrationApi.respondToInvitation(id, accept);
          if (res.success) {
              alert(`Invitation ${accept ? 'accepted' : 'declined'}`);
              const userStr = localStorage.getItem("user");
              if (userStr) {
                const user = JSON.parse(userStr);
                if (user.id) {
                  fetchInvitations(user.id);
                }
              }
          }
      } catch (err) {
          alert(err.response?.data?.message || "Failed to respond");
      }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background text-on-background antialiased">
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center px-6 h-16 z-10 shrink-0">
        <h1 className="text-2xl font-bold tracking-tighter text-secondary" style={{ fontFamily: "'Oswald', sans-serif" }}>
          My Invitations
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
        {invitations.length === 0 ? (
            <p className="text-on-surface-variant text-center mt-10">You have no pending invitations.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {invitations.map(inv => (
                    <div key={inv.id} className="bg-surface-container-lowest p-4 rounded-xl shadow border border-outline-variant/30 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">{inv.raceName}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${inv.status === 'PENDING_JOCKEY' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                                {inv.status}
                            </span>
                        </div>
                        <div className="text-sm text-on-surface-variant">
                            <p>Horse: <span className="font-medium text-on-surface">{inv.horseName}</span></p>
                        </div>
                        
                        {inv.status === 'PENDING_JOCKEY' && (
                            <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-outline-variant/30">
                                <button 
                                    onClick={() => handleRespond(inv.id, false)}
                                    className="px-3 py-1.5 text-xs font-semibold text-error hover:bg-error-container/20 rounded"
                                >
                                    Decline
                                </button>
                                <button 
                                    onClick={() => handleRespond(inv.id, true)}
                                    className="px-3 py-1.5 text-xs font-semibold bg-[#004225] text-white rounded hover:opacity-90"
                                >
                                    Accept
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default InvitationPage;
