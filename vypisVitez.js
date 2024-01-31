    var pole = ["Položka 1", "Položka 2", "Položka 3", "Položka 4"];

    function vypisSeznam() {

        var seznam = document.getElementById("seznam");

        for (var i = 0; i < pole.length; i++) {
            var polozkaSeznamu = document.createElement("li");
            polozkaSeznamu.className = "list-group-item border-0";
            polozkaSeznamu.id = "polozka-" + i;
            polozkaSeznamu.textContent = pole[i];
            seznam.appendChild(polozkaSeznamu);
        }
    }

    window.onload = vypisSeznam;