import React from 'react'
import './App.css'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'

import MovieList from '../MovieList/MovieList'
import SearchBar from '../SearchBar/SearchBar'
import { AppState } from '../../types/types'
import FilmService from '../../services/FilmService'
import { MovieProvider } from '../MoviesContext'

export default class App extends React.Component<object, AppState> {
  onTabChange: (key: string) => void
  filmService: FilmService
  onChangeHandler: (text: string) => void

  constructor(props: object) {
    super(props)

    this.filmService = new FilmService()

    this.state = {
      searchQuery: '',
      sessionId: '',
      genres: [],
    }

    this.onChangeHandler = (text: string) => {
      this.setState({
        searchQuery: text,
      })
    }
    this.onTabChange = (key: string) => {
      console.log(key)
    }
  }

  Search = () => {
    return (
      <React.Fragment>
        <SearchBar onInputChange={this.onChangeHandler} value={this.state.searchQuery} />
        <MovieList searchQuery={this.state.searchQuery} rated={false} />
      </React.Fragment>
    )
  }

  Rated = () => {
    return (
      <React.Fragment>
        <MovieList searchQuery={this.state.searchQuery} rated={true} />
      </React.Fragment>
    )
  }

  componentDidMount() {
    this.filmService
      .createGuestSession()
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          sessionId: res.guest_session_id,
        })
        localStorage.setItem('session', res.guest_session_id)
        console.log(localStorage.getItem('session'))
      })
    this.filmService.getGenres().then((res) => {
      this.setState({
        genres: res.genres,
      })
    })
  }

  componentWillUnmount() {
    this.filmService.deleteSession().then(() => localStorage.removeItem('session'))
  }

  render() {
    const items: TabsProps['items'] = [
      {
        key: '1',
        label: 'Search',
        children: <this.Search />,
      },
      {
        key: '2',
        label: 'Rated',
        children: <this.Rated />,
      },
    ]

    return (
      <div className="wrapper">
        <MovieProvider value={this.state.genres}>
          <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={this.onTabChange}
            centered={true}
            destroyInactiveTabPane={true}
          />
        </MovieProvider>
      </div>
    )
  }
}
