# Progetto MonsterWater
	
![Image Preview](/imageRD/fina.png)
	
### Descrizione

Il progetto va ad esplorare l’uso della realtà aumentata in ambito web, con le librerie jsartoolkit5 e threex per la realtà aumentata e la libreria three js per il rendering in real-time. Il progetto Monster inside water necessità di marker AR specifici qui rappresentati:

![Image Marker](/imageRD/marker.png)

I marker partendo da sinistra sono:
* Marker C: usato per posizionare la seconda bolla d’acua nella quale il ‘mostro‘ potrà o meno entrare.
* Marker B: usato per settare il valore blu della luce.
* Marker A: usato per posizionare la luce puntiforme e il suo lensflare, contiene anche il piano per le ombre grande 100 unità per lato.
* Marker G: usato per settare il valore verde della luce.
* Marker R: usato per settare il valore rosso della luce.
* Marker +: usato come origine per i valori dei colori RGB.
* Monster : marker principale in cui risiede la creatura con la sua bolla d’acqua.

I marker sono utilizzabili quasi tutti individualmente, tranne i marker R, G, B; che necessitano del marker + per cambiare il colore della luce sulla base della loro distanza.

Per tanto si consiglia di usarli in tale ordine, anche se ogni altro ordine non influirà sulla resa purchè il marker + rimanga al centro. Il mostro oltre che a muoversi all’interno della bolla seguendo un animazione prefissata andrà a saltare, in maniera puramente pseudocasuale, tra la bolla del marker C e Monster.

![Image Croce](/imageRD/rgb.png)

Mentre la luce ancorata al marker A potrà essere spostata o anche ‘nascosta‘, così facendo si andrà a muovere o a rimuovere la fonte di luce e l’illuminazione da essa generata.


### Codice

#### Breve spiegazione

Il progetto consiste in una web-app risiedente su un server Apache. Composta da una pagina web principale, denominata ProjettoAR.html, che comprende anche l’inizializzazione delle librerie di jsartoolkit5 e di threex. In ProjettoAR.html si trova la definizione della scena 3D e il render della medesima. Per le bolle d’acqua viene usato l’oggetto WaterBall contenuto in WaterBall.js che ne gestisce la creazione e l’update. Per il materiale delle bolle si fa uso di uno ShaderMaterial che ne modificano sia il vertex che il fragment, le rifrazioni sulle bolle sono ottenute passando il video della webcam come una VideoTexture al material. All’interno di Projetto.html è contenuto anche la gestione delle collisioni sferiche tra il mostro e le bolle d’acqua, precisamente tra il centro d’origine del mostro e la bolla , il primo osso della coda e la bolla , l’osso della testa e la bolla e la coda con la bolla. Le altre librerie usate sono GLTFLoader.js e DRACOLoader.js per aprire i file GLTF 2.0, e la libreria Lensflare.js per l’effetto Lensflare sulla luce; entrambe offerte da Three.js.

#### Limiti del progetto
* Al momento la gestione della direzione di dove mostro va a puntare è un pò imprecisa, a causa del lookAt che gestisce il vettore ‘up‘ in maniera un pò innacurata, e può essere ruotata sull’asse z del mostro.
* Lieve ‘sfarfallio‘ del riconoscimento dei marker che può rendere l’esperienza intermittente, compromettendo anche le ombre proiettate. Probabilmente causato dal’uso di una telecamera a bassa risoluzione.
* Mancanza di un effetto di ‘glossy‘ influenzato sia dalla scena 3D, sia dal mondo reale. Riguardo al riflesso indotto dal mondo reale si dovrà far uso di una seconda webcam, preferibilmente a 360°.
* Può essere un pò pesante su hardware non molto performante.
* Obbligo di un web-server e di un browser per funzionare, nessun problema attualmente riscontrato sui vari browser che implementano almeno WebGL 1.0.
 	
### Programmi usati

* immagini e texture Paint.net ver: 4.205  
* shader test ShaderToy	  
* editor di testo Notepad++ ver: 7.8.5 
* server Web Apache ver: 2.4  
* Modellazione 3D Blender ver: 2.8.2


### Marker
| --- | --- | --- |
| ![Image A](/imageRD/letterA.png) | ![Image B](/imageRD/letterB.png) | ![Image C](/imageRD/letterC.png) |
| ![Image G](/imageRD/letterG.png) | ![Image R](/imageRD/letterR.png) | ![Image PLUS](/imageRD/letterPLUS.png) |
| ![Image monsterW](/imageRD/monsterW.png) | | |
