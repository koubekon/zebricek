﻿# Název: Žebříček
# Funkční Specifikace
## Úvod

Aplikace slouží k sestavení žebříčku hodnot podle porovnávání jednotlivých položek v seznamu.

-------------------

### Datový Konceptuální Model

-   Entitní Vztahový Diagram (ERD): Aplikace obsahuje entity `Položky` a `Historie`, s atributy pro názvy a kategorie položek a záznamy historie uspořádání.

### Charakteristika Funkčností Aplikace

-   Umožnění vytváření seznamů položek pro porovnání.
-   Interaktivní rozhraní pro porovnání a uspořádání položek.
-   Ukládání a prohlížení historie žebříčků.

### Specifikace Uživatelských Rolí a Oprávnění

-   Běžný Uživatel: Může vytvářet seznamy, porovnávat položky a prohlížet historii.

### Uživatelské Grafické Rozhraní a Jeho Funkčnosti

-   Formulář pro vložení položek.
-   Tlačítka pro akce a sidebar pro historii.

Technická Specifikace
---------------------

### Datový Logický Model

-   Využití IndexedDB pro ukládání položek a historie s klíčovými atributy.

### Architektura

-   Klient-server s klientským skriptováním v JavaScriptu pro dynamické UI.

### Popis Tříd a Funkcí

-   Třídy: `Polozka` a `Hra` pro správu položek a hry.
-   Funkce: Pro manipulaci s DOM a správu databáze.

### Použité Technologie

-   JavaScript pro klientskou logiku.
-   IndexedDB pro ukládání dat.
