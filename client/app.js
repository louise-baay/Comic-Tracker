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

const API_URL = "http://localhost:3000/api";

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
                    "Content-Type": "application/json"
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

    async function updateComic() {
        if(!selectedComic){
            setMessage("Select a comic first.");
            return;
        }

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

            const response = await fetch(`${API_URL}/${selectedComic.id}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            setMessage(data.status || data.error || "Update request completed.");
            clearForm();
            fetchAllComics();
        } catch (error){
            setMessage("Failed to update comic.");
        }
    }

    async function deleteComic(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`,{
                method: "DELETE"
            });

            const data = await response.json();
            setMessage(data.status || data.error || "Delete request completed.");

            if(selectedComic && selectedComic.id === id){
                clearForm();
            }

            fetchAllComics();
        } catch (error){
            setMessage("Failed to delete comic.");
        }
    }

    async function deleteAllComics(){
        try {
            const response = await fetch(API_URL,{
                method: "DELETE"
            });

            const data = await response.json();
            setMessage(data.status || data.error || "Delete collection completed.");
            clearForm();
            fetchAllComics();
        } catch(error){
            setMessage("Failed to delete collection.");
        }
    }
    
    async function replaceCollection() {
        try {
            const parsed = JSON.parse(replaceText);

            const response = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(parsed)
            });

            const data = await response.json();
            setMessage(data.status || data.error || "Replace collection completed.");
            setReplaceText("");
            clearForm();
            fetchAllComics();
        } catch (error) {
            setMessage("Replace collection failed. Make sure the JSON is valid.");
        }
    }

    function confirmDeleteAll(){
        if (typeof window !== "undefined"){
            const ok = window.confirm("Are you sure you want to delete the entire collection?");
            if (ok) deleteAllComics();
        } else {
            Alert.alert("Confirm", "Are you sure you want to delete the entire collection?",[
                { text: "Cancel", style: "cancel"},
                { text: "Delete", style: "destructive", onPress: deleteAllComics }
            ]);
        }
    }

    function renderComic({ item }){
        return (
            <TouchableOpacity style={styles.card} onPress={() => getComicById(item.id)}>
                <View style = {{ flex: 1 }}>
                    <Text style={styles.cardTitle}> {item.seriesTitle} #{item.issueNumber} </Text>
                    <Text style={styles.cardText}>Publisher: {item.publisher}</Text>
                    <Text style={styles.cardText}>Condition: {item.condition}</Text>
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
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
                        keyboardType="numeric"
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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Replace Entire Collection</Text>
                    <TextInput
                        style={styles.largeInput}
                        placeholder='Paste JSON array here, e.g [{"seriesTitle":"X-Men","issueNumber":1,"publisher":"Marvel","condition":"NM","storageLocation":"Box 2","estimatedValue":25.5,"lentOut":0}]'
                        multiline
                        value={replaceText}
                        onChangeText={setReplaceText}
                    />
                    <TouchableOpacity style={styles.button} onPress={replaceCollection}>
                        <Text style={styles.buttonText}>Replace Collection</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <View style={styles.listHeaderRow}>
                        <Text style={styles.sectionTitle}>Comic Collection</Text>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.smallButton} onPress={fetchAllComics}>
                                <Text style={styles.buttonText}>Refresh</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dangerButton} onPress={confirmDeleteAll}>
                                <Text style={styles.buttonText}>Delete All</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <FlatList
                    data={comics}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderComic}
                    scrollEnabled={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No comics in collection.</Text>
                    }
                    />
                </View>

                {message ? <Text style={styles.message}>{message}</Text> : null}                
            </ScrollView>
        </SafeAreaViewBase>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#f4f6f8"
    },
    scrollContent: {
        padding: 20
    },
    header: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 4,
        color: "#1f2937"
    },
    subHeader: {
        fontSize: 16,
        color: "#4b5563"
    },
    section: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#d1d5db"
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 12,
        color: "#111827"
    },
    input: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fff"
    },
    largeInput: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        padding:10,
        minHeight: 120,
        textAlignVertical: "top",
        marginBottom: 10,
        backgroundColor: "#fff"
    },
    row: {
        flexDirection: "row",
        gap: 10
    },
    button: {
        backgroundColor: "#2563eb",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 8
    },
    secondaryButton: {
        backgroundColor: "#e5e7eb",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4
    },
    dangerButton: {
        backgroundColor: "#dc2626",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 8
    },
    deleteButton: {
        backgroundColor: "#dc2626",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: "center"
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "600"
    },
    secondaryButtonText: {
        color: "#111827",
        fontWeight: "600"
    },
    listHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
        color: "#111827"
    },
    cardText: {
        fontSize: 14,
        color: "#374151",
        marginBottom: 2
    },
    emptyText: {
        color: "#6b7280",
        fontStyle: "italic"
    },
    message: {
        fontSize: 15,
        color: "#065f46",
        backgroundColor: "#d1fae5",
        borderWidth: 1,
        borderColor: "#a7f3d0",
        borderRadius: 8,
        padding: 12
    }
});
