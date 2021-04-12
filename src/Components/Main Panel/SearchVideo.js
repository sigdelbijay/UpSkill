import _ from 'lodash'
import React, { Component } from 'react'
import faker from 'faker'
import { withRouter } from 'react-router-dom'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'

const initialState = { isLoading: false, results: [], value: '' }

// const getResults = () =>
//   _.times(5, () => ({
//     title: faker.company.companyName(),
//     description: faker.company.catchPhrase(),
//     image: faker.internet.avatar(),
//     price: faker.finance.amount(0, 100, 2, '$'),
//   }))

const getResults = (videos) => {
  const results = {}
  const topics = getTopics(videos)
  for (let topic of topics) {
    results[topic] = {
      name: topic,
      results: Object.values(videos).filter(video => video.videoTopic.toLowerCase() === topic).map(video => ({
        title: video.videoTitle,
        description: `Uploaded by: ${video.uploadedBy.name}`,
        image: `http://img.youtube.com/vi/${video.videoLink.split('v=').pop().split('&')[0]}/0.jpg`,
        id: video.id
      }))
    }
  }
  return results
}

const getTopics = (videos) => {
  const topics = []
  for (let video of Object.values(videos)) {
    if (topics.indexOf(video.videoTopic.toLowerCase()) === -1) {
      topics.push(video.videoTopic.toLowerCase())
    }
  }
  return topics
}



// const source = _.range(0, 3).reduce((memo) => {
//   const name = faker.hacker.noun()

//   // eslint-disable-next-line no-param-reassign
//   memo[name] = {
//     name,
//     results: getResults(),
//   }

//   return memo
// }, {})

// console.log("source", source)


// const source = () => {
//   const { videos } = this.props
//   const newVideos = Object.values(videos).
// }

class SearchExampleCategory extends Component {
  state = initialState

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title })
    this.props.history.push(`/video/${result.id}`)
  }

  handleSearchChange = (e, { value }) => {

    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => re.test(result.title)

      // console.log("source", source)
      const filteredResults = _.reduce(
        getResults(this.props.videos),
        (memo, data, name) => {
          const results = _.filter(data.results, isMatch)
          if (results.length) memo[name] = { name, results } // eslint-disable-line no-param-reassign

          return memo
        },
        {},
      )

      this.setState({
        isLoading: false,
        results: filteredResults,
      })
    }, 300)
  }

  render() {
    const { isLoading, value, results } = this.state
    const { videos } = this.props

    return (
      <Grid>
        <Grid.Column>
          <Search
            category
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            results={results}
            value={value}
          />
        </Grid.Column>
        {/* <Grid.Column width={8}>
          <Segment>
            <Header>State</Header>
            <pre style={{ overflowX: 'auto' }}>
              {JSON.stringify(this.state, null, 2)}
            </pre>
            <Header>Options</Header>
            <pre style={{ overflowX: 'auto' }}>
              {JSON.stringify(getResults(videos), null, 2)}
            </pre>
          </Segment>
        </Grid.Column> */}
      </Grid>
    )
  }
}

export default withRouter(SearchExampleCategory)
