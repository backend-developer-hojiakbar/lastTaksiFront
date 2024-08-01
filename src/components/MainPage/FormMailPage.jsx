import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './FormPage.module.css';

const FormMailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const requestType = params.get('type') || 'pochta_berish';

    const originalWhereOptions = ['toshkent', "bog'dod-rishton-buvayda", "qo'qon", "uchko'prik"];
    const originalWhereToOptions = ['toshkent', "bog'dod-rishton-buvayda", "qo'qon", "uchko'prik"];

    const whereOptions = originalWhereOptions.map(option => option.toUpperCase());
    const whereToOptions = originalWhereToOptions.map(option => option.toUpperCase());

    const [formData, setFormData] = useState({
        request_type: requestType,
        where: originalWhereOptions[0],
        whereTo: originalWhereToOptions[0],
        phone_number: '',
        yolovchiSoni: 1
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value.toLowerCase()
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('https://taksibot.pythonanywhere.com/users/profile/', {
                headers: { Authorization: `JWT ${token}` }
            });
            const userId = response.data.id;

            await axios.post('https://taksibot.pythonanywhere.com/requests/', {
                ...formData,
                user: userId,
                is_active: false
            }, {
                headers: { Authorization: `JWT ${token}` }
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('An error occurred while submitting the request.');
        }
    };

    const handleReturn = () => {
        navigate('/');
    };

    return (
        <div className={styles.formContainer}>
            {!submitted ? (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        Where:
                        <select
                            className={styles.select}
                            name="where"
                            value={formData.where}
                            onChange={handleChange}
                        >
                            {whereOptions.map((option, index) => (
                                <option key={index} value={originalWhereOptions[index]}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.label}>
                        WhereTo:
                        <select
                            className={styles.select}
                            name="whereTo"
                            value={formData.whereTo}
                            onChange={handleChange}
                        >
                            {whereToOptions.map((option, index) => (
                                <option key={index} value={originalWhereToOptions[index]}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.label}>
                        Phone Number:
                        <input
                            className={styles.input}
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    {/* <label className={styles.label}>
                        Number of Passengers:
                        <input
                            className={styles.input}
                            type="number"
                            name="yolovchiSoni"
                            value={formData.yolovchiSoni}
                            onChange={handleChange}
                        />
                    </label> */}
                    <button className={styles.button} type="submit">Submit</button>
                </form>
            ) : (
                <div className={styles.returnContainer}>
                    <p>Your request has been submitted successfully!</p>
                    <button className={styles.button} onClick={handleReturn}>Return to Main Page</button>
                </div>
            )}
        </div>
    );
};

export default FormMailPage;
