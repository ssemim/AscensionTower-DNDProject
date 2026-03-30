/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InformationModal from '../../components/Modal/InformationModal';

const API = 'http://localhost:8081';

const GalleryItem = ({ member, onOpenModal }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative bg-main border transition-all duration-300 p-4 flex flex-col h-full group
        ${isHovered ? 'border-primary shadow-stark-glow' : 'border-border-primary/30 shadow-sm'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute top-2 right-2 px-2 py-0.5 text-[14px] font-black uppercase tracking-widest transition-opacity duration-300 ${isHovered ? 'opacity-100 bg-primary text-white' : 'opacity-0'}`}>
        Selected
      </div>

      <div className="aspect-square bg-primary/5 mb-4 overflow-hidden relative">
        <img 
          src={member.image_url ? `${API}${member.image_url}` : ''} 
          alt={member.char_name} 
          className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 grayscale-0' : 'grayscale brightness-95'}`}
        />
        <div className={`absolute inset-0 bg-primary/5 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      <div className="flex-1">
        <h3 className={`text-lg font-black italic tracking-tighter uppercase transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-text-main'}`}>
          {member.char_name}
        </h3>
        <p className="text-[10px] text-text-main/60 font-bold tracking-widest mt-1">SN: {member.serial}</p>
      </div>

      <button 
        onClick={() => onOpenModal(member)}
        className={`mt-6 w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border
          ${isHovered 
            ? 'bg-primary border-primary text-white dark:shadow-lg dark:shadow-primary/20' 
            : 'bg-transparent border-border-primary/30 text-text-main/50 hover:border-primary hover:text-primary'}
        `}
      >
        View Details
      </button>

      <div className={`absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-primary transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

export default function Member() {
  const [activeTab, setActiveTab] = useState('AKERO');
  const [members, setMembers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleOpenModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API}/members`, { withCredentials: true });
        if (res.data.Status === 'Success') {
          const data = res.data.members;
          setMembers(data);
          // position 목록 중복 제거 (null 제외)
          const uniquePositions = [...new Set(data.map(m => m.position).filter(Boolean))];
          setPositions(uniquePositions);
        }
      } catch (err) {
        console.error('멤버 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

const tabs = ['AKERO', 'MERKI', 'MAEBAM', 'HASHA'];

const filteredMembers = activeTab === 'AKERO'
  ? members
  : members.filter(m => m.position === activeTab);

  return (
    <div className="min-h-screen bg-main text-text-main font-mono p-10 selection:bg-primary/20 selection:text-primary">
      <div className="fixed inset-0 pointer-events-none bg-stark-grid opacity-100" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-2 border-border-primary/20 pb-6">
          <div className="flex gap-12 flex-wrap">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-2 text-xs font-black tracking-[0.3em] uppercase transition-all
                  ${activeTab === tab ? 'text-primary' : 'text-text-main/40 hover:text-text-main/80'}
                `}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute -bottom-[26px] left-0 w-full h-[2px] bg-primary"></span>
                )}
                <span className="absolute -top-4 left-0 text-[8px] opacity-40">{String(index + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-4 text-[10px] font-bold text-text-main/40">
            <span className="tracking-widest italic uppercase">Access_Level: Security_04</span>
            <div className="flex gap-1 items-center">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-primary/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMembers.map((member) => (
              <GalleryItem
                key={member.id}
                member={member}
                onOpenModal={handleOpenModal}
              />
            ))}
          </div>
        )}

        <footer className="mt-20 pt-8 border-t border-border-primary/20 flex justify-between items-center text-[9px] font-bold text-text-main/40 uppercase tracking-widest">
          <div className="flex gap-8">
            <p>ASCENSION TOWER : v2.4.0</p>
            <p>Sync_Status: Optimized</p>
          </div>
          <div className="flex gap-4">
            <span>Server: **_WEST_04</span>
            <span>Auth_Token: Valid // 14:02_C</span>
          </div>
        </footer>
      </div>
      {isModalOpen && selectedMember && (
        <InformationModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          moduleName={selectedMember.char_name}
          moduleId={selectedMember.serial}
          clearance={selectedMember.position}
        />
      )}
    </div>
  );
}