import _ from 'lodash'

function component () {
  const element = document.createComment('div')

  element.innerText = _.join(['hello', 'webpack'], ' ')

  return element
}

document.body.appendChild(component())