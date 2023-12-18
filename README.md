# Název: Žebříček
# Funkční Specifikace
## Datový konceptuální model
### Seznam:
- **Popis:** Záznamy obsahující seznam věcí k porovnání.
- **Atributy:** ID seznamu, název seznamu, datum vytvoření.
### Položka:
- **Popis:** Individuální položky v seznamu, které budou porovnávány.
- **Atributy:** ID položky, název položky, pozice v rámci seznamu.
### Porovnání:
- **Popis:** Záznamy o provedených porovnáních mezi dvěma položkami.
- **Atributy:** ID porovnání, ID první položky, ID druhé položky, výsledek porovnání (která je lepší).
## Charakteristika funkčností aplikace
- Uživatel zadá položky seznamu
- Po nahrání seznamu se uživateli zobrazují dvojice a on z nich vybírá tu lepší. Postupným porovnáváním se vytvoří žebříček od nejlepšího po nejhorší.
- Uživatel může výsledný žebříček stáhnout nebo vytisknout.
## Specifikace uživatelských rolí a oprávnění 
- **Uživatel**: Vytváří seznam, může uložit nebo vytisknout.
## Uživatelské grafické rozhraní a jeho funkčnosti
- HTML Bootstrap 4.0
# Technická specifikace
## Datový logický model
