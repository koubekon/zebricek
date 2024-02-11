
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


