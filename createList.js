document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("myForm");
    var addRowBtn = document.getElementById("addRowBtn");
    var startComparingBtn = document.getElementById("startComparing");

    function addNewRow() {
        // Vytvořit nový řádek formuláře s obrázkem
        var newItem = document.createElement("div");
        newItem.className = "form-group";

        var itemContent = document.createElement("div");
        itemContent.className = "d-flex align-items-center";

        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.name = "imageFile";
        fileInput.className = "mr-2";

        var urlInput = document.createElement("input");
        urlInput.type = "text";
        urlInput.className = "form-control mr-2";
        urlInput.name = "imageUrl";
        urlInput.placeholder = "URL obrázku";

        var textInput = document.createElement("input");
        textInput.type = "text";
        textInput.className = "form-control";
        textInput.name = "item" + (form.children.length + 1);
        textInput.placeholder = "Položka " + (form.children.length + 1);

        // Přidat vstupy do nového řádku
        itemContent.appendChild(textInput);
        itemContent.appendChild(fileInput);
        itemContent.appendChild(urlInput);
        newItem.appendChild(itemContent);

        // Přidat nový řádek do formuláře
        form.appendChild(newItem);

        // Focus na nově přidaný vstup pro okamžité začátky psaní
        textInput.focus();
    }

    function saveDataToLocalstorage() {
        // Získat data z formuláře
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

        // Uložit data do localStorage
        localStorage.setItem('formData', JSON.stringify(formData));
    }

    // Přidat nový řádek po kliknutí na tlačítko
    addRowBtn.addEventListener("click", addNewRow);

    // Odeslat data na server a přejít na novou stránku po kliknutí na tlačítko "Začít vytvářet"
    startComparingBtn.addEventListener("click", function () {
        // Uložit data do localStorage
        saveDataToLocalstorage();
        
        // Přejít na novou stránku
        window.location.href = 'compare.html';
    });
});