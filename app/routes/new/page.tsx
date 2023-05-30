"use client";
import axios from "@node_modules/axios";
import {useState, useEffect} from "react";

const CreateRoutePage = () => {
    const [name, setName] = useState('');
    const [difficulty, setDifficulty] = useState(0);
    const [restPoints, setRestPoints] = useState([]);

    //
    // @ts-ignore
    const handleRestPointChange = (index, field, value) => {
        const updatedRestPoints = [...restPoints];
        // @ts-ignore
        updatedRestPoints[index][field] = value;
        setRestPoints(updatedRestPoints);
    };

    const handleAddRestPoint = () => {
        // @ts-ignore
        setRestPoints([...restPoints, {name: '', capacity: 0, description: ''}]);
    };

    // @ts-ignore
    const handleRemoveRestPoint = (index) => {
        const updatedRestPoints = [...restPoints];
        updatedRestPoints.splice(index, 1);
        setRestPoints(updatedRestPoints);
    };

    const handleCreateRoute = async () => {
        // Perform API request to create the route with rest points
        const requestData = {
            name,
            difficulty,
            rest_points: restPoints,
        };

        await axios.post('/api/create_route', requestData);

    };


    return (
        <div>
            <h1>Create Route</h1>
            <form>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                </label>
                <label>
                    Difficulty:
                    <input type="number" value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))}/>
                </label>
                <h2>Rest Points</h2>
                {restPoints.map((restPoint, index) => (
                    <div key={index}>
                        <label>
                            Name:
                            <input
                                type="text"

                                value={
                                    //@ts-ignore
                                    restPoint.name}
                                onChange={(e) => handleRestPointChange(index, 'name', e.target.value)}
                            />
                        </label>
                        <label>
                            Capacity:
                            <input
                                type="number"
                                value={
                                    //@ts-ignore
                                    restPoint.capacity}
                                onChange={(e) => handleRestPointChange(index, 'capacity', parseInt(e.target.value))}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={
                                    //@ts-ignore
                                    restPoint.description}
                                onChange={(e) => handleRestPointChange(index, 'description', e.target.value)}
                            ></textarea>
                        </label>
                        <button type="button" onClick={() => handleRemoveRestPoint(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddRestPoint}>Add Rest Point</button>
                <button type="button" onClick={handleCreateRoute}>Create Route</button>
            </form>
        </div>
    );
};

export default CreateRoutePage;
