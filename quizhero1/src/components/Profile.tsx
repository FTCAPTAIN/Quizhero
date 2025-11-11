import React, { useState, useEffect } from 'react';
import { currentUser, uploadAvatar, getProfile } from '../lib/api';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const u = currentUser();
    if (u) {
      getProfile(u.uid).then(setProfile).catch(console.error);
    }
  }, []);

  async function handleUpload() {
    if (!file) return alert('Choose file');
    const url = await uploadAvatar(file);
    alert('Uploaded: ' + url);
    const u = currentUser();
    if (u) getProfile(u.uid).then(setProfile);
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold">Profile</h3>
      {profile?.avatar_url && <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 rounded-full" />}
      <div>{profile?.email}</div>
      <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
      <button onClick={handleUpload} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Upload Avatar</button>
    </div>
  );
}