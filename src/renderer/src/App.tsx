function App(): React.JSX.Element {
  const toggleOverlay = (): void => {
    window.api.overlay.toggleOverlay()
  }

  return (
    <>
      <button onClick={toggleOverlay}>Toggle Overlay</button>
    </>
  )
}

export default App
