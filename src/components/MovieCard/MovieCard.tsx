import React from 'react'
import { Button, Col, Image, Rate, Row, Typography } from 'antd'
import { format } from 'date-fns'

import { MovieCardProps } from '../../types/types'
import FilmService from '../../services/FilmService'
import { MovieConsumer } from '../MoviesContext'

const { Title, Paragraph } = Typography

const MovieCard = ({ title, description, date, img, genres, id, rating, voteAverage }: MovieCardProps) => {
  const cutDescription = (description: string) => {
    if (description.length < 1) return <Paragraph>No description :(</Paragraph>
    return description.split(' ').length > 31 ? description.split(' ').slice(0, 30).join(' ') + '...' : description
  }

  const filmService = new FilmService()

  const onRate = (rate: number): void => {
    filmService.rateMovie(rate, id)
  }

  let borderColor = '#000'
  if (voteAverage <= 3) {
    borderColor = '#E90000'
  } else if (voteAverage <= 5) {
    borderColor = '#E97E00'
  } else if (voteAverage <= 7) {
    borderColor = '#E9D100'
  } else {
    borderColor = '#66E900'
  }

  return (
    <Row wrap={false} justify={'start'}>
      <Col style={{ height: '281px', maxWidth: '183px', minWidth: '183px' }}>
        {img ? <Image width={183} height="281px" src={'https://image.tmdb.org/t/p/original' + img} /> : <h1>No img</h1>}
      </Col>
      <Col style={{ padding: '20px', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            border: `1px solid ${borderColor}`,
            borderRadius: '50%',
            paddingTop: '3px',
            paddingLeft: '1px',
            height: '30px',
            width: '30px',
          }}
        >
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {voteAverage.toFixed(1)}
          </span>
        </div>
        <Title level={5}>{title}</Title>
        {date ? (
          <Paragraph>{format(new Date(date), 'MMMM d, y')}</Paragraph>
        ) : (
          <Paragraph>Invalid date value</Paragraph>
        )}
        <Genres arr={genres} />
        <Paragraph style={{ marginTop: '10px' }}>{cutDescription(description)}</Paragraph>
        <Rate count={10} onChange={onRate} value={rating} />
      </Col>
    </Row>
  )
}

const Genres = ({ arr }: { arr: number[] }) => {
  return (
    <MovieConsumer>
      {(genres: { id: number; name: string }[]) => {
        const newArr: string[] = []
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < genres.length; j++) {
            if (arr[i] === genres[j].id) {
              newArr.push(genres[j].name)
            }
          }
        }
        return newArr.map((i: string) => {
          return (
            <Button size="small" key={i}>
              {i}
            </Button>
          )
        })
      }}
    </MovieConsumer>
  )
}

export default MovieCard
