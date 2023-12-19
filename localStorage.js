export function sendData() {
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
}