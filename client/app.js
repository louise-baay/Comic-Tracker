import React, { useEffect, useState } from "react";
import {
    Text,
    TextInput,
    StyleSheet,
    ScrollView
} from "react-native";

const API_URL = "https://localhost:3000/api";

const emptyForm = {
    seriesTitle: "",
    issueNumber: "",
    publisher: "",
    condition: "",
    storageLocation: "",
    estimatedValue: "",
    lentOut: "0"
};


export default function App(){
    const [comics, setComics] = useState([]);
    const [selectedComic, setSelectedComic] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [replaceText, setReplaceText] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchAllComics();
    }, []);

    async function fetchAllComics() {
        try{
            const response = await fetch(API_URL);
            const data = await response.json();
            setComics(data);
        } catch (error) {
            setMessage("Could not fetch comics.");
        }
    }

    function updateForm(field, value){
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    function clearForm(){
        setForm(emptyForm);
        setSelectedComic(null);
    }

    //create comic
    async function createComic(){
        try{
            const payload = {
                seriesTitle: form.seriesTitle,
                issueNumber: parseInt(form.issueNumber),
                publisher: form.publisher,
                condition: form.condition,
                storageLocation: form.storageLocation,
                estimatedValue: parseFloat(form.estimatedValue),
                lentOut: parseInt(form.lentOut);
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "applications/json"
                },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            setMessage(data.status || data.error || "Create requests completed.");
            clearForm();
            fetchAllComics();
        } catch (error) {
            setMessage("Failed to create comic.");
        }
    }

    try{
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if(data.error){
            setMessage()
        }
    }

}

const styles = StyleSheet.create({
    
});