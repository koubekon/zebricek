
class DatabaseManager {
    constructor(dbName, dbVersion) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
    }

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
//sem doplnit mazání nebo zapisování do jiné tabulky
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('items')) {
                    db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = event => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = event => {
                console.error('Database error:', event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    }

    pridejPolozky() {
        return new Promise((resolve, reject) => {
            const items = [];
            const inputElements = document.querySelectorAll("#myForm input");
            inputElements.forEach(input => {
                if (input.value) {  
                items.push({ nazev: input.value, body: 0 });
            }
            });

            // Ensure the database is initialized
            if (!this.db) {
                reject('Database not initialized');
                return;
            }

            const transaction = this.db.transaction(["items"], "readwrite");
            const objectStore = transaction.objectStore("items");
            console.log(items);
            items.forEach(item => objectStore.add(item));

            transaction.oncomplete = () => {
                console.log("Items successfully saved to IndexedDB.");
                resolve();
            };

            transaction.onerror = error => {
                console.error("Error saving to IndexedDB:", error);
                reject(error);
            };
        });
    }

    nactiData() {
        return new Promise((resolve, reject) => {
            let openRequest = indexedDB.open('zebricek', 1);

            openRequest.onupgradeneeded = () => {
                // Pokud databáze ještě neexistuje, vytvoří se
                openRequest.result.createObjectStore('items', { keyPath: 'id' });
            };

            openRequest.onerror = () => {
                reject(openRequest.error);
            };

            openRequest.onsuccess = () => {
                let db = openRequest.result;
                let transaction = db.transaction('items', 'readonly');
                let store = transaction.objectStore('items');
                let request = store.getAll();

                request.onerror = () => {
                    reject(request.error);
                };

                request.onsuccess = () => {
                    resolve(request.result);
                };
            };
        });
    }

    odesliData(poleAktualizaci) {
        return new Promise((resolve, reject) => {
            // Ensure the database is initialized
            if (!this.db) {
                reject('Database not initialized');
                return;
            }
    
            const transaction = this.db.transaction(["items"], "readwrite");
            const objectStore = transaction.objectStore("items");
    
            // Projdeme všechny položky v poli aktualizace
            poleAktualizaci.forEach(function(itemToUpdate) {
                console.log(itemToUpdate);
                const getRequest = objectStore.get(itemToUpdate.nazev);

                getRequest.onsuccess = function(event) {
                    console.log("fired", event.target);
                    const data = event.target.result;
                    console.log(data);
    
                    if (data) {
                        // Aktualizace hodnoty "body" na základě hodnoty v poli aktualizace
                        console.log("data.body", data.body)
                        data.body = itemToUpdate.body;
    
                        // Uložení aktualizované položky zpět do objektového obchodu
                        const updateRequest = objectStore.put(data);
    
                        updateRequest.onsuccess = function() {
                            console.log("Body successfully updated for item:", itemToUpdate.nazev);
                        };
    
                        updateRequest.onerror = function(event) {
                            console.error("Error updating body for item:", itemToUpdate.nazev);
                            reject(event.target.error);
                        };
                    } else {
                        reject(`Item with name '${itemToUpdate.nazev}' not found`);
                    }
                };
    
                getRequest.onerror = function(event) {
                    console.error("Error fetching item:", event.target.error);
                    reject(event.target.error);
                };
            });
    
            transaction.oncomplete = function() {
                console.log("Bodies successfully updated for all items");
                resolve();
            };
    
            transaction.onerror = function(event) {
                console.error("Error updating bodies for items:", event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    

   vypisSeznam(pole) {
    this.pole = pole.map(polozka => new Polozka(polozka.nazev, polozka.body));
    let seznam = document.getElementById("seznam");
        this.pole.sort((a, b) => a.body - b.body);
        for (let i = 0; i < pole.length; i++) {
            let polozkaSeznamu = document.createElement("li");
            polozkaSeznamu.className = "list-group-item border-0 round";
            polozkaSeznamu.id = "polozka-" + i;
            polozkaSeznamu.textContent = pole[i].nazev;
            seznam.appendChild(polozkaSeznamu);
        }
    }
    
}


