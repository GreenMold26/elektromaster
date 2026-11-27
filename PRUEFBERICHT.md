# Prüfstand Version 2.1 – 27. November 2026

Alle acht Testprogramme bestanden: die sechs bisherigen Testgruppen und tests-daily-skip.mjs sowie tests-ui-daily-skip.mjs. Der bisherige Mitternachtstest wurde an die ausdrücklich neue Nachholregel angepasst. Die übrigen Regressionen bleiben erhalten.

Zusätzlich geprüft: eindeutige IDs und vier Zustände; Überspringen ohne Daten-/XP-Verlust; Verweigerung von Abschlussbonus bei übersprungenem Lauf; Nachholen mit erhaltenem heutigen Teilfortschritt; unveränderte historische Ziele; Bonus-Idempotenz; V2-Migration einschließlich alter Mitternachtsgutschriften; ungültige Metadaten; Import/Export; veraltete aktive Referenz; Wechsel über Mitternacht; 26 bzw. 34 Tage Pause; Sommer-/Winterzeit.

UI-Tests verwenden weiterhin ein DOM-Modell, Offline-Tests ein Service-Worker-Modell. Eine Prüfung auf einem echten iPhone ist nicht erfolgt. Veröffentlichung und Prüfung der Live-Adresse erfolgen erst nach ausdrücklicher Nutzerfreigabe.

Quellcode-Sicherung: backup/before-daily-skip-2026-11-27, Ausgangscommit 131722497d2f677e323e479f63735c1ca7957578. Diese Sicherung enthält keinen lokalen Gerätefortschritt.

# ElektroMaster 2.0 – Prüfbericht

Stand: 5. November 2026. Geprüft wurde das ausgelieferte lokale Quellprojekt. Es fand kein Zugriff auf den tatsächlichen Lernstand des Nutzers und keine Veröffentlichung bei GitHub statt.

## Automatisierte Prüfung: bestanden

Alle sechs Testprogramme wurden am Übergabetag erfolgreich ausgeführt:

| Test | Ergebnis |
|---|---|
| tests.mjs | 42.930 Prüfungen; 3.200 erzeugte Rechenaufgaben, 139 Fragen, 35 Formeln, 61 Lektionen und 16 Vorlagen |
| tests-formulas.mjs | 1.400 Prüfungen angezeigter Formeln und Umstellungen |
| tests-ui.mjs | Bisherige Navigation, Quiz, numerische Eingaben, Prüfung, Unterbrechen/Fortsetzen, Import, ungültiger Import und Zeitablauf |
| tests-v2.mjs | 862 Prüfungen für Migration, Backup, Datum, Tagestraining, Hilfe, Lexikon und SVG-Zuordnung |
| tests-ui-v2.mjs | Hilfe/Suche ohne Eingabeverlust, Prüfungssperre, getrennte Tagesläufe, Neuladen, falsche Antworten als Abschluss, Wiederholung ohne XP, Favoriten, Mitternacht und Import |
| tests-offline.mjs | Worker-Modell mit 16 Ressourcen, Unterpfad, Cache-Abruf ohne Netz, Navigationsfallback und kontrollierter Aktivierung |

Zusätzlich wurden die lokalen SVG-Vorschautafeln gerendert und visuell geprüft. Die lokale HTTP-Vorschau war während der Entwicklung mit Status 200 erreichbar. Die ursprüngliche content.js ist bytegleich mit Version 1.0.

Die UI-Tests verwenden ein DOM-Modell. Die Offline-Tests verwenden ein Service-Worker-/Cache-Modell. Beides ersetzt keine Prüfung im tatsächlichen Browser. Migrationstests arbeiten mit Testdaten, nicht mit dem privaten Gerätefortschritt.

## Noch offen: echte Browser- und Geräteabnahme

Eine vollständige visuelle Browserprüfung konnte wegen einer Zugriffsbegrenzung der Computersteuerung nicht abgeschlossen werden. Tatsächliche iPhone-Installation, Safari-Verhalten, Tastatur/Fokus, Dark-/Light-Mode-Darstellung auf dem Gerät und Offline-Neustart sind nicht als bestanden ausgewiesen.

Nach dem Update auf der vorhandenen Adresse bitte prüfen:

1. Vorheriges Backup vorhanden; XP, gelesene Inhalte und Prüfungsbestleistung stimmen nach dem Update überein.
2. Modulauswahl öffnen; Elektrotechnik nutzbar, geplante Bereiche nicht als fertige Kurse zugänglich.
3. Eine Rechenantwort teilweise eingeben; Hilfe öffnen, suchen und schließen. Eingabe bleibt erhalten. Auf kleinem Bildschirm Schaltbildbeschriftungen lesen bzw. horizontal scrollen.
4. Tages-MC teilweise bearbeiten, Rechentraining starten, App schließen und beide Stände fortsetzen.
5. Ein Tagestraining mit teilweise falschen Antworten abschließen. Tagesziel erreicht und Quote getrennt sichtbar. Wiederholung erhöht XP nicht.
6. Lexikoneintrag suchen, favorisieren, neu öffnen. Formelschnellzugriff funktioniert.
7. Prüfung beginnen: keine Hilfe und kein Nachschlagezugriff. Zeitablauf und Abgabe prüfen.
8. „Offline bereit“ abwarten, Netz ausschalten, App vollständig schließen und erneut öffnen. Tagestraining, Lexikon und Schaltbilder erreichbar.
9. V2-Backup exportieren. Import nur auf einem gesicherten Teststand prüfen, da er vorhandenen Fortschritt ersetzt.
10. Nach lokalem Datumswechsel neue feste Tagesauswahl und erhaltene frühere Bearbeitungsstände kontrollieren.

## Bekannte Grenzen

- Keine automatische Synchronisation zwischen PC und iPhone.
- Endlicher lokaler Speicher; historische Tagesläufe werden noch nicht automatisch archiviert.
- Kein vollständiger IHK-Rahmenplan, kein vollständiges Tabellenbuch und kein Schaltungssimulator.
- Andere Lernmodule sind nur vorbereitet. Vereinfachte Schaltbilder sind Lernhilfen, keine Anlagenunterlagen.
- Die GitHub-Konfiguration und etwaige Änderungen deiner Live-Version seit dem vorhandenen 1.0-Quellstand wurden nicht eingesehen.
