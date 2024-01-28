
let pole = [
    { nazev: 'jablko', body: 0 },
    { nazev: 'banán', body: 0 },
    { nazev: 'pomeranč', body: 0 },
    { nazev: 'kiwi', body: 0 },
    { nazev: 'hruška', body: 0 }
];

function vyberNahodnouDvojici(pole) {
    let indexy = [];
    while (indexy.length < 2) {
        let index = Math.floor(Math.random() * pole.length);
        if (indexy.indexOf(index) === -1) {
            indexy.push(index);
        }
    }
    return indexy;
}



function pridejBod(index) {
    pole[index].body++;

    console.log('Body pro', pole[index].nazev, ':', pole[index].body);
    console.log('Náhodná dvojice:', pole[dvojiceIndexy[0]], 'a', pole[dvojiceIndexy[1]]);
}

function vytvorDvojicePodleBodu(pole) {
    // Seřadíme položky podle bodů (od nejvyšších k nejnižším)
    pole.sort((a, b) => b.body - a.body);

    let dvojice = [];
    let i = 0;

    // Iterujeme přes pole a vytváříme dvojice
    while (i < pole.length - 1) {
        if (pole[i].body === pole[i + 1].body) {
            dvojice.push([pole[i], pole[i + 1]]);
            i += 2; // Přeskočíme o dva, protože jsme vytvořili dvojici
        } else {
            i++; // Pokračujeme dál, pokud se body neshodují
        }
    }

    // Ošetření případu, kdy poslední položka nemá pár
    if (i < pole.length) {
        // Zde můžete rozhodnout, co dělat s nepárovou položkou
        console.log('Nepárová položka:', pole[i]);
    }

    return dvojice;
}

let dvojiceIndexy = vytvorDvojicePodleBodu(pole);

console.log('Náhodná dvojice:', pole[dvojiceIndexy[0]], 'a', pole[dvojiceIndexy[1]]);


document.getElementById('prvni').innerHTML = pole[dvojiceIndexy[0]].nazev;
document.getElementById('prvni').setAttribute('onclick', 'pridejBod(' + dvojiceIndexy[0] + ')');
document.getElementById('druhy').innerHTML = pole[dvojiceIndexy[1]].nazev;
document.getElementById('druhy').setAttribute('onclick', 'pridejBod(' + dvojiceIndexy[1] + ')');
