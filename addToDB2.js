class DatabaseManager {
    constructor(dbName, tableName) {
      this.dbName = dbName;
      this.tableName = tableName;
      this.db = null;
    }
  
    async init() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName);
  
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    }
  
    async nahrat() {
      return new Promise((resolve, reject) => {

        const items = [];
            const inputElements = document.querySelectorAll("#myForm input");
            inputElements.forEach(input => {
                if (input.value) {  
                items.push({ nazev: input.value, body: 0 });
            }});
        const transaction = this.db.transaction([this.tableName], "readwrite");
        const store = transaction.objectStore(this.tableName);
  
        for (const item of items) {
          const request = store.add(item);
  
          request.onsuccess = () => {
            resolve();
          };
  
          request.onerror = (event) => {
            reject(event.target.error);
          };
        }
      });
    }
  
    async nacist() {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.tableName], "readonly");
        const store = transaction.objectStore(this.tableName);
  
        const request = store.getAll();
  
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    }
  
    async aktualizovat(data) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.tableName], "readwrite");
        const store = transaction.objectStore(this.tableName);
  
        for (const item of data) {
          const request = store.put(item);
  
          request.onsuccess = () => {
            resolve();
          };
  
          request.onerror = (event) => {
            reject(event.target.error);
          };
        }
      });
    }
  }
  
  // Příklad použití
  
  const db = new ZebricekDB("zebricek", "items");
  
  db.init().then(() => {
    // Nahrajte data
    db.nahrat([
      { id: 1, nazev: "Jabłko", body: 10 },
      { id: 2, nazev: "Pomarańcza", body: 20 },
      { id: 3, nazev: "Banán", body: 30 },
    ]);
  
    // Načtěte data
    db.nacist().then((data) => {
      console.log(data);
    });
  
    // Aktualizujte body
    db.aktualizovat([
      { id: 1, nazev: "Jabłko", body: 15 },
      { id: 2, nazev: "Pomarańcza", body: 25 },
    ]);
  });
  