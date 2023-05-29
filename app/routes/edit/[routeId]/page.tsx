"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

const CreateRoutePage = ({ params }:any) => {
    const [name, setName] = useState('');
    const [difficulty, setDifficulty] = useState(0);
    const [restPoints, setRestPoints] = useState([]);

    useEffect(() => {
        // Fetch existing route data based on params.routeId
        const fetchRouteData = async () => {
            try {
                const response = await axios.get(`/api/routes/${params.routeId}`);
                const routeData = response.data;

                setName(routeData.name);
                setDifficulty(routeData.difficulty);
                setRestPoints(routeData.rest_points);
            } catch (error) {
                console.error('Error fetching route data:', error);
            }
        };
        if (params.routeId) {
            fetchRouteData();
        }
    }, [params.routeId]);


    // @ts-ignore
    const handleRestPointChange = (index, field, value) => {
        const updatedRestPoints = [...restPoints];
        // @ts-ignore
        updatedRestPoints[index][field] = value;
        setRestPoints(updatedRestPoints);
    };

    const handleAddRestPoint = () => {
        // @ts-ignore
        setRestPoints([...restPoints, { name: '', capacity: 0, description: '' }]);
    };
// @ts-ignore
    const handleRemoveRestPoint = (index) => {
        const updatedRestPoints = [...restPoints];
        updatedRestPoints.splice(index, 1);
        setRestPoints(updatedRestPoints);
    };

    const handleCreateOrUpdateRoute = async () => {
        const requestData = {
            name,
            difficulty,
            rest_points: restPoints,
        };

        if (params.routeId) {
            // Perform API request to update the existing route
            await axios.put(`/api/routes/${params.routeId}`, requestData);
        } else {
            // Perform API request to create a new route
            await axios.post('/api/routes', requestData);
        }
    };

    return (
        <div>
            <h1>{params.routeId ? 'Edit Route' : 'Create Route'}</h1>
            <form>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Difficulty:
                    <input
                        type="number"
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    />
                </label>
                <h2>Rest Points</h2>
                {restPoints?.map((restPoint, index) => (

                    <div key={index}>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={restPoint.name}
                                onChange={(e) => handleRestPointChange(index, 'name', e.target.value)}
                            />
                        </label>
                        <label>
                            Capacity:
                            <input
                                type="number"
                                value={restPoint.capacity}
                                onChange={(e) => handleRestPointChange(index, 'capacity', parseInt(e.target.value))}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={restPoint.description}
                                onChange={(e) => handleRestPointChange(index, 'description', e.target.value)}
                            ></textarea>
                        </label>
                        <button type="button" onClick={() => handleRemoveRestPoint(index)}>
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddRestPoint}>
                    Add Rest Point
                </button>
                <button type="button" onClick={handleCreateOrUpdateRoute}>
                    {params.routeId ? 'Update Route' : 'Create Route'}
                </button>
            </form>
        </div>
    );
};

export default CreateRoutePage;
