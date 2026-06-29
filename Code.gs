// ============================================================
// BACKEND: Code.gs
// Google Apps Script — Inplikazio erregistroa
// ============================================================

// ⚠️ KONFIGURAZIOA — behin bakarrik aldatu behar diren balioak
var SPREADSHEET_ID = "ZURE_SPREADSHEET_ID_HEMEN";
var SHEET_IZENA    = "ZURE_SHEET_PESTAINA_IZENA_HEMEN"; 

// ============================================================

// Sarrera puntua: web aplikazioa irekitzean exekutatzen da
function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate();
}

// HTML partzialen txertaketa (index.html-etik deitzen da)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Spreadsheet-aren URL-a itzultzen du (mainForm.html-ek erabiltzen du)
function getSpreadsheetUrl() {
  return "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/edit";
}

// Saioa hasi duen irakaslearen Gmail helbidea itzultzen du
function sesion_GSUserEmail() {
  return Session.getActiveUser().getEmail();
}

// Egungo data itzultzen du (adib. "23/6/2025")
function Fecha() {
  var now = new Date();
  return now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
}

// Egungo ordua itzultzen du (adib. "09:05")
function Hora() {
  var now = new Date();
  var minutos = now.getMinutes();
  return now.getHours() + ":" + (minutos < 10 ? "0" + minutos : minutos);
}

// Formularioko datuak Google Sheet-era bidaltzen ditu
// Parametroak:
//   ikaslea    — hautatutako ikaslearen izena
//   ebidentzia — hautatutako portaeraren deskribapena eta penalizazioa
//   nota       — irakasleak idatzitako ohar librea (aukerakoa)
function enviarTodo(ikaslea, ebidentzia, nota) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_IZENA);
  var lastRow = sheet.getLastRow() + 1;

  // Datuak hurrengo errenkadan idazten dira:
  // A zutabea: Data
  // B zutabea: Ordua
  // C zutabea: Irakaslearen emaila (automatikoa)
  // D zutabea: Ikaslearen izena
  // E zutabea: Ebidentzia
  // F zutabea: Oharra (hutsik egon daiteke)
  sheet.getRange(lastRow, 1).setValue(Fecha());
  sheet.getRange(lastRow, 2).setValue(Hora());
  sheet.getRange(lastRow, 3).setValue(sesion_GSUserEmail());
  sheet.getRange(lastRow, 4).setValue(ikaslea);
  sheet.getRange(lastRow, 5).setValue(ebidentzia);
  sheet.getRange(lastRow, 6).setValue(nota || "");
}
