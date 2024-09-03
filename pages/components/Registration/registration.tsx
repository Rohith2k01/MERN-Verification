// components/RegistrationForm.tsx

"use client"; // This marks the component as a Client Component

import { useRouter } from 'next/navigation';

import React, { useState } from 'react';
import styles from './registration.module.css';  // Import the CSS module

// Define types for form data and errors
type FormData = {
  name: string;
  email: string;
  phone: string;
  aadhar: string;
  dob: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  aadhar?: string;
  dob?: string;
};

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    aadhar: '',
    dob: '',
  });

  const router = useRouter()
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = (): boolean => {
    let tempErrors: FormErrors = {};
    let valid = true;

    if (!formData.name) {
      tempErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email) {
      tempErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address is invalid';
      valid = false;
    }

    if (!formData.phone) {
      tempErrors.phone = 'Phone Number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = 'Phone Number is invalid';
      valid = false;
    }

    if (!formData.aadhar) {
      tempErrors.aadhar = 'Aadhar Number is required';
      valid = false;
    } else if (!/^\d{12}$/.test(formData.aadhar)) {
      tempErrors.aadhar = 'Aadhar Number is invalid';
      valid = false;
    }

    if (!formData.dob) {
      tempErrors.dob = 'Date of Birth is required';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form Data Submitted:', formData);
      // Handle form submission, e.g., send data to the server
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Phone Number</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Aadhar Number</label>
        <input
          type="text"
          name="aadhar"
          value={formData.aadhar}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.aadhar && <p className={styles.error}>{errors.aadhar}</p>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.dob && <p className={styles.error}>{errors.dob}</p>}
      </div>

      <button type="submit" onClick={()=>{router.push('/reistration_page')}} className={styles.submitButton}>
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
