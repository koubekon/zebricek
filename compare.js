document.addEventListener("DOMContentLoaded", function () {
    var comparisonContainer = document.getElementById("comparisonContainer");
    var db;
  
    var request = indexedDB.open("MyDatabase", 1);
  
    request.onsuccess = function (event) {
      db = event.target.result;
      displayComparison();
    };
  
    function displayComparison() {
      var transaction = db.transaction(["formData"], "readonly");
      var objectStore = transaction.objectStore("formData");
      var cursorRequest = objectStore.openCursor();
      var items = [];
  
      cursorRequest.onsuccess = function (event) {
        var cursor = event.target.result;
  
        if (cursor) {
          items.push(cursor.value);
          cursor.continue();
        } else {
          // Všechny položky jsou nyní v poli items
          showComparisonPairs(items);
        }
      };
    }
  
    function showComparisonPairs(items) {
      var pairs = generateRandomPairs(items);
  
      pairs.forEach(function (pair) {
        var comparisonPairDiv = document.createElement("div");
        comparisonPairDiv.className = "comparison-pair";
  
        var item1Div = createComparisonItem(pair[0]);
        var item2Div = createComparisonItem(pair[1]);
  
        comparisonPairDiv.appendChild(item1Div);
        comparisonPairDiv.appendChild(item2Div);
  
        comparisonContainer.appendChild(comparisonPairDiv);
      });
    }
  
    function generateRandomPairs(items) {
      var pairs = [];
  
      while (items.length > 1) {
        var index1 = Math.floor(Math.random() * items.length);
        var item1 = items.splice(index1, 1)[0];
  
        var index2 = Math.floor(Math.random() * items.length);
        var item2 = items.splice(index2, 1)[0];
  
        pairs.push([item1, item2]);
      }
  
      if (items.length > 0) {
        // Pokud je lichý počet položek, poslední položka zůstane neporovnaná
        pairs.push([items[0], null]);
      }
  
      return pairs;
    }
  
    function createComparisonItem(item) {
      var itemDiv = document.createElement("div");
      itemDiv.className = "comparison-item";
  
      if (item) {
        // Pokud máme položku, zobrazíme její název a obrázek
        var itemName = document.createElement("div");
        itemName.innerHTML = item.item;
        itemDiv.appendChild(itemName);
  
        if (item.imageFile || item.imageUrl) {
          var itemImage = document.createElement("img");
          itemImage.src = item.imageFile ? URL.createObjectURL(item.imageFile) : item.imageUrl;
          itemImage.alt = "Obrázek";
          itemDiv.appendChild(itemImage);
        }
      }
  
      itemDiv.addEventListener("click", function () {
        // Zde můžete přidat kód pro připočtení bodu položce (item)
        console.log("Připočítání bodu pro položku: ", item);
  
        // Odebrání aktuálního porovnání
        var comparisonPair = itemDiv.parentElement;
        comparisonContainer.removeChild(comparisonPair);
  
        // Pokud byly všechny položky porovnány, zobrazit konečnou zprávu nebo vykonat další akce
        if (comparisonContainer.children.length === 0) {
          console.log("Porovnání ukončeno.");
        }
      });
  
      return itemDiv;
    }
  });
  