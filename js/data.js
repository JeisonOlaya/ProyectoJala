/**
 * data.js — Datos mock de SpotiMath
 * -------------------------------------------------------
 * 10 géneros musicales, cada uno con 10 artistas representativos
 * (100 artistas en total en el catálogo).
 *
 * También se definen los conjuntos de referencia y la relación
 * binaria que usa el Dashboard Matemático (Fase 2).
 */

// Catálogo principal: 10 géneros x 10 artistas
const GENEROS = [
  { id: 'rock', nombre: 'Rock', icono: '🎸', color: '#E13300',
    artistas: ['Queen', 'Led Zeppelin', 'AC/DC', "Guns N' Roses", 'Nirvana',
               'Pink Floyd', 'The Rolling Stones', 'Metallica', 'Foo Fighters', 'Red Hot Chili Peppers'] },
  { id: 'pop', nombre: 'Pop', icono: '🎤', color: '#E91E63',
    artistas: ['Taylor Swift', 'Ariana Grande', 'Dua Lipa', 'Bruno Mars', 'Katy Perry',
               'Justin Bieber', 'Adele', 'Ed Sheeran', 'Lady Gaga', 'Shawn Mendes'] },
  { id: 'electronic', nombre: 'Electronic', icono: '🎛️', color: '#00BCD4',
    artistas: ['Daft Punk', 'Calvin Harris', 'Avicii', 'Marshmello', 'David Guetta',
               'Skrillex', 'Deadmau5', 'The Chainsmokers', 'Kygo', 'Martin Garrix'] },
  { id: 'jazz', nombre: 'Jazz', icono: '🎷', color: '#FFC107',
    artistas: ['Miles Davis', 'John Coltrane', 'Louis Armstrong', 'Ella Fitzgerald', 'Duke Ellington',
               'Charlie Parker', 'Nina Simone', 'Thelonious Monk', 'Chet Baker', 'Billie Holiday'] },
  { id: 'hiphop', nombre: 'Hip-Hop', icono: '🎧', color: '#9C27B0',
    artistas: ['Kendrick Lamar', 'Drake', 'Eminem', 'Kanye West', 'Jay-Z',
               'Nas', 'J. Cole', 'Travis Scott', 'Tyler, The Creator', 'Lil Wayne'] },
  { id: 'reggaeton', nombre: 'Reggaeton', icono: '🔥', color: '#FF5722',
    artistas: ['Bad Bunny', 'J Balvin', 'Daddy Yankee', 'Karol G', 'Feid',
               'Ozuna', 'Anuel AA', 'Rauw Alejandro', 'Wisin & Yandel', 'Don Omar'] },
  { id: 'clasica', nombre: 'Clásica', icono: '🎻', color: '#8BC34A',
    artistas: ['Beethoven', 'Mozart', 'Bach', 'Chopin', 'Vivaldi',
               'Tchaikovsky', 'Brahms', 'Debussy', 'Handel', 'Schubert'] },
  { id: 'metal', nombre: 'Metal', icono: '🤘', color: '#78909C',
    artistas: ['Iron Maiden', 'Black Sabbath', 'Slayer', 'Megadeth', 'Judas Priest',
               'Pantera', 'Slipknot', 'Tool', 'System of a Down', 'Motörhead'] },
  { id: 'indie', nombre: 'Indie', icono: '🌿', color: '#4CAF50',
    artistas: ['Arctic Monkeys', 'Tame Impala', 'The Strokes', 'Vampire Weekend', 'Florence + The Machine',
               'MGMT', 'Alt-J', 'The National', 'Phoebe Bridgers', 'Mac DeMarco'] },
  { id: 'salsa', nombre: 'Salsa', icono: '💃', color: '#F44336',
    artistas: ['Héctor Lavoe', 'Rubén Blades', 'Willie Colón', 'Celia Cruz', 'Marc Anthony',
               'Gilberto Santa Rosa', 'Grupo Niche', "Óscar D'León", 'Tito Puente', 'Fruko y sus Tesos'] }
];

// Conjunto de referencia B (modo "Géneros" del Venn): géneros en tendencia global,
// fijo e independiente de lo que el usuario seleccione en la Fase 1.
const GENEROS_TENDENCIA = ['pop', 'reggaeton', 'hiphop', 'electronic', 'indie'];

// Conjunto de referencia B (modo "Artistas" del Venn): artistas destacados/verificados
// del catálogo, también fijo e independiente de la selección del usuario.
const ARTISTAS_DESTACADOS = [
  'Queen', 'Nirvana', 'Metallica', 'Taylor Swift', 'Adele', 'Daft Punk', 'Avicii',
  'Miles Davis', 'Ella Fitzgerald', 'Kendrick Lamar', 'Jay-Z', 'Bad Bunny', 'Karol G',
  'Beethoven', 'Iron Maiden', 'Arctic Monkeys', 'Celia Cruz', 'Marc Anthony'
];

// Relación binaria "Influencia musical" definida sobre el conjunto de Géneros (R ⊆ Géneros x Géneros).
// El par (gOrigen, gDestino) se lee: "gOrigen ha influenciado musicalmente a gDestino".
const RELACION_INFLUENCIA = [
  ['rock', 'rock'], ['rock', 'metal'], ['metal', 'rock'], ['metal', 'metal'],
  ['pop', 'pop'], ['pop', 'electronic'], ['electronic', 'pop'],
  ['hiphop', 'reggaeton'], ['reggaeton', 'hiphop'],
  ['indie', 'rock'], ['rock', 'jazz'], ['jazz', 'clasica'],
  ['salsa', 'jazz'], ['clasica', 'clasica']
];
