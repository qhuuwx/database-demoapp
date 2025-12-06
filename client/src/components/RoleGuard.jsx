import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function RoleGuard({ allowedRoles, children }) {
  const { user } = useContext(AuthContext);
  if (!user || !allowedRoles.includes(user.VaiTro)) {
    return <div>Không có quyền truy cập</div>;
  }
  return children;
}
export default RoleGuard;
