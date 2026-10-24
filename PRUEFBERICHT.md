# Prüfbericht – ElektroMaster 1.0

Stand: 24. Oktober 2026

## Bestandene automatisierte Prüfungen

- 139 feste Fragen: eindeutige IDs, jeweils vier verschiedene Optionen, gültige Lösungsindizes, gültige Modul- und Themenverweise.
- Zufälliges Mischen der Antworten erhält den korrekten Lösungsindex.
- 16 Rechenvorlagen, jeweils 200 erzeugte Aufgaben: insgesamt 3.200 Aufgaben mit unabhängigen Referenzrechnungen verglichen.
- Physikalisch positive, endliche Ergebnisse innerhalb der vorgesehenen Parameterbereiche.
- Dezimalkomma, Dezimalpunkt und wissenschaftliche Schreibweise.
- Zurückweisung ungültiger und mehrdeutiger Zahleneingaben.
- Toleranz innerhalb 1 % akzeptiert; 2 % Abweichung verworfen.
- Falsche Einheit wird verworfen.
- Lernfortschritt, sichere Antwortserien, Unsicherheit und Fehler.
- Wiederholungsabstände und Tagesfolge.
- Keine mehrfachen XP für dieselbe Aufgaben-ID am selben Tag.
- Backup-Rundlauf erhält den Datenbestand; ungültige Versionen und Statistikwerte werden abgewiesen.
- Adaptive Auswahl startet mit Grundlagen.
- Laufzeitdateien vorhanden und in der Offline-Dateiliste enthalten; relative Manifest-Pfade.
- 42.930 einzelne Assertions im Daten-/Rechenkern-Test bestanden.
- Zusätzlich 1.400 Auswertungen der tatsächlich angezeigten 35 Formeln und ihrer Umstellungen mit je 20 Wertekombinationen bestanden.
- JavaScript-Syntaxprüfung bestanden.

## Bedienlogik ohne echten Browser

tests-ui.mjs verwendet eine minimale DOM-Attrappe und prüft:

- Navigation durch alle Hauptbereiche.
- Quiz: zehn Antworten bis zur Auswertung.
- Rechentraining: 30 numerische Teilantworten bis zur Auswertung.
- Prüfung: Zurück/Vorwärts, Unterbrechen/Fortsetzen und gespeicherte Auswahl.
- Keine unmittelbare Lösungsanzeige während der Prüfung.
- Prüfungsauswertung und Speicherung.
- Erfolgreicher Backup-Import sowie Ablehnung eines fehlerhaften Imports.
- Automatische Abgabe nach Ablauf der Zeit.

Diese Tests sind bestanden. Die DOM-Attrappe testet die App-Logik, nicht das Layout oder tatsächliche Browser-APIs.

## Noch nicht praktisch verifiziert

Die Vorschau konnte aus der Arbeitsumgebung keine nutzbare Verbindung zum lokalen Server aufbauen. Der Browser meldete einen Verbindungs-Timeout. Auch der lokale HTTP-Zugriff blieb nach freigegebenem Netzwerkzugriff erfolglos.

Daher sind folgende Punkte offen und werden nicht als bestanden bezeichnet:

- Visuelle Kontrolle auf kleinen iPhone-Bildschirmen sowie Windows-Browsern.
- Echte Installation über Safari beziehungsweise Edge/Chrome.
- Service-Worker-Installation und echter Offline-Kaltstart.
- Echter Dateidownload und Dateiauswahldialog für Backups.
- Live-Veröffentlichung in einem GitHub-Pages-Repository.
- Unabhängige elektrotechnische Fachbegutachtung aller Texte und Aufgaben.

Offline-Funktion und Installierbarkeit sind implementiert, die vollständige Dateiliste und Konfiguration wurden geprüft. Das ersetzt keinen Test auf realen Geräten.

## Kurzer Abnahmetest nach Veröffentlichung

1. HTTPS-Adresse öffnen und auf „Offline bereit“ warten.
2. Auf Windows und auf dem iPhone die Navigation, Lesbarkeit und Erreichbarkeit aller Schaltflächen prüfen.
3. Ein Quiz beantworten; prüfen, ob Lösungen erst nach „Antwort prüfen“ erscheinen.
4. Rechentrainer: richtigen Wert, falschen Wert und falsche Einheit ausprobieren.
5. Seite neu laden und überprüfen, ob XP und laufende Einheit erhalten bleiben.
6. Backup exportieren, zusätzlich eine Aufgabe lösen, Backup wieder importieren. Der frühere Stand muss wiederhergestellt sein.
7. Eine ungültige JSON-Datei importieren: Fehlermeldung, bestehender Fortschritt unverändert.
8. Prüfung beginnen, vor/zurück navigieren, Seite neu laden, fortsetzen und abgeben. Punktzahl und Musterlösungen prüfen.
9. App installieren, einmal online starten, danach im Flugmodus vollständig schließen und erneut öffnen.
10. Im Offlinezustand Lernmodule, Formelsuche, Quiz und Rechentrainer öffnen; danach wieder online ein Backup erstellen.

## Reproduktion

Im Projektordner mit installiertem Node.js:

```text
npm test
```

Es sind keine Paketdownloads erforderlich. Die Formelauswertung der Tests verwendet einen kleinen Ausdrucksparser und führt keine Texte mit eval aus.

Die App kann auf mehrere hundert Fragen erweitert werden. Vor einem erweiterten Release neue Inhalte fachlich gegenprüfen, Rechenreferenzen ergänzen, die Cache-Version erhöhen und die Gerätekontrolle wiederholen.
