import * as types from "./../constants/ActionTypes";
import v4 from 'uuid/v4';
import {apikey} from '../../.env';

export const nextLyric = (currentSongId) => ({
  type: types.NEXT_LYRIC,
  currentSongId
});

export const restartSong = (currentSongId)=>({
  type: types.RESTART_SONG,
  currentSongId
});

export const changeSong= (newSelectedSongId) => ({
  type: types.CHANGE_SONG,
  newSelectedSongId
});

export function fetchSongId(title) {
  return function (dispatch) {
    const localSongId = v4();
    dispatch(requestSong(title, localSongId));
    title = title.replace(' ', '_');
    return fetch('http://api.musixmatch.com/ws/1.1/track.search?&q_track=' + title + '&page_size=1&s_track_rating=desc&apikey=' + apikey).then(
      response => response.json(),
      error => console.log('An error occured.', error)
    ).then(function(json) {
      if(json.message.body.track_list.length > 0){
        const musicMatchId = json.message.body.track_list[0].track.track_id;
        const artist = json.message.body.track_list[0].track.artist_name;
        const title = json.message.body.track_list[0].track.track_name;
        fetchLyrics(title, artist, musicMatchId, localSongId, dispatch);
      } else {
        console.log('we could\'nt locate a song under that ID!');
      }
    });
  };
}

export function fetchLyrics(title, artist, musicMatchId, localSongId, dispatch) {
  return fetch('http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=' + musicMatchId + '&apikey='+ apikey).then(
    response => response.json(),
    error=> console.log('An error occured', error)
  ). then(function(json){
    console.log('Hey Wow, A second API Response', json);
  });
}

export const requestSong = (title, localSongId) => ({
  type: types.REQUEST_SONG,
  title,
  songId: localSongId
});
