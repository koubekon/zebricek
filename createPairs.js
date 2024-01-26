// createComparisonPairs.js
document.addEventListener("DOMContentLoaded", function () {
    var items = [];

    // Otevření nebo vytvoření databáze a tabulky
    var request = indexedDB.open("myDatabase", 1);

    request.onsuccess = function (event) {
        var db = event.target.result;

        // Otevření transakce pro čtení dat
        var transaction = db.transaction(["items"], "readwrite"); // Upraveno na "readwrite"
        var objectStore = transaction.objectStore("items");

        // Načíst všechny záznamy z tabulky
        var getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function () {
            items = getAllRequest.result;

            // Vytvořit párové kombinace
            var pairs = generatePairs(items);

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
        pairDiv.innerHTML = '<div class="item" onclick="vote(' + pairIndex + ', 1)">' + pair.item1.value + '</div>' +
                            '<div class="item" onclick="vote(' + pairIndex + ', 2)">' + pair.item2.value + '</div>';

        comparisonContainer.innerHTML = ''; // Vymažte předchozí obsah
        comparisonContainer.appendChild(pairDiv);
    }
});
