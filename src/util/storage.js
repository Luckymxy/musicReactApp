export default {
    setCurrentSong(song) {
        localStorage.setItem('song', JSON.stringify(song));
    },
    getCurrentSong() {
        let song = localStorage.getItem('song')
        return song ? JSON.parse(song) : {};
    },
    setSongs(songs) {
        localStorage.setItem('songs', JSON.stringify(songs));
    },
    getSongs() {
        let songs = localStorage.getItem('songs')
        return songs ? JSON.parse(songs) : {};
    }
}

