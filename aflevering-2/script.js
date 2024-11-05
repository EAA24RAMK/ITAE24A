/*
Constructor function til at lave album objekter.
artist - Navnet på kunstneren.
album - Navnet på albummet.
totalTracks - Antallet af numre på albummet.
productionYear - Udgivelsesåret for albummet.
 */
function Album(artist, album, totalTracks, productionYear) {
    this.artist = artist;
    this.album = album;
    this.totalTracks = totalTracks;
    this.productionYear = productionYear;
}

/*
Funktion til at tilføje en div til HTML-siden med albumoplysninger.
album - Album-objektet, der skal vises på siden.
parentid - ID'et på HTML-elementet, hvor div'en skal placeres.
 */
function addDivWithAlbum(album, parentid) { 
    let parentElement = document.getElementById(parentid); // Finder HTML elementet med id'et parentid
    if (!parentElement) {
        console.error(`Element med id ${parentid} blev ikke fundet`); // Viser fejl i console hvis elementet ikke findes
        return;
    }

    let albumDiv = document.createElement('div'); // Opretter en div til albummet
    albumDiv.className = 'album'; // Tilføjer en klasse til div'en

    /* Tilføjer HTML til albumDiv, 
    kunstnerens navn, albumtitel, udgivelsesår, antal numre, 
    en knap til at vise/skjule trackliste, og en tom div til tracklisten.
    */
    albumDiv.innerHTML = `
        <h2>${album.artist}: ${album.album}</h2>
        <p>Udgivelsesår: ${album.productionYear}</p>
        <p>Antal numre: ${album.totalTracks}</p>
        <button onclick="toggleTracklist('${album.album}')">Vis/Skjul trackliste</button>
        <div id="${album.album}-tracks" style="display: none;">
            <!-- Tracklisten vil blive tilføjet her -->
        </div>
    `;

    parentElement.appendChild(albumDiv); // Tilføjer den nye div som et child til parent elementet så det vises på siden
}

// En magisk formular
async function fetchContent(url) {
    let request = await fetch(url);
    let json = await request.json();
    return json;
}

// Henter JSON-data og opret albumobjekter med tracklister
fetchContent("albums.json").then((albums) => { // Arrow notation
    console.log("Original Data: ", albums); // Logger 'original data' til console
    let albumObjects = []; // En tom liste til albumobjekter
    for (let i = 0; i < albums.length; i++) { // Går igennem hvert album fra albums.json
        const album = new Album( // Nye albumobjekter
            albums[i].artistName,
            albums[i].albumName,
            albums[i].trackList.length,
            albums[i].productionYear
        );
        albumObjects.push(album); // Tilføjer albumObjects til listen album
    }
    console.log("Object Data: ", albumObjects); // Logger dem til console
    albumObjects.forEach(function (a) { // Tilføjer hvert album til HTML siden
        addDivWithAlbum(a, "content");
    });
    albums.forEach(function (album) { // Tilføj tracklister efter at alle album-div'er er oprettet
        addTracklist(album.albumName, album.trackList);
    });
}).catch(error => {
    console.error("Error fetching content:", error); // Logger fejl, hvis albums, json ikke kan læses
});

/**
 Funktion til at tilføje tracklisten til et album.
 albumId - ID'et på albummet, som der skal en trackliste på.
 tracks - Array af numre på albummet.
 */
 function addTracklist(albumId, tracks) {
    let tracklistDiv = document.getElementById(`${albumId}-tracks`); // Finder div'en til tracklisten for det givne album
    if (!tracklistDiv) {
        console.error(`Tracklist div for album ${albumId} blev ikke fundet`); // Hvis div'en ikke findes logger den en fejl
        return;
    }

    let tracklistHtml = '<ul>'; // Opretter HTML for tracklisten
    tracks.forEach(track => {
        tracklistHtml += `<li>${track.trackTitle}</li>`;
    });
    tracklistHtml += '</ul>'; // Linje 107-110 tilføjer hvert nr til tracklisten

    tracklistDiv.innerHTML = tracklistHtml; // Tilføjer tracklisten til div'en
}

/*
 Funktion til at vise/skjule tracklisten.
 albumId - ID'et på albummet, hvis trackliste skal vises/skjules.
 */
 function toggleTracklist(albumId) {
    let tracklistDiv = document.getElementById(`${albumId}-tracks`); // Finder div'en til tracklisten for hvert album
    if (tracklistDiv.style.display === 'none') { // Tjekker om tracklisten er vist eller ej, referer til css
        tracklistDiv.style.display = 'block'; // Viser tracklisten
    } else {
        tracklistDiv.style.display = 'none'; // Skjuler den igen
    }
}
