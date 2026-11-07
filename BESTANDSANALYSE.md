# Bestandsprüfung ElektroMaster 1.0 → 2.0

Alle 21 Dateien der im Work-Chat erstellten Version 1.0 waren vollständig verfügbar. Die Ausgangskopie liegt unverändert unter work/baseline im Arbeitsprojekt. Es wurde die vorhandene App erweitert; content.js, Inhaltskennungen und bisherige Lernlogik bilden weiterhin die Grundlage.

Ausgangsort: C:/Users/Lenny/Documents/Codex/2026-10-24/files-pasted-by-the-user-projektauftrag/outputs/ElektroMaster.

Erhaltener Umfang: 61 Lernmodule, 35 Grundformeln, 139 feste Fragen und 16 variable Rechenvorlagen; dazu adaptive Auswahl, Wiederholung, Statistik, Prüfungen, Offline-Funktion, Darstellung und lokale Backups. V1 speicherte den Stand unter elektromaster.v1. V2 übernimmt diese Daten mit zusätzlicher Sicherheitskopie und eigenen Erweiterungsfeldern.

Die Originaltests wurden zuerst gegen den Bestand und anschließend gegen die Erweiterung ausgeführt. Die UI-Testvorbereitung wurde an V2-Speicherschlüssel und Modulauswahl angepasst; die bisherigen Bedienabläufe werden weiterhin getestet.

Die nachfolgende Liste enthält den SHA-256 der jeweiligen **Ausgangsdatei**. Dokumentationsdateien sind in der fertigen Übergabe ebenfalls auf V2 aktualisiert, auch wenn der Vergleich vor dem Zusammenstellen der Unterlagen noch unverändert meldete.

| Ausgangsdatei | Stand vor Dokumentationsabschluss | SHA-256 des Originals |
|---|---|---|
| .nojekyll | unverändert | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ANLEITUNG.md | unverändert | 2b91c002db6e2ee269e181f1e953bdef17457e1b30b12f8986beba153ccb1df3 |
| PRUEFBERICHT.md | unverändert | 6d6d2e49207c4dcc77e8d479290a7bd5c1e4c76b16ee89273896b89ea5f400a7 |
| README.md | unverändert | f9d87c0402f2206e817b59b850db3e6b8b00e271243ed75a6d9ce9c5f51496b2 |
| Starten.cmd | unverändert | ed9e3103ac43de9538bbd6a43c59a1403007f2a1ad40ebbc7583e6e0178587dc |
| TECHNIK.md | unverändert | 3a1d7d3c600db804abb97060801c09b3400a362b01f28e461aa100a2b1901968 |
| app.js | weiterentwickelt | 34bd5b4465bbaad849449be354823955ce1f84e38245f6c7a6e5598cf2bdd828 |
| content.js | unverändert | fc02c34070ec968eed678fe9023d08f88ac30525b397a917fa8623fb54e23af6 |
| engine.js | weiterentwickelt | b78463a031d4feb2be7ee2c6cb7da1509f07988a9c9ce820bcf93c513546ef8b |
| icon-192.png | unverändert | 81c7003a2ff3e939530d83e1f56f0960471fe8d3b810bde8bf1deadc313204b9 |
| icon-512.png | unverändert | a964c7e2f87d65f4920ae440ac17b6ffa66afbc98eb2130728455ca4302a94ba |
| icon.svg | unverändert | 9f525e4be9a7075d0a37e2cc053a28b008741a34bdc8fe30a543340c161deb38 |
| index.html | unverändert | 3db75f16033514f7478f987dbbc7e90da0283f9a0dacb724cc850fee3b5589f3 |
| manifest.webmanifest | weiterentwickelt | 42f33fc4758893c70cb29aa48830816e9a42eb9cf47f065d5cf1151ddfb13240 |
| package.json | weiterentwickelt | e6d9d33ce005913d0439bdd86746eef31966ceb5fff5794b25ceac8a2bb3007b |
| server.mjs | unverändert | e253f2ac8f351d7177b3fd541f38b7ca80bb52a694b52ee71b4a3aee65911794 |
| style.css | weiterentwickelt | 6abc37461a5ced693641575494db2feb7aa6dd7d67eb38d2ced070b3d69ea02d |
| sw.js | weiterentwickelt | 5ff056a6d679a8d695daf136a9f460aed49f0b0df20e5602b378de226e7de888 |
| tests-formulas.mjs | unverändert | 157975a61add45f7c0ed8d06b9ab89b2a2c6281984ead07c97b7c36076e3606a |
| tests-ui.mjs | weiterentwickelt | be27e94f493ae506cce72b5d5d1e4343e77c08cb2382f4e1bda09dad419e84bc |
| tests.mjs | unverändert | 3843faec5162c8c77ea7f65bda110ecb3b938e6d15db4a2498e9fa70eed90d6d |

Neu: state.js, daily.js, knowledge.js, diagrams.js, features.js, platform.js, drei V2-Testdateien sowie Bestandsanalyse und Neuerungen.
