// pages/index.tsx
"use client";
import { useEffect, useState } from 'react';
import Registration from './components/Registration/registration'
// import  './globals.module.css'
import styles from './components/EmailVerification.module.css';

interface User {
  _id: string;
  name: string;
  email: string;
}

const HomePage = () => {
  const [users, setUsers] = useState<User[]>([]);

 

  return (
    <div>
      <div><Registration/></div>

     

    </div>
  );
};

export default HomePage;