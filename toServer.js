export function sendData() {
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