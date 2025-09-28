import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Summary from './components/Summary';
import {useState} from 'react';
function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  return (
    <>
    <main className='container'>
      <Header />
      {
        uploadedFile ?
        <Summary file={uploadedFile} /> : 
        <FileUpload setFile={setUploadedFile}/>

      }
      
    </main>
    </> 

  )
}

export default App
