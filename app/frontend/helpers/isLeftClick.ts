const isLeftClick = (e, action) => {
  if (e.button === 0) {
    e.preventDefault()
    action()
  }
}

export default isLeftClick
