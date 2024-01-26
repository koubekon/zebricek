// createList.js
document.addEventListener("DOMContentLoaded", function () {
    // Zachycení události kliknutí na tlačítko "Začít vytvářet"
    document.getElementById("startComparing").addEventListener("click", function () {
        // Uložení do IndexedDB a po dokončení přesměrování na compare.html
        saveToIndexedDB().then(function () {
            window.location.href = "compare.html";
        });
    });

    function saveToIndexedDB() {
        return new Promise(function (resolve, reject) {
            var items = [];

            // Procházení všech inputů ve formuláři a přidání hodnot do pole
            var inputElements = document.querySelectorAll("#myForm input");
            inputElements.forEach(function (input) {
                items.push(input.value);
            });

            // Otevření nebo vytvoření databáze a tabulky
            var request = indexedDB.open("myDatabase", 1);

            request.onupgradeneeded = function (event) {
                var db = event.target.result;
                var objectStore = db.createObjectStore("items", { keyPath: "item", autoIncrement: true });
            };

            request.onsuccess = function (event) {
                var db = event.target.result;

                // Otevření transakce a přidání dat do tabulky
                var transaction = db.transaction(["items"], "readwrite");
                var objectStore = transaction.objectStore("items");

                items.forEach(function (item) {
                    objectStore.add({ value: item });
                });

                transaction.oncomplete = function () {
                    console.log("Položky byly úspěšně uloženy do IndexedDB.");
                    resolve(); // Promise je dokončen
                };

                transaction.onerror = function (error) {
                    console.error("Chyba při ukládání do IndexedDB: ", error);
                    reject(error); // Promise s chybou
                };
            };

            request.onerror = function (event) {
                console.error("Nepodařilo se otevřít nebo vytvořit databázi: ", event.target.error);
                reject(event.target.error); // Promise s chybou
            };
        });
    }
});
