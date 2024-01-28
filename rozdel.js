let pole = [
    { nazev: 'jablko', body: 0 },
    { nazev: 'banán', body: 0 },
    { nazev: 'pomeranč', body: 0 },

];
let pocet = pole.length;
console.log(pocet);
aktualizujStranku();


// console.log('Náhodná dvojice:', dvojice);

// document.getElementById('prvni').innerHTML = dvojice[0].nazev;
// document.getElementById('druhy').innerHTML = dvojice[1].nazev;




function vytvorDvojici(pole) {
    // Seřadíme položky podle bodů
    
    let seradit = pole.slice().sort((a, b) => a.body - b.body);
    let pom = 0;

    // Zjistíme nejnižší počet bodů
    let min = seradit[pom].body;
    let kandidati = seradit.filter(item => item.body === min);

    // Pokud zbývá pouze jedna položka s nejmenším počtem bodů, přejdeme k dalším
    
    while (kandidati.length === 1) {
        pom++;
        let druhyMin = seradit[pom].body;
        kandidati = seradit.filter(item => item.body === druhyMin);
    }

    // Náhodný výběr dvojice z kandidátů
    let index1 = Math.floor(Math.random() * kandidati.length);
    let index2;
    do {
        index2 = Math.floor(Math.random() * kandidati.length);
    } while (index1 === index2);
// Zkusit přidat pomocnou tabulku na zapamatování, kdo vyhrál
    return [kandidati[index1], kandidati[index2]];
}


function pridejBod(nazev) {
    let vitez = pole.find(item => item.nazev === nazev);
        vitez.body++;
    
    console.log(pole);
    aktualizujStranku();
}

function aktualizujStranku() {
    let dvojice = vytvorDvojici(pole);
    let prvniDiv = document.getElementById('prvni');
    let druhyDiv = document.getElementById('druhy');

    prvniDiv.innerHTML = dvojice[0].nazev;
    druhyDiv.innerHTML = dvojice[1].nazev;
 
    // Nastavení onClick eventů pro nově vygenerované položky
    prvniDiv.onclick = function() { pridejBod(dvojice[0].nazev); };
    druhyDiv.onclick = function() { pridejBod(dvojice[1].nazev); };
}
