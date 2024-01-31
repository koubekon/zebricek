
class DatabaseManager {
    constructor(dbName, dbVersion) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
    }

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

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
                items.push({ nazev: input.value, body: 0 });
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

   vypisSeznam(pole) {
    this.pole = pole.map(polozka => new Polozka(polozka.nazev, polozka.body));
    let seznam = document.getElementById("seznam");
        this.pole.sort((a, b) => a.body - b.body);
        for (let i = 0; i < pole.length; i++) {
            let polozkaSeznamu = document.createElement("li");
            polozkaSeznamu.className = "list-group-item border-0 round";
            polozkaSeznamu.id = "polozka-" + i;
            polozkaSeznamu.textContent = pole[i];
            seznam.appendChild(polozkaSeznamu);
        }
    }
    
}


class Polozka {
    constructor(nazev, body) {
        this.nazev = nazev;
        this.body = body;

    }
    pridejBod() {
        this.body++;
    }
}

