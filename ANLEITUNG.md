# ElektroMaster 1.0 – Start und Nutzung

Eine eigenständige Elektrotechnik-Lern-App für PC und iPhone. Keine Konten, keine Datenbank, keine kostenpflichtigen APIs und keine externen JavaScript-, Schrift- oder Grafikdienste. Die App-Dateien werden statisch ausgeliefert; gelernt wird lokal.

## 1. Auf einem Windows-PC starten

1. ZIP vollständig entpacken, beispielsweise nach Dokumente/ElektroMaster.
2. Falls noch nicht vorhanden: Node.js LTS von https://nodejs.org installieren.
3. Im entpackten Ordner **Starten.cmd** doppelklicken.
4. Die App unter **http://localhost:4173** im Browser öffnen. Falls das Browserfenster vor dem Server bereit war, die Seite neu laden.
5. Das geöffnete Serverfenster während der Nutzung offen lassen. Zum Beenden Strg+C drücken.

Alternativ im Terminal des Ordners:
```text
node server.mjs
```

Es müssen keine Pakete installiert werden. Der Server ist nur zum lokalen Start nötig, nicht für GitHub Pages. Die Datei index.html nicht direkt per Doppelklick öffnen: JavaScript-Module und Service Worker benötigen HTTP beziehungsweise HTTPS.

Der mitgelieferte Server bindet ausschließlich an den eigenen PC (127.0.0.1). Die localhost-Adresse funktioniert nicht als Verbindung vom iPhone zum PC. Für das iPhone die veröffentlichte HTTPS-Adresse verwenden.

## 2. Kostenlos mit GitHub Pages veröffentlichen

Voraussetzung ist ein GitHub-Konto. Für den üblichen kostenlosen Weg ein **öffentliches Repository** verwenden. Der Quellcode wird damit öffentlich; der Lernfortschritt bleibt auf dem Gerät und gehört nicht ins Repository.

1. Auf GitHub ein neues öffentliches Repository anlegen, z. B. **elektromaster**.
2. Unter **Add file → Upload files** die Dateien **aus dem entpackten ElektroMaster-Ordner** hochladen. index.html muss direkt im Repository-Hauptverzeichnis liegen, nicht unter einem zusätzlichen ElektroMaster-Unterordner.
3. Änderungen mit **Commit changes** speichern. Standardbranch: meist **main**.
4. Im Repository **Settings → Pages** öffnen.
5. Unter **Build and deployment → Source** die Option **Deploy from a branch** auswählen.
6. Branch **main** und Ordner **/(root)** auswählen; **Save**.
7. Veröffentlichung abwarten. Unter Pages wird die tatsächliche Adresse angezeigt, normalerweise **https://DEIN-NAME.github.io/elektromaster/**.
8. Die Adresse öffnen. Alle Lernbereiche sind ohne Konto nutzbar. Unten muss nach erfolgreicher Einrichtung **Offline bereit** erscheinen.

Alle App-Pfade sind relativ; ein Repository-Unterpfad wird unterstützt. Es gibt keinen Buildschritt. Die leere Datei .nojekyll ist enthalten; bei Git-Nutzung mit hochladen. Node-Dateien und Dokumentation dürfen mit im Repository liegen, sie sind für die Ausführung im Browser nicht nötig.

Minimal erforderliche Dateien:
index.html, app.js, engine.js, content.js, style.css, sw.js, manifest.webmanifest, icon.svg, icon-192.png, icon-512.png und .nojekyll.

Offizielle Anleitung: [GitHub Pages – Veröffentlichungsquelle konfigurieren](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

**Veröffentlichungsstatus dieser Übergabe:** vorbereitet, aber noch nicht in einem GitHub-Konto veröffentlicht. Es wurde kein Repository und keine öffentliche Website angelegt.

## 3. Auf dem iPhone installieren

1. Die veröffentlichte **HTTPS-Adresse** in Safari öffnen.
2. Vollständig laden lassen, bis **Offline bereit** angezeigt wird.
3. Das Teilen-Menü öffnen; je nach Safari-Anordnung zuerst das Seitenmenü und dann **Teilen**.
4. **Zum Home-Bildschirm** wählen. Falls vorhanden, **Als Web-App öffnen** aktivieren.
5. **Hinzufügen** wählen.
6. ElektroMaster über das neue Symbol starten und einmal online vollständig laden lassen.
7. Zum Prüfen Flugmodus aktivieren, die App schließen und erneut öffnen. Lernmodule und Aufgaben sollten weiter erreichbar sein.

Offizielle Anleitung: [Apple – Website als App auf dem iPhone verwenden](https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios).

Safari und Home-Bildschirm-App können unterschiedliche Speicherbereiche haben. Fortschritt bei Bedarf per Backup übertragen. Eine erstmalige Einrichtung ohne Netz ist nicht möglich. Browser und Betriebssystem können Offline-Daten bei Speicherknappheit entfernen.

## 4. So lernst du mit ElektroMaster

- **Lernmodule:** 61 kompakte Module mit Theorie, Beispielen, Fehlerhinweisen und Verständnisfragen. Gelesen-Markierungen sind getrennt vom Wissensstand.
- **Quiz:** Vier Antwortmöglichkeiten, zufällige Reihenfolge, sofortige Lösungserklärung.
- **Formeltrainer:** Formelauswahl, Formelzeichen, Umstellen, Lückenergänzungen, technische Formelwahl, Einheiten und Anwendungen.
- **Rechentrainer:** 16 Vorlagen mit zufälligen Werten. Ergebnisse selbst eingeben und die Einheit wählen. Dezimalkomma und Dezimalpunkt sind möglich; keine Tausendertrennzeichen verwenden. Auch wissenschaftliche Schreibweise wie 1,5e-3 wird verstanden.
- **Formelsammlung:** 35 Beziehungen mit Symbolen, SI-Einheiten, Umstellungen in Einzelschritten, Beispielen und Fehlerhinweisen.
- **Prüfung:** 30 Minuten; 8 MC-Fragen aus vier Gebieten plus 4 mehrteilige Rechenaufgaben. Teilantworten zählen jeweils einen Punkt. Lösungen erst nach Abgabe.
- **Wiederholen:** Falsche und unsichere Antworten sind sofort wieder fällig. Sichere Treffer verlängern die Abstände auf 1, 3, 7, 14, 30 und 60 Tage.

Die Zeit einer Prüfung läuft auch bei geschlossenem Fenster weiter. Bei erneutem Öffnen wird eine abgelaufene Prüfung ausgewertet. Es läuft kein Hintergrunddienst: Die tatsächliche Auswertung erfolgt beim nächsten aktiven Aufruf.

Rechenantworten werden mit 1 % relativer Toleranz bewertet, bei sehr kleinen Ergebnissen mindestens 0,00001 in der abgefragten Einheit. Eine falsche Einheit ergibt keinen Punkt. Mehrteilige Aufgaben geben Teilpunkte; für die Fortschrittsquote zählt eine Aufgabe nur dann als richtig, wenn alle Teilantworten richtig sind.

## 5. Motivation und Fortschritt

- 20 XP für eine vollständig richtige Antwort, sonst 5 XP.
- Pro Aufgabentyp und Kalendertag nur einmal XP, um bloßes Wiederholen nicht übermäßig zu belohnen.
- Alle 200 XP steigt das Level; ab Level 2 ist eine Antriebsherausforderung verfügbar.
- Tagesziele zählen verschiedene Aufgabentypen (5, 10 oder 20), nicht nur Klicks.
- Eine Lernserie zählt aufeinanderfolgende lokale Kalendertage mit bearbeiteten Aufgaben.
- Drei sichere richtige Antworten in Folge bedeuten „gefestigt“. Ein Fehler oder „unsicher“ setzt diese Serie zurück.
- Der Gesamtfortschritt umfasst 139 feste Fragen und 16 Rechenvorlagen. Zahlenvarianten zählen als derselbe Aufgabentyp.
- Eine Formel gilt als gefestigt, wenn alle zugehörigen festen Fragen gefestigt sind.
- Die adaptive Auswahl beginnt leichter und berücksichtigt zuletzt erreichte Ergebnisse. Fällige Fragen haben Vorrang.
- Prüfungsbestleistungen, Themenquoten und Lernaktivität sind in der Statistik sichtbar.

Die Aufgaben sind Lernmaterial; die technische Kurzprüfung ersetzt keine vollständige IHK-Prüfung.

## 6. Backup, Import und Datenspeicherung

Unter **Einstellungen → Backup exportieren** eine JSON-Datei speichern, z. B. in Dateien/iCloud Drive auf dem iPhone oder auf einem privaten Datenträger. Diese Nutzung eines eigenen Dateispeichers ist optional und keine App-Cloudanbindung.

Unter **Backup importieren** die Datei auswählen und das Ersetzen bestätigen. Der Import:
- prüft Formatversion und Datenstruktur;
- ersetzt den Fortschritt dieses Geräts, statt Datensätze zusammenzuführen;
- übernimmt XP, Antworten, Wiederholungsabstände, Lerntage, gelesene Module, Ziele, Farbschema und Prüfungsergebnisse;
- übernimmt keine laufende Prüfung oder Trainingseinheit;
- verändert bei einem ungültigen Backup den vorhandenen Fortschritt nicht.

Es gibt keine automatische Synchronisation zwischen Geräten. Exportiere vor Browserbereinigung, Gerätewechsel oder einem Wechsel der Webadresse. Browserdaten, privater Modus, andere Browserprofile und andere Ursprünge können getrennte Speicher verwenden. Die App zeigt Speicherfehler an; dann umgehend exportieren.

## 7. Umfang und fachliche Einordnung

Die Module decken die im Auftrag genannten technischen Themen kompakt ab. Die Tiefe variiert: Es gibt ausführlichere Rechenwege für Kernformeln, während Schutztechnik, SPS, Regelung und Fehlersuche zunächst Grundlagenmodule sind. Prinzipskizzen werden auf Themengebietsebene wiederverwendet; dies ist kein Schaltungssimulator und kein vollständiges Tabellenbuch.

IHK-orientiert bedeutet hier eigenständige technische Übungsaufgaben und betriebliche Szenarien, nicht offizielle Prüfungsfragen oder eine vollständige Abbildung des Rahmenplans. Recht, Betriebswirtschaft, Personalführung, Fachgespräch und sämtliche normativen Detailprüfungen sind nicht vollständig umgesetzt. Die technische Prüfungsverordnung nennt auch Organisation sowie Führung und Personal.

Es werden keine Tabellenbuchtexte oder Buchtabellen kopiert. Die Lerninhalte sind eigene Erklärungen und Beispiele. Normative Grenzwerte und reale Anlagenentscheidungen müssen anhand gültiger Regeln und der konkreten Anlage geprüft werden; die App erteilt keine Arbeitsfreigabe.

Fachlicher Bezug:
- [BGHM: Arbeiten an elektrischen Anlagen](https://www.bghm.de/arbeitsschuetzer/themen/elektrotechnik/arbeiten-an-elektrischer-anlagen-und-betriebsmitteln)
- [Prüfungsverordnung § 5](https://www.gesetze-im-internet.de/elekmeistprv_2004/__5.html)

## 8. Prüfung dieser Übergabe

Automatisierte Logiktests sind bestanden. Eine visuelle Browserkontrolle, echte Offline-Neuladung und Installation auf einem realen iPhone konnten in der Arbeitsumgebung nicht abgeschlossen werden, weil die lokale Vorschauverbindung scheiterte. Diese Punkte sind **unverifiziert**, nicht als bestanden ausgewiesen. Details und ein kurzer Abnahmetest stehen in PRUEFBERICHT.md.
