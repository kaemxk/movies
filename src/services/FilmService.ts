export default class FilmService {
  _apiBase = 'https://api.themoviedb.org/3'
  _apiKey = '?api_key=29aa99406ab37ae56592216823a7b9fc'

  async getResource(url: string, page = 1, query?: string) {
    let res
    query
      ? (res = await fetch(`${url}${this._apiKey}&page=${page}&query=${query}`))
      : (res = await fetch(`${url}${this._apiKey}&page=${page}`))

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }

    const result = await res.json()

    return {
      result,
      url: res.url,
    }
  }

  async getAllMovies() {
    return await this.getResource('https://api.themoviedb.org/3/movie/popular')
  }

  async switchPage(url: string, page: number, query?: string) {
    let res
    query ? (res = await this.getResource(url, page, query)) : (res = await this.getResource(url, page))
    return res
  }

  async searchMovie(query: string) {
    console.log(this.getResource('https://api.themoviedb.org/3/search/movie', 1, query))
    return await this.getResource('https://api.themoviedb.org/3/search/movie', 1, query)
  }

  async createGuestSession() {
    return await fetch(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=29aa99406ab37ae56592216823a7b9fc'
    )
  }

  async deleteSession() {
    const session = localStorage.getItem('session')
    return await fetch('https://api.themoviedb.org/3/authentication/session?api_key=29aa99406ab37ae56592216823a7b9fc', {
      method: 'DELETE',
      body: JSON.stringify({
        session_id: session,
      }),
    })
  }

  async rateMovie(rate: number, id: number) {
    const session = localStorage.getItem('session')
    return await fetch(`https://api.themoviedb.org/3/movie/${id}/rating${this._apiKey}&guest_session_id=${session}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rate,
      }),
    })
  }

  async getRatedMovies() {
    const session = localStorage.getItem('session')
    return await fetch(
      `https://api.themoviedb.org/3/guest_session/${session}/rated/movies${this._apiKey}&language=en-US&sort_by=created_at.asc`
    )
  }

  async getGenres() {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list${this._apiKey}`)
    return res.json()
  }
}
