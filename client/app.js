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

    async function getComicById(id){
        try{
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();

            if(data.error){
                setMessage(data.error);
                return;
            }

            setSelectedComic(data);
            setForm({
                seriesTitle: data.seriesTitle.toString(),
                issueNumber: data.issueNumber.toString(),
                publisher: data.publisher.toString(),
                condition: data.condition.toString(),
                storageLocation: data.storageLocation.toString(),
                estimatedValue: data.estimatedValue.toString(),
                lentOut: data.lentOut.toString()
            });
            setMessage(`Loaded comic id=${id}`);
        } catch (error){
            setMessage(`Failed to load comic id.`);
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


    return(
        <SafeAreaViewBase style={styles.container}>
            <ScrollView>
                <Text style={styles.header}>ComicShelf</Text>
                <Text style={styles.subHeader}>Physical Comic Library Tracker</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {selectedComic ? `Edit Comic (id=${selectedComic.id})` : "Add Comic"}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Series Title"
                        value={form.seriesTitle}
                        onChangeText={(text) => updateForm("seriesTitle", text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Issue Number"
                        value = {form.issueNumber}
                        onChangeText={(text) => updateForm("issueNumber", text)}                    
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Publisher"
                        value = {form.publisher}
                        onChangeText={(text) => updateForm("publisher", text)}  
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Condition"
                        value = {form.condition}
                        onChangeText={(text) => updateForm("condition", text)}  
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Storage Location"
                        value = {form.storageLocation}
                        onChangeText={(text) => updateForm("storageLocation", text)}  
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Estimated Value"
                        keyboardType="numeric"
                        value = {form.estimatedValue}
                        onChangeText={(text) => updateForm("estimatedValue", text)}  
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Lent Out? 0 = No, 1 = Yes"
                        keyboardType="numeric"
                        value = {form.lentOut}
                        onChangeText={(text) => updateForm("lentOut", text)}  
                    />

                    <View style={styles.row}>
                        {!selectedComic ? (
                            <TouchableOpacity style={styles.button} onPress={createComic}>
                                <Text style={styles.buttonText}>Add Comic</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={updateComic}>
                                <Text style={styles.buttonText}>Save Changes</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.secondaryButton} onPress={clearForm}>
                            <Text style={styles.secondaryButtonText}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                
            </ScrollView>






        </SafeAreaViewBase>
    )
}

const styles = StyleSheet.create({
    
});