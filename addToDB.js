
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
                    db.createObjectStore('items', { keyPath: 'id' });
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

    addItems() {
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
}

const dbManager = new DatabaseManager("zebricek", 1);
document.getElementById("startComparing").addEventListener("click", () => {
    dbManager.addItems().then(() => {
        window.location.href = "compare.html";
    });
});


