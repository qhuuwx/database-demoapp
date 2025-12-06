import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import contentService from '../services/contentService';

function ContentsPage() {
  const { user, token } = useContext(AuthContext);
  const [contents, setContents] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    contentService.getContents(token).then(setContents).catch(() => setError('Không lấy được nội dung'));
  }, [token]);

  const handleCreate = async () => {
    await contentService.createContent({ Title: title, Body: body }, token);
    setTitle(''); setBody('');
    contentService.getContents(token).then(setContents);
  };
  const handleUpdate = async (id) => {
    const newTitle = prompt('Tiêu đề mới:');
    const newBody = prompt('Nội dung mới:');
    await contentService.updateContent(id, { Title: newTitle, Body: newBody }, token);
    contentService.getContents(token).then(setContents);
  };
  const handleDelete = async (id) => {
    await contentService.deleteContent(id, token);
    contentService.getContents(token).then(setContents);
  };

  return (
    <div>
      <h2>Danh sách nội dung</h2>
      {error && <p>{error}</p>}
      {(user.VaiTro === 'NhanVien') && (
        <div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề" />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Nội dung" />
          <button onClick={handleCreate}>Tạo mới</button>
        </div>
      )}
      <ul>
        {contents.map(c => (
          <li key={c.Id}>
            <b>{c.Title}</b> - {c.Body} (Tạo bởi: {c.CreatedBy})
            {(user.VaiTro === 'NhanVien' && c.CreatedBy === user.MaTaiKhoan) && (
              <>
                <button onClick={() => handleUpdate(c.Id)}>Sửa</button>
                {user.VaiTro === 'NhanVien' && <button onClick={() => handleDelete(c.Id)}>Xóa</button>}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ContentsPage;
