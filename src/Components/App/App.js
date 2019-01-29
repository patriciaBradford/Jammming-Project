import React, { Component } from 'react';
import './App.css';
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  //search on Spotify and return values
  search(term) {
    Spotify.searchSpotify(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  // add track to playlist - check to see if it exists in list first
   addTrack(track) {
      if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
        return;
      }
      this.setState({playlistTracks: [...this.state.playlistTracks, track]});
    }

  // remove track by filtering it out of playlistTracks array
    removeTrack(track) {
      this.setState({playlistTracks: this.state.playlistTracks.filter(item => item.id !== track.id)});
    }

    savePlaylist() {
      let trackURIs = [];
      for (let i=0; i<this.state.playlistTracks.length; i++) {
        trackURIs.push(this.state.playlistTracks[i].uri);
      }
      Spotify.savePlaylist(this.state.playlistName, trackURIs);
      this.setState({playlistName: 'New Playlist'});
    }

    updatePlaylistName(name) {
      this.setState({
        playlistName: name
      });
    }

  //this was a hint from one of the Mods to stop the screen from flashing
    componentDidMount() {
      Spotify.getAccessToken();
    }

    render() {
      return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar
              onSearch={this.search}
            />
            <div className="App-playlist">
              <SearchResults
                searchResults={this.state.searchResults}
                onAdd={this.addTrack}
              />
              <Playlist
                playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}
              />
            </div>
          </div>
        </div>
      );
  }
}

export default App;
