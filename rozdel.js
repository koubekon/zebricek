class Polozka {
    constructor(nazev, body) {
        this.nazev = nazev;
        this.body = body;
    }
}

class Hra {
    constructor(pole) {
        this.pole = pole.map(polozka => new Polozka(polozka.nazev, polozka.body));
        this.pocetOdehranych = 0;
        this.historie = [];
        this.pocetKol = this.spocitejKola(this.pole.length);
    }

    spocitejKola(vPoli) {
        let kola = 0;
        for (let i = (vPoli - 1); i > 0; i--) {
            kola += i;
        }
        return kola;
    }

    vytvorDvojici(pole) {
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

    pridejBod(nazev) {
        // připíše bod vítězi kola
        let vitez = this.pole.find(item => item.nazev === nazev);
        vitez.body++;

        // přidání vítěze kola do historie
        let posledniIndex = this.historie.length - 1;
        this.historie[posledniIndex].vitezi = vitez.nazev;

        // další kolo
        this.aktualizujStranku();
    }

    zapisHistorii(prvniPrvek, druhyPrvek) {
        let zapis = { "prvni": prvniPrvek, "druhy": druhyPrvek, "vitezi": null }
        this.historie.push(zapis);
    }

    aktualizujStranku() {
        // kontrola počtu odehraných kol
        if (this.pocetOdehranych === this.pocetKol) {
            databaze.odesliData(this.pole).then(() => {
                window.location.href = "winner.html";
            });
        } else {
            let dvojice = this.vytvorDvojici(this.pole);
            let uzHrali = false;
            let kdoUzVyhral = null;

            // Kontrola, jestli už tato dvojice spolu nehrála
            for (let j = 0; j < this.historie.length; j++) {
                if (this.historie[j].prvni === dvojice[0].nazev || this.historie[j].prvni === dvojice[1].nazev) {
                    if (this.historie[j].prvni === dvojice[0].nazev) {
                        if (this.historie[j].druhy === dvojice[1].nazev) {
                            uzHrali = true;
                            kdoUzVyhral = this.historie[j].vitezi;
                            break;
                        }
                    } else {
                        if (this.historie[j].druhy === dvojice[0].nazev) {
                            uzHrali = true;
                            kdoUzVyhral = this.historie[j].vitezi;
                            break;
                        }
                    }
                }
            }

            // pokud spolu hráli, stačí znovu zapsat bod výherci z minula, uživatel může přeskočit
            if (uzHrali === true) {
                this.zapisHistorii(dvojice[0].nazev, dvojice[1].nazev);
                this.pocetOdehranych++;
                this.pridejBod(kdoUzVyhral);
            }

            // pokud spolu ještě nehráli, vytvoří se dvojice na obrazovce
            else {
                let prvniDiv = document.getElementById('prvni');
                let druhyDiv = document.getElementById('druhy');

                prvniDiv.innerHTML = dvojice[0].nazev;
                druhyDiv.innerHTML = dvojice[1].nazev;

                this.zapisHistorii(dvojice[0].nazev, dvojice[1].nazev);

                prvniDiv.onclick = () => this.pridejBod(dvojice[0].nazev);
                druhyDiv.onclick = () => this.pridejBod(dvojice[1].nazev);
                this.pocetOdehranych++;
            }
        }
    }
}

