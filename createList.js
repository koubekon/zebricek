document.addEventListener("DOMContentLoaded", function () {
    // Zachycení události kliknutí na tlačítko "Přidat položku"
    document.getElementById("addRowBtn").addEventListener("click", addRow);

    // Zachycení události stisknutí klávesy "Enter"
    document.getElementById("myForm").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addRow();
        }
    });

    function addRow() {
        // Vytvoření nového řádku s inputem
        var newRow = document.createElement("div");
        newRow.className = "form-group";
        newRow.innerHTML = '<div class="d-flex align-items-center"><input type="text" class="form-control" name="item" placeholder="Položka "></div>';

        // Přidání nového řádku do formuláře
        document.getElementById("myForm").appendChild(newRow);
    }
});
