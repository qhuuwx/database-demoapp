import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function HomePage() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h2>Chào mừng đến Web Demo!</h2>
    </div>
  );
}
export default HomePage;
