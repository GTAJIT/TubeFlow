import { RecoilRoot } from "recoil"
import Page from "./Page"
import { BrowserRouter } from "react-router-dom"

function App() {
  return (
    <>
  <BrowserRouter>
    <RecoilRoot>
      <Page/>
    </RecoilRoot>
  </BrowserRouter>
    </>
  )
}

export default App
