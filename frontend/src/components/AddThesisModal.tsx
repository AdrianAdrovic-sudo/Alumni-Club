import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface AddThesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const AddThesisModal: React.FC<AddThesisModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showNewUserForm, setShowNewUserForm] = useState(false);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'bachelors' | 'masters' | 'specialist'>('bachelors');
  const [year, setYear] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [mentor, setMentor] = useState('');
  const [committeeMembers, setCommitteeMembers] = useState('');
  const [grade, setGrade] = useState('');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [language, setLanguage] = useState('');
  const [abstract, setAbstract] = useState('');

  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserEnrollmentYear, setNewUserEnrollmentYear] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchUsers();
    }
  }, [isOpen, isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Greška pri učitavanju korisnika:', error);
    }
  };

  const handleClose = () => {
    setTitle('');
    setType('bachelors');
    setYear('');
    setFileUrl('');
    setMentor('');
    setCommitteeMembers('');
    setGrade('');
    setTopic('');
    setKeywords('');
    setLanguage('');
    setAbstract('');
    setSelectedUserId(null);
    setShowNewUserForm(false);
    setNewUserFirstName('');
    setNewUserLastName('');
    setNewUserEmail('');
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserEnrollmentYear('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userId = selectedUserId;

      if (isAdmin && showNewUserForm) {
        const newUserResponse = await axios.post('/api/auth/register', {
          first_name: newUserFirstName,
          last_name: newUserLastName,
          email: newUserEmail,
          username: newUserUsername,
          password: newUserPassword,
          enrollment_year: parseInt(newUserEnrollmentYear),
        });
        userId = newUserResponse.data.user.id;
      } else if (!isAdmin) {
        userId = user?.id || null;
      }

      if (!userId) {
        alert('Morate izabrati korisnika ili kreirati novog');
        setLoading(false);
        return;
      }

      const thesisData = {
        first_name: isAdmin && !showNewUserForm 
          ? users.find(u => u.id === userId)?.first_name 
          : showNewUserForm ? newUserFirstName : user?.first_name,
        last_name: isAdmin && !showNewUserForm 
          ? users.find(u => u.id === userId)?.last_name 
          : showNewUserForm ? newUserLastName : user?.last_name,
        title,
        type,
        year: year ? parseInt(year) : null,
        file_url: fileUrl,
        mentor: mentor || null,
        committee_members: committeeMembers || null,
        grade: grade || null,
        topic: topic || null,
        keywords: keywords || null,
        language: language || null,
        abstract: abstract || null,
        user_id: userId,
      };

      await axios.post('/api/theses', thesisData);
      alert('Rad je uspješno dodat!');
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Greška pri dodavanju rada:', error);
      alert(error.response?.data?.message || 'Greška pri dodavanju rada');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Dodaj diplomski rad</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isAdmin && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-lg text-[#294a70] mb-3">Izbor alumniste</h3>
              
              <div className="flex gap-3 mb-4">
                <button type="button" onClick={() => setShowNewUserForm(false)} className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${!showNewUserForm ? 'bg-[#294a70] text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300'}`}>
                  Izaberi postojećeg
                </button>
                <button type="button" onClick={() => setShowNewUserForm(true)} className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${showNewUserForm ? 'bg-[#294a70] text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300'}`}>
                  Dodaj novog
                </button>
              </div>

              {!showNewUserForm ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alumnista</label>
                  <select value={selectedUserId || ''} onChange={(e) => setSelectedUserId(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" required>
                    <option value="">Izaberite alumnistu</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.email})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ime *</label>
                      <input type="text" value={newUserFirstName} onChange={(e) => setNewUserFirstName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Prezime *</label>
                      <input type="text" value={newUserLastName} onChange={(e) => setNewUserLastName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Korisničko ime *</label>
                    <input type="text" value={newUserUsername} onChange={(e) => setNewUserUsername(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Lozinka *</label>
                    <input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Godina upisa *</label>
                    <input type="number" value={newUserEnrollmentYear} onChange={(e) => setNewUserEnrollmentYear(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" required />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-[#294a70] mb-3">Podaci o radu</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Naziv rada *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tip rada *</label>
                  <select value={type} onChange={(e) => setType(e.target.value as 'bachelors' | 'masters' | 'specialist')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" required>
                    <option value="bachelors">Osnovne studije</option>
                    <option value="masters">Master studije</option>
                    <option value="specialist">Specijalističke studije</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Godina</label>
                  <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" placeholder="2024" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Link na rad (PDF)</label>
                <input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" placeholder="https://example.com/rad.pdf" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mentor</label>
                <input type="text" value={mentor} onChange={(e) => setMentor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" placeholder="Prof. dr Ivan Petrović" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Članovi komisije</label>
                <input type="text" value={committeeMembers} onChange={(e) => setCommitteeMembers(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" placeholder="Prof. dr Ivan Petrović, Doc. dr Ana Jovanović" />
                <p className="text-xs text-gray-500 mt-1">Odvojite zarezom</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ocjena</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]">
                    <option value="">Izaberite ocjenu</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Jezik</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]">
                    <option value="">Izaberite jezik</option>
                    <option value="en">English</option>
                    <option value="cg">Crna Gora</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tema</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" placeholder="Machine Learning" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ključne riječi</label>
                <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" placeholder="AI, Machine Learning, Deep Learning" />
                <p className="text-xs text-gray-500 mt-1">Odvojite zarezom</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sažetak (Abstract)</label>
                <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]" rows={4} placeholder="Ovaj rad istražuje..." />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={handleClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
              Otkaži
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-[#294a70] text-white rounded-lg font-semibold hover:bg-[#1f3a5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Dodavanje...' : 'Dodaj rad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddThesisModal;
