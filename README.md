# Inplikazio Erregistroa — Google Apps Script Web App

Tresna hau irakasleek ikasleen inplikazio-intzidentziak azkar erregistratzeko erabiltzen da, zuzenean Google Sheets-era bidaliz. Inplikazioa zeharkako gaitasunaren notaren penalizazioak automatikoki kalkulatzen dira.

---

## Nola funtzionatzen du

```
Irakaslea → Google Sites (zikloko gunea) → Apps Script → Google Sheets
```

1. Irakasleak zikloko Google Sites gunera joaten da
2. Ikaslea eta gertaeraren ebidentzia hautatzen ditu
3. "Bidali" sakatzean, datuak zuzenean Sheet-era joaten dira

Erregistratzen diren datuak:

| Zutabea | Edukia |
|---------|--------|
| A | Data (adib. `23/6/2025`) |
| B | Ordua (adib. `09:05`) |
| C | Irakaslearen emaila (saioa automatikoki detektatua) |
| D | Ikaslearen izena |
| E | Ebidentzia + penalizazioa |
| F | Ohar librea (aukerakoa) |

---

## Fitxategiak

| Fitxategia | Eginkizuna |
|------------|------------|
| `Code.gs` | Backend: konfigurazioa eta datuak Sheets-era bidaltzen ditu |
| `index.html` | Orriaren egitura nagusia |
| `mainForm.html` | Formularioa eta JavaScript logika |

---

## Nola konfiguratu zure ikastetxean

### 1. Google Sheet berri bat sortu

- Ireki [Google Drive](https://drive.google.com) eta sortu sheet berri bat
- Lehen orriari (pestaina) izena eman (adib. `EE1`, `1HGM`...)
- Sheet-aren **ID-a** kopiatu URL-etik:
  ```
  https://docs.google.com/spreadsheets/d/ --> [ID hau] <-- /edit
  ```

### 2. Google Apps Script proiektua sortu

- Joan [script.google.com](https://script.google.com)-era eta sortu proiektu berri bat
- Editorean hiru fitxategi sortu behar dira (`Code.gs` lehenetsia dago; `index.html` eta `mainForm.html` `+` botoiarekin gehitu)
- Fitxategi bakoitzean dagokion kodearen edukia itsatsi

### 3. Code.gs konfiguratu — **behin bakarrik**

Fitxategiaren hasieran dauden bi lerro hauek aldatu behar dira:

```javascript
var SPREADSHEET_ID = "ZURE_SPREADSHEET_ID_HEMEN";  // ← kopiatu 1. pausotik
var SHEET_IZENA    = "ZURE_SHEET_IZENA_HEMEN";      // ← Sheet-aren beheko fitxaren izena (adib. "EE1")
```

### 4. mainForm.html konfiguratu — ikasleen zerrenda

Bilatu `<!-- IKASLE 1 -->` eta jarri zure ikasleak:

```html
<option>Ane Garate</option>
<option>Mikel Urrutia</option>
<!-- ... -->
```

### 5. Web App bezala zabaldu

- Apps Script editorean: `Deploy > New deployment`
- Mota: **Web app**
- Execute as: **Me**
- Who has access: **Anyone within [zure domeinua]**
- Egin klik `Deploy`-n eta kopiatu sortutako **URL-a**

### 6. Google Sites-en txertatu

- Ireki zure zikloko Google Sites gunea
- Sartu aplikazioa txertatu nahi duzun orrira
- `Insert > Embed` (edo `Txertatu > URL`)
- Itsatsi 5. pausoan kopiatutako URL-a
- Gorde eta argitaratu gunea

---

## Ikasleen pestainak automatikoki sortu (sheet_script_Code.gs)

Datu-orri nagusian erregistro berriak pilatzen diren heinean, script honek ikasle bakoitzeko pestaina independente bat sortzen du, ikasle horri dagozkion erregistroak bakarrik erakutsiz.

### Nola funtzionatzen du

```
Datu-orria (EE1) → script-ak irakurri → ikasle bakoitzeko pestaina sortu/eguneratu
```

Pestaina bakoitzak goiburu berdina dauka (Data, Ordua, Irakaslea...) eta ikasle horren errenkadak bakarrik.

### Konfiguratu eta instalatu

1. Ireki Spreadsheet-a
2. Joan `Extensions > Apps Script`
3. Editorean `Code.gs` fitxategia dago lehenetsia — han itsatsi `sheet_script_Code.gs`-ren edukia eskuz
4. Fitxategiaren hasieran aldatu:
   ```javascript
   var DATU_ORRIA = "ZURE_SHEET_PESTAINA_IZENA_HEMEN"; // adib. "EE1"
   ```
   (`IKASLE_ZUTABEA = 4` ez aldatu — D zutabea da beti ikaslearen izena)
5. Gorde (`Ctrl+S`) eta itxi editorra
6. Spreadsheet-a **freskatu** — goiko barran `Inplikazioa` menu berria agertuko da

### Erabili

- **`Inplikazioa > Goiburua ezarri (lehen aldiz)`** — lehen erabileran soilik, datu-orriak goibururik ez badu
- **`Inplikazioa > Ikasleen orriak eguneratu`** — eskuz eguneratu nahi baduzu

Erregistro berri bat sartzen den bakoitzean ikaslearen pestaina automatikoki eguneratzen da.

---

*CIFP Don Bosco LHII — Lanbide Heziketa*
