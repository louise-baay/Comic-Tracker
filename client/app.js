import React, { useEffect, useState } from "react";
import {
    SafeAreaViewBase,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    ScrollView
} from "react-native";
import { getComicById } from "../api/model";

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
                lentOut: parseInt(form.lentOut)
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





    function renderComic({ item }){
        return (
            <TouchableOpacity style={styles.card} onPress={() => getComicById(item.id)}>
                <View style = {{ flex: 1 }}>
                    <Text style={styles.cardTitle}> {item.seriesTitle} #{item.issueNumber} </Text>
                    <Text style={styles.cardText}>Publisher: {item.publisher}</Text>
                    <Text style={styles.cardText}>Conditon: {item.condition}</Text>
                    <Text style={styles.cardText}>Location: {item.storageLocation}</Text>
                    <Text style={styles.cardText}>Value: ${item.estimatedValue}</Text>
                    <Text style={styles.cardText}>Lent Out: {item.lentOut === 1 ? "Yes" : "No"}</Text>
                </View>

                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteComic(item.id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    
});