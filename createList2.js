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

             
        var textInput = document.createElement("input");
        textInput.type = "text";
        textInput.className = "form-control";
        textInput.name = "item" + (form.children.length + 1);
        textInput.placeholder = "Položka " + (form.children.length + 1);

        // Přidat vstupy do nového řádku
        itemContent.appendChild(textInput);
             newItem.appendChild(itemContent);

        // Přidat nový řádek do formuláře
        form.appendChild(newItem);

        // Focus na nově přidaný vstup pro okamžité začátky psaní
        textInput.focus();
    }

    function sendDataToServer() {
        // Zde byste měli odeslat data na váš backend server, například pomocí AJAX

        // Příklad pomocí Fetch API (potřebujete backend endpoint)
        fetch('https://example.com/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: getDataFromForm() }),
        })
            .then(response => response.json())
            .then(data => {
                // Zde můžete pracovat s odpovědí od serveru
                console.log('Success:', data);
                // Navigace na novou stránku
                window.location.href = 'novastranka.html';
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function getDataFromForm() {
        // Zde můžete získat data z formuláře
        var formData = new FormData(form);
        var data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }

    // Přidat nový řádek po kliknutí na tlačítko
    addRowBtn.addEventListener("click", addNewRow);

    // Přidat nový řádek po stisknutí klávesy Enter v posledním poli formuláře
    form.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Zabránit výchozímu chování klávesy Enter (odeslání formuláře)
            addNewRow();
        }
    });

    // Odeslat data na server a přejít na novou stránku po kliknutí na tlačítko "Začít vytvářet"
    startComparingBtn.addEventListener("click", function () {
        sendDataToServer();
    });
});
