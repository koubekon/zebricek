document.addEventListener("DOMContentLoaded", function () {
    var items = [];

    // Otevření nebo vytvoření databáze a tabulky
    var request = indexedDB.open("myDatabase", 1);

    request.onupgradeneeded = function (event) {
        var db = event.target.result;

        // Vytvoření tabulky "items" s id, názvem a body
        var objectStore = db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("score", "score", { unique: false });
    };

    request.onsuccess = function (event) {
        var db = event.target.result;

        // Otevření transakce pro čtení dat
        var transactionRead = db.transaction(["items"], "readonly");
        var objectStoreRead = transactionRead.objectStore("items");

        // Načíst všechny záznamy z tabulky
        var getAllRequest = objectStoreRead.getAll();

        getAllRequest.onsuccess = function () {
            items = getAllRequest.result;

            // Otevření transakce pro zápis dat
            var transactionWrite = db.transaction(["items"], "readwrite");
            var objectStoreWrite = transactionWrite.objectStore("items");

            // Aktualizace bodů pro každou položku (pokud je potřeba)
        //    /items.forEach(function (item) {
        //         if (!item.hasOwnProperty("score")) {
        //             item.score = 0;
        //             objectStoreWrite.put(item);
        //         }
        //     });

            // Vytvořit párové kombinace
            var pairs = generatePairs(items);
console.log(pairs);
            // Zobrazit první porovnání
            showComparisonPair(pairs[0], 0, pairs);
        };

        getAllRequest.onerror = function (error) {
            console.error("Chyba při čtení z IndexedDB: ", error);
        };
    };

    request.onerror = function (event) {
        console.error("Nepodařilo se otevřít databázi: ", event.target.error);
    };

    function generatePairs(items) {
        var pairs = [];

        for (var i = 0; i < items.length - 1; i++) {
            for (var j = i + 1; j < items.length; j++) {
                pairs.push({ item1: items[i], item2: items[j], winner: null });
            }
        }

        return pairs;
    }

    function showComparisonPair(pair, pairIndex, allPairs) {
        var comparisonContainer = document.getElementById("comparisonContainer");
        var pairDiv = document.createElement("div");
        pairDiv.className = "comparison-pair";
        pairDiv.innerHTML = '<div class="item" onclick="vote(' + pairIndex + ', 1)">' + pair.item1.name + '</div>' +
                            '<div class="item" onclick="vote(' + pairIndex + ', 2)">' + pair.item2.name + '</div>';

        comparisonContainer.innerHTML = ''; // Vymažte předchozí obsah
        comparisonContainer.appendChild(pairDiv);
    }
});
