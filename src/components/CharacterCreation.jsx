// src/components/CharacterCreation.jsx
import React, { useState } from 'react';
import { User, Dna, Calendar, Check, Users, Briefcase } from 'lucide-react';

export default function CharacterCreation({ onConfirm, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '25',
    gender: 'Male',
    role: '생존자', // 기본값
    traits: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("이름을 입력해주세요.");
    onConfirm(formData);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center tracking-widest">CHARACTER SETUP</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="block text-gray-400 text-sm mb-1 flex items-center gap-2"><User size={16} /> 이름</label>
            <input 
              type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 outline-none"
              placeholder="이름 입력"
            />
          </div>

          <div className="flex gap-4">
            {/* 나이 */}
            <div className="flex-1">
              <label className="block text-gray-400 text-sm mb-1 flex items-center gap-2"><Calendar size={16} /> 나이</label>
              <input 
                type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 outline-none"
              />
            </div>
            {/* 성별 */}
            <div className="flex-1">
              <label className="block text-gray-400 text-sm mb-1 flex items-center gap-2"><Users size={16} /> 성별</label>
              <select 
                value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 outline-none"
              >
                <option value="Male">남성</option>
                <option value="Female">여성</option>
                <option value="Non-binary">기타</option>
              </select>
            </div>
          </div>

          {/* [추가됨] 직업 입력 */}
          <div>
            <label className="block text-gray-400 text-sm mb-1 flex items-center gap-2"><Briefcase size={16} /> 직업 / 역할</label>
            <input 
              type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 outline-none"
              placeholder="Ex: 지휘관, 의사, 용병..."
            />
          </div>

          {/* 특징 */}
          <div>
            <label className="block text-gray-400 text-sm mb-1 flex items-center gap-2"><Dna size={16} /> 특징 / 배경</label>
            <textarea 
              value={formData.traits} onChange={(e) => setFormData({...formData, traits: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 outline-none h-20 resize-none"
              placeholder="Ex: 전직 군인, 요리 실력이 좋음..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-700 text-gray-300 py-3 rounded hover:bg-gray-600 transition">취소</button>
            <button type="submit" className="flex-1 bg-yellow-600 text-white py-3 rounded font-bold hover:bg-yellow-700 transition flex justify-center items-center gap-2">
              <Check size={18}/> 게임 시작
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}