import React from 'react'
import { Col, Pagination, Row, Spin } from 'antd'
import { debounce } from 'lodash'
import Paragraph from 'antd/es/typography/Paragraph'

import MovieCard from '../MovieCard/MovieCard'
import { IMovie, MovieListProps, MovieListState } from '../../types/types'
import FilmService from '../../services/FilmService'

export default class MovieList extends React.Component<MovieListProps, MovieListState> {
  updateMovies: (page?: number) => void
  filmService: FilmService
  onChangeHandler: (page: number) => void
  searchMovie: (query: string) => void
  onError: (e: object) => void

  constructor(props: MovieListProps) {
    super(props)

    this.filmService = new FilmService()

    this.state = {
      query: '',
      url: '',
      movies: [],
      totalPages: 5,
      currentPage: 1,
      loading: true,
      error: false,
    }

    this.onError = (e: object) => {
      console.log(e)
      this.setState({
        error: true,
        loading: false,
      })
    }

    this.updateMovies = () => {
      if (this.props.rated) {
        this.filmService
          .getRatedMovies()
          .then((res) => res.json())
          .then((res) => {
            console.log(res)
            this.setState({
              totalPages: res.results.total_pages,
              currentPage: res.results.page,
              url: res.url,
            })
            return res.results
          })
          .then((movies) => {
            this.setState({
              movies: movies,
              loading: false,
            })
          })
          .catch(this.onError)
      }
      this.filmService
        .getAllMovies()
        .then((res) => {
          this.setState({
            totalPages: res.result.total_pages,
            currentPage: res.result.page,
            url: res.url,
          })
          return res.result.results
        })
        .then((movies) => {
          this.setState({
            movies: movies,
            loading: false,
          })
        })
        .catch(this.onError)
    }

    this.onChangeHandler = (page: number) => {
      this.props.searchQuery.length > 1
        ? this.filmService
            .switchPage(this.state.url.split('?').slice(0, 1).join(), page, this.props.searchQuery)
            .then((res) => {
              this.setState({
                totalPages: res.result.total_pages,
                currentPage: res.result.page,
                url: res.url,
                movies: res.result.results,
                loading: false,
              })
            })
            .catch(this.onError)
        : this.filmService
            .switchPage(this.state.url.split('?').slice(0, 1).join(), page)
            .then((res) => {
              this.setState({
                totalPages: res.result.total_pages,
                currentPage: res.result.page,
                url: res.url,
                movies: res.result.results,
                loading: false,
              })
            })
            .catch(this.onError)
    }

    this.searchMovie = debounce((query: string) => {
      this.filmService
        .searchMovie(query)
        .then((res) => {
          this.setState({
            totalPages: res.result.total_pages,
            currentPage: res.result.page,
            url: res.url,
            movies: res.result.results,
            loading: false,
          })
        })
        .catch(this.onError)
    }, 1000)
  }

  componentDidMount() {
    this.updateMovies()
  }

  componentDidUpdate(prevProps: { searchQuery: string }) {
    const { searchQuery } = this.props

    if (searchQuery !== prevProps.searchQuery) {
      if (searchQuery === '') {
        this.setState({
          loading: true,
        })
        this.updateMovies()
      } else {
        this.setState({
          loading: true,
        })
        this.searchMovie(searchQuery)
      }
    }
  }

  render() {
    const { movies, loading, error, currentPage, totalPages } = this.state

    const failSearch = !loading && movies.length === 0 ? <Paragraph>Nothing found</Paragraph> : null
    const content = !loading ? <Content arr={movies} /> : null
    const spinner = loading ? <Spin style={{ margin: '0 auto' }} /> : null
    const errorAlert = error ? <h1 style={{ margin: '0 auto' }}>Произошла ошибка...</h1> : null

    return (
      <React.Fragment>
        <Row gutter={[36, 36]}>
          {failSearch}
          {content}
          {spinner}
          {errorAlert}
        </Row>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '35px' }}>
          <Pagination
            onChange={this.onChangeHandler}
            current={currentPage}
            defaultCurrent={1}
            total={totalPages}
            style={{ margin: '0 auto' }}
          />
        </div>
      </React.Fragment>
    )
  }
}

const Content = ({ arr }: { arr: IMovie[] }) => {
  return (
    <React.Fragment>
      {arr.map(({ title, id, overview, release_date, poster_path, genre_ids, rating, vote_average }: IMovie) => {
        return (
          <Col span={12} className="gutter-row" key={id}>
            <div className="item">
              <MovieCard
                title={title}
                description={overview}
                date={release_date}
                img={poster_path}
                genres={[...genre_ids]}
                id={id}
                rating={rating}
                voteAverage={vote_average}
              />
            </div>
          </Col>
        )
      })}
    </React.Fragment>
  )
}
