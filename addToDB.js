
class DatabaseManager {
    constructor(dbName, tableName, dbVersion) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.tableName = tableName;
        this.tableNum = 1;
    }
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('items')) {
                    db.createObjectStore('items', { keyPath: 'nazev', autoIncrement: false });
                }
                if (!db.objectStoreNames.contains('historie')) {
                    db.createObjectStore('historie', { keyPath: 'id', autoIncrement: true });
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

    async clearAll() {
        return new Promise((resolve, reject) => {
            // Zkontrolovat, zda je databáze inicializována
            if (!this.db) {
                reject('Databáze není inicializována');
                return;
            }

            const transaction = this.db.transaction([this.tableName], "readwrite");
            const store = transaction.objectStore(this.tableName);
            const request = store.clear(); // Vymazat všechny záznamy v object store

            request.onsuccess = () => {
                console.log("Všechny položky byly úspěšně vymazány.");
                resolve();
            };

            request.onerror = (event) => {
                console.error("Chyba při mazání položek:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async pridejPolozky() {
        return new Promise((resolve, reject) => {
            const items = [];
            const inputElements = document.querySelectorAll("#myForm input");

            // Kontrola duplicitních hodnot
            const itemValues = new Set();
            inputElements.forEach(input => {
                if (input.value) {
                    if (itemValues.has(input.value)) {
                        reject('Duplicitní položky nejsou povoleny.');
                        return;
                    }
                    itemValues.add(input.value);
                    items.push({ nazev: input.value, body: 0 });
                }
            });

            // Odeslání dat, pokud neexistují duplicitní položky
            if (items.length > 0) {
                this.odesliData(items).then(resolve, reject);
            } else {
                reject('Nebyly zadány žádné platné položky.');
            }
        });
    }

    async nactiData() {
        return new Promise((resolve, reject) => {
            let openRequest = indexedDB.open(this.dbName, this.dbVersion);

            openRequest.onupgradeneeded = () => {
                // Pokud databáze ještě neexistuje, vytvoří se
                openRequest.result.createObjectStore(this.tableName, { keyPath: 'nazev' });
            };

            openRequest.onerror = () => {
                reject(openRequest.error);
            };

            openRequest.onsuccess = () => {
                let db = openRequest.result;
                let transaction = db.transaction(this.tableName, 'readonly');
                let store = transaction.objectStore(this.tableName);
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

    async odesliData(data) {
        return new Promise((resolve, reject) => {
            // Ensure the database is initialized
            if (!this.db) {
                reject('Database not initialized');
                return;
            }

            const transaction = this.db.transaction([this.tableName], "readwrite");
            const store = transaction.objectStore(this.tableName);

            // Projdeme všechny položky v poli aktualizace
            for (const item of data) {
                const request = store.put(item);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            }

            transaction.oncomplete = function () {
                console.log("Bodies successfully updated for all items");
                resolve();
            };

            transaction.onerror = function (event) {
                console.error("Error updating bodies for items:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async ulozitZebricek(nazevZebricku, nazevZebricky) {
        if (!this.db) throw new Error('Databáze není inicializována');
    
        const transaction = this.db.transaction(['historie', 'items'], 'readwrite');
        const historieStore = transaction.objectStore('historie');
        const itemsStore = transaction.objectStore('items');
    
        // Získání položek z 'items'
        const itemsRequest = itemsStore.getAll();
        await new Promise((resolve, reject) => {
            itemsRequest.onsuccess = () => resolve();
            itemsRequest.onerror = () => reject(itemsRequest.error);
        });
        const items = itemsRequest.result;
    
        // Uložení položek do nového žebříčku (v praxi jako záznam v 'historie')
        const historieRequest = historieStore.add({ nazev: nazevZebricku, vlastniNazev: nazevZebricky, datum: new Date(), items: items });
        return new Promise((resolve, reject) => {
            historieRequest.onsuccess = () => resolve(historieRequest.result);
            historieRequest.onerror = () => reject(historieRequest.error);
        });
    }

    async nactiHistorii() {
    if (!this.db) throw new Error('Databáze není inicializována');

    return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['historie'], 'readonly');
        const store = transaction.objectStore('historie');
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}
    vypisSeznam(pole) {

        let seznam = document.getElementById("seznam");
        pole.sort((a, b) => b.body - a.body);
        for (let i = 0; i < pole.length; i++) {
            let polozkaSeznamu = document.createElement("li");
            polozkaSeznamu.className = "list-group-item text-center border-0 round";
            polozkaSeznamu.id = "polozka-" + i;
            polozkaSeznamu.textContent = pole[i].nazev;
            seznam.appendChild(polozkaSeznamu);
        }
    }

}


