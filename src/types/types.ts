export interface IMovie {
  title: string
  id: number
  overview: string
  release_date: string
  poster_path: string
  rating: number
  vote_average: number
  genre_ids: []

  [x: string]: any
}

export interface MovieListState {
  movies: IMovie[]
  url: string
  query: string
  error: boolean
  loading: boolean
  totalPages: number
  currentPage: number
}

export interface MovieListProps {
  searchQuery: string
  rated: boolean
}

export interface MovieCardProps {
  title: string
  description: string
  date: string
  img: string
  genres: []
  id: number
  rating: number
  voteAverage: number
  loading?: boolean
  error?: boolean
}

export interface AppState {
  searchQuery: string
  sessionId: string
  genres: []
}
