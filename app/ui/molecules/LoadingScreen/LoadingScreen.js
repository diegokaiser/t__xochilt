const LoadingScreen = ({

}) => {
  return (
    <>
      <div className="loadingScreen">
        <svg className="loaderIco" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path className="spinner_ngNb" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" transform="translate(12, 12) scale(0)"/>
          <path className="spinner_ngNb spinner_6TBP" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" transform="translate(12, 12) scale(0)"/>
        </svg>
      </div>
    </>
  )
}

export default LoadingScreen
