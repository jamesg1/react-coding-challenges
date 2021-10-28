import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import config from '../../../config';

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: []
    };
  }

  componentDidMount() {
    this.fetchNewReleases();
  }

  async fetchNewReleases() {
    const response = await fetch(`${config.api.baseUrl}/browse/new-releases`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': config.api.tempToken, // Using Temp
        'Content-Type': 'application/json'
      })
    });
    const newReleases = await response.json();
    this.setState({ newReleases: [...newReleases.albums.items] });
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
