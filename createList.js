document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("myForm");
  var addRowBtn = document.getElementById("addRowBtn");
  var startComparingBtn = document.getElementById("startComparing");
  var db;

  // Otevřít nebo vytvořit databázi
  var request = indexedDB.open("MyDatabase", 1);

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("formData", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("item", "item", { unique: false });
    objectStore.createIndex("imageFile", "imageFile", { unique: false });
    objectStore.createIndex("imageUrl", "imageUrl", { unique: false });
  };

  request.onsuccess = function (event) {
    db = event.target.result;
  };

  function addNewRowToDB(item) {
    var transaction = db.transaction(["formData"], "readwrite");
    var objectStore = transaction.objectStore("formData");

    var request = objectStore.add(item);

    request.onsuccess = function (event) {
      console.log("Nová položka byla úspěšně přidána do databáze.");
    };

    request.onerror = function (event) {
      console.error("Nastala chyba při přidávání nové položky do databáze.");
    };
  }

  function saveDataToLocalstorage() {
    var formData = [];
    var formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(function (formGroup) {
      var inputs = formGroup.querySelectorAll('input');
      var data = {};
      inputs.forEach(function (input) {
        data[input.name] = input.value;
      });
      formData.push(data);
    });

    formData.forEach(function (item) {
      addNewRowToDB(item);
    });
  }

  addRowBtn.addEventListener("click", function () {
    // Přidat nový řádek do formuláře
    var newItem = document.createElement("div");
    newItem.className = "form-group";

    var textInput = document.createElement("input");
    textInput.type = "text";
    textInput.className = "form-control";
    textInput.name = "item";
    textInput.placeholder = "Položka " + (form.children.length + 1);

    // Přidat vstupy do nového řádku
    newItem.appendChild(textInput);
    form.appendChild(newItem);

    // Focus na nově přidaný vstup pro okamžité začátky psaní
    textInput.focus();
  });

  form.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addRowBtn.click();
    }
  });

  startComparingBtn.addEventListener("click", function () {
    saveDataToLocalstorage();
    window.location.href = 'compare.html';
  });
});
