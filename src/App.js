import * as mobilenet from "@tensorflow-models/mobilenet";
import './App.css';
import { useState, useEffect, useRef } from 'react';


function App() {
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([])

  const imageRef = useRef()


  const loadModel = async () => {
    setIsModelLoading(true)
    try {
      const model = await mobilenet.load()
      setModel(model)
      setIsModelLoading(false)
    } catch (error) {
      console.log(error)
      setIsModelLoading(false)
    }
  }


  const uploadImage = (e) => {
    const { files } = e.target
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
    } else {
      setImageURL(null)
    }
  }

  const identify = async () => {
    const results = await model.classify(imageRef.current)
    setResults(results)
  }

  useEffect(() => {
    loadModel()
  }, [])


  if (isModelLoading) {
    return <h2>Model Loading...</h2>
  }

  console.log(results)

  return (
    <div className="App">
      <h1 className="header">Image Identification App</h1>
      <div className="inputholder">
        <input type='file' accept='image/*' capture='camera' className="uploadInput" onChange={uploadImage} />
      </div>
      <div className="MainWrapper">
        <div className="'MainContent">
          <div className="imageHolder">
            {imageURL && <img src={imageURL} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef} />}
          </div>
          {results.length > 0 && <div className='resultsHolder'>
            {results.map((result, index) => {
              return (
                <div className='result' key={result.className}>
                  <span className='name'>{result.className}</span>
                  <span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess' style={{color: 'white', backgroundColor: 'black'}}>Best Guess</span>}</span>
                </div>
              )
            })}
          </div>}
            </div>

        {imageURL && <button className='button' onClick={identify}>Identify Image</button>}
      </div>
    </div>
  );
}

export default App;
