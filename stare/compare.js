var comparisonPairs = [];
var currentPairIndex = 0;

function vote(pairIndex, winner) {
    var currentPair = comparisonPairs[pairIndex];

    // Přičti bod vítězi do databáze
    updateWinnerScore(currentPair["item" + winner].name);

    currentPair.winner = winner;
    currentPairIndex++;

    if (currentPairIndex < comparisonPairs.length) {
        // Zobrazit další porovnání
        showComparisonPair(comparisonPairs[currentPairIndex], currentPairIndex, comparisonPairs);
    } else {
        // Dokončit porovnávání
        finishComparison();
    }
}

function showComparisonPair(pair, pairIndex, allPairs) {
    var item1Div = document.querySelector(".comparison-pair .item:nth-child(1)");
    var item2Div = document.querySelector(".comparison-pair .item:nth-child(2)");

    item1Div.innerHTML = pair.item1.name;
    item2Div.innerHTML = pair.item2.name;
}

function finishComparison() {
    // Zde můžete provést nějaké kroky po dokončení porovnávání
    console.log("Porovnání dokončeno. Hodnocení: ", comparisonPairs);

    // Můžete také uložit hodnocení do IndexedDB nebo jiného úložiště
    // ...

    // Přesměrování na další stránku nebo jiné kroky
    // window.location.href = "nextPage.html";
}

function updateWinnerScore(winnerName) {
    var db;
    var request = indexedDB.open("myDatabase", 1);

    request.onsuccess = function (event) {
        db = event.target.result;

        var transaction = db.transaction(["items"], "readwrite");
        var objectStore = transaction.objectStore("items");

        var index = objectStore.index("item");

        // Získání záznamu vítězné položky pomocí jména
        var getRequest = index.get(winnerName);

        getRequest.onsuccess = function () {
            var winnerItem = getRequest.result;

            // Přičti bod vítězi
            if (winnerItem && winnerItem.score) {
                winnerItem.score += 1;
            } else {
                winnerItem.score = 1;
            }

            // Aktualizuj záznam v databázi
            var updateRequest = objectStore.put(winnerItem);

            updateRequest.onsuccess = function () {
                console.log("Skóre vítěze aktualizováno: ", winnerItem);
            };

            updateRequest.onerror = function (error) {
                console.error("Chyba při aktualizaci skóre vítěze: ", error);
            };
        };

        getRequest.onerror = function (error) {
            console.error("Chyba při získávání vítězné položky: ", error);
        };
    };

    request.onerror = function (event) {
        console.error("Nepodařilo se otevřít databázi: ", event.target.error);
    };
}
