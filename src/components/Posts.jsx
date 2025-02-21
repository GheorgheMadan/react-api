import { useEffect, useState } from "react"
import axios from "axios"

// Card.jsx
export default function Cards() {

    // initialForm è un oggetto che rappresenta un articolo vuoto
    const initialForm = {
        title: '',
        image: '',
        content: '',
        tags: [],
        available: false // per gestire se l'articolo è pubblico o privato, inizialemnte privato 
    }
    // data contiene la lista degli articoli, inizialmente è l'array articles
    const [data, setData] = useState([])

    // formData contiene i dati del nuovo articolo, inizialmente con un articolo vuoto
    // formData: Stato che contiene i dati dell’articolo che l'utente sta compilando
    const [formData, setFormData] = useState(initialForm)

    // Funzione per recuperare i dati dei post dal server
    function fetchPosts() {
        axios.get('http://localhost:3000/posts') // Effettua una richiesta HTTP GET all'endpoint specificato
            .then((res) => setData(res.data)
            ) // Se la richiesta ha successo, aggiorna lo stato con i dati ricevuti
            .catch((err) => console.error("Errore nel fetch:", err)); // Se c'è un errore, lo stampa nella console
    }
    // useEffect viene usato per eseguire codice quando il componente viene montato
    useEffect(() => {
        fetchPosts(); // Chiama la funzione fetchPosts() appena il componente viene caricato
    }, []) // Il secondo argomento, un array vuoto [], fa sì che questa funzione venga eseguita solo al primo render



    // Questa funzione aggiorna lo stato formData quando l'utente compila i campi del modulo.
    const handleFormData = (e) => {

        // devo capire se l’utente sta scrivendo in un campo di testo o se sta cliccando sulla casella
        // Controlla se l'input è una checkbox.
        const value = e.target.type === 'checkbox'
            // Se l'input è una checkbox, usa e.target.checked per ottenere un valore booleano (true/false). 
            ?
            e.target.checked
            // Se non è una checkbox, usa e.target.value per ottenere il valore del campo (ad esempio, il testo scritto).
            : e.target.value

        // Aggiorna lo stato formData mantenendo i valori esistenti e aggiornando solo il campo modificato
        setFormData({
            // Lo spread operator (...) copia tutte le proprietà dell'oggetto formData nell'oggetto che stai creando all'interno della funzione setFormData.
            ...formData,
            [e.target.name]: value
        });
    };

    // Funzione che aggiunge un nuovo articolo alla lista quando l'utente invia il form
    const addArticle = (e) => {
        e.preventDefault(); // Evita il ricaricamento della pagina al submit del form

        // // Aggiunge il nuovo articolo alla lista, assegnando un nuovo id incrementale
        // setData((currentList) => [
        //     // L'operatore spread (...) crea una copia superficiale della lista attuale degli articoli. In questo modo, non stiamo modificando direttamente lo stato, ma creando un nuovo array che contiene gli articoli esistenti
        //     ...currentList,

        //     // Questo codice calcola il nuovo id per l'articolo. Se ci sono già articoli nella lista (currentList.length > 0), prende l'ID dell'ultimo articolo e lo incrementa di 1. Se non ci sono articoli (cioè currentList.length === 0), assegna l'ID 1 al nuovo articolo.
        //     { id: currentList.length > 0 ? currentList[currentList.length - 1].id + 1 : 1, ...formData }
        // ]);
        axios.post('http://localhost:3000/posts', formData) // Effettua una richiesta POST per aggiungere un nuovo articolo sul server, passando i dati del form (formData)
            .then((res) => {
                // Una volta che la risposta è ricevuta con successo, aggiorniamo lo stato data
                // Aggiungiamo il nuovo articolo (res.data) alla lista esistente di articoli
                setData((currentPosts) => [...currentPosts, res.data])
            })
            .catch(err => console.log(err) // Se c'è un errore nella richiesta, lo stampiamo nella console
            )
        // All'invio del form questo lo resetta tornando allo stato iniziale
        setFormData(initialForm);
    };

    // Funzione per rimuovere un articolo dalla lista
    function deleteArticle(articleId) {
        // Usa il metodo filter() per creare una nuova lista di articoli che non contenga l'articolo con l'ID specificato.
        const updatedArticles = data.filter((article) => {
            return article.id !== articleId
        })
        // Aggiorna lo stato con la nuova lista usando setData()
        setData(updatedArticles)
    }

    return (
        <>
            <h1>LISTA POST</h1>
            {/* con onSubmit richiamo la funzione dell'invio del form */}
            <form onSubmit={addArticle}>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    placeholder="inserisci il titolo"
                    // Quando l'utente digita nel campo di input, la funzione handleFormData viene chiamata e aggiorna lo stato del form.
                    onChange={handleFormData}
                    required
                />
                <input
                    type="text"
                    name="image"
                    value={formData.image}
                    placeholder="inserisci il link dell'immagine"
                    // Quando l'utente digita nel campo di input, la funzione handleFormData viene chiamata e aggiorna lo stato del form.
                    onChange={handleFormData}
                    required
                />
                <textarea
                    name="content"
                    placeholder="inserisci il contenuto"
                    value={formData.content}
                    // Quando l'utente digita nel campo di input, la funzione handleFormData viene chiamata e aggiorna lo stato del form.
                    onChange={handleFormData}
                    required
                >
                </textarea>
                <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    placeholder="inserisci i tag"
                    // Quando l'utente digita nel campo di input, la funzione handleFormData viene chiamata e aggiorna lo stato del form.
                    onChange={handleFormData}
                    required
                />
                <button
                    type="submit"
                >INVIA
                </button>
                <label htmlFor="available">Pubblico</label>
                <input
                    type="checkbox"
                    checked={formData.available}
                    // Quando l'utente digita nel campo di input, la funzione handleFormData viene chiamata e aggiorna lo stato del form.
                    onChange={handleFormData}
                    name="available"
                    id="available"
                />
            </form >
            <button
                onClick={() => fetchPosts()}
            >
                Fetch Posts
            </button>
            {data.length === 0 ? <div className="not-found">Nessun post disponibile</div> :
                <div className="container-cards">
                    {data.map((post) => (
                        <div className="card" key={post.id}>
                            <h2>{post.title}</h2>
                            <img src={post.image} alt={post.title} />
                            <p>{post.content}</p>
                            <span>{post.tags}</span><br />
                            <span className={post.available ? 'public' : 'private'}>{post.available ? 'Pubblico' : 'Privato'}</span>
                            {/* è un evento che viene attivato quando l'utente fa clic sul pulsante "X" per eliminare un articolo. */}
                            <button onClick={() => deleteArticle(post.id)}>
                                X
                            </button>
                        </div>

                    ))}
                </div>
            }
        </>
    )
}