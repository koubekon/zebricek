let pole = [
    { nazev: 'jablko', body: 0 },
    { nazev: 'banán', body: 0 },
    { nazev: 'pomeranč', body: 0 },
    { nazev: 'grep', body: 0 },
    // { nazev: 'pomelo', body: 0 },
];
let pocetOdehranych = 0;
let historie = [];
let pocetKol = spocitejKola(pole.length);
console.log(pocetKol);
aktualizujStranku();


// console.log('Náhodná dvojice:', dvojice);

// document.getElementById('prvni').innerHTML = dvojice[0].nazev;
// document.getElementById('druhy').innerHTML = dvojice[1].nazev;
function spocitejKola(vPoli) {
    let kola = 0;
    for (let i = (vPoli - 1); i > 0; i--) {
        kola = kola + i;
    }
    return kola;
}

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

    return [kandidati[index1], kandidati[index2]];
}


function pridejBod(nazev) {
    let vitez = pole.find(item => item.nazev === nazev);
    vitez.body++;
    let posledniIndex = historie.length - 1;
    historie[posledniIndex].vitezi = vitez.nazev;
    
    console.log(pole);
    console.log(historie);
    aktualizujStranku();
}

function zapisHistorii(prvniPrvek, druhyPrvek) {
    let zapis = { "prvni": prvniPrvek, "druhy": druhyPrvek, "vitezi": null }
    historie.push(zapis);

}

function aktualizujStranku() {
    if (pocetOdehranych === pocetKol) {
        console.log("konec");
        //window.location.href = "winner.html";

    } else {
        let dvojice = vytvorDvojici(pole);
        let prvniDiv = document.getElementById('prvni');
        let druhyDiv = document.getElementById('druhy');

        prvniDiv.innerHTML = dvojice[0].nazev;
        druhyDiv.innerHTML = dvojice[1].nazev;

        zapisHistorii(dvojice[0].nazev, dvojice[1].nazev);

        prvniDiv.onclick = function () { pridejBod(dvojice[0].nazev); };
        druhyDiv.onclick = function () { pridejBod(dvojice[1].nazev); };
        // počítání proběhlých kol
        pocetOdehranych++;
    }

}
