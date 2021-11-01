import React, { Component } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import config from "../../../config";

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      auth: {},
      loading: {
        newReleases: true,
        playlists: true,
        categories: true,
      },
      newReleases: [],
      playlists: [],
      categories: [],
    };
  }

  async componentDidMount() {
    await this.auth();
    await Promise.all([
      await this.fetchData("new-releases", "albums", "newReleases"),
      await this.fetchData("featured-playlists", "playlists", "playlists"),
      await this.fetchData("categories", "categories", "categories"),
    ]);
  }

  async auth() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization:
          "Basic " +
          new Buffer(
            config.api.clientId + ":" + config.api.clientSecret
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!response.ok) return;
    const data = await response.json();
    this.setState({
      auth: data,
    });
  }

  async fetchData(path, resourceType, stateKey) {
    const response = await fetch(`${config.api.baseUrl}/browse/${path}`, {
      method: "GET",
      headers: new Headers({
        Authorization: `${this.state.auth.token_type} ${this.state.auth.access_token}`, // Using Temp
        "Content-Type": "application/json",
      }),
    });
    const data = await response.json();
    this.setState({
      [stateKey]: data[resourceType].items,
      loading: {
        ...this.state.loading,
        [stateKey]: false,
      },
    });
  }

  render() {
    const { newReleases, playlists, categories, loading } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock
          text="RELEASED THIS WEEK"
          id="released"
          data={newReleases}
          loading={loading.newReleases}
        />
        <DiscoverBlock
          text="FEATURED PLAYLISTS"
          id="featured"
          data={playlists}
          loading={loading.playlists}
        />
        <DiscoverBlock
          text="BROWSE"
          id="browse"
          data={categories}
          imagesKey="icons"
          loading={loading.categories}
        />
      </div>
    );
  }
}
